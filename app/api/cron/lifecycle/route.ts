import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daily cron (see vercel.json). Finds Starter users at D-30 / D-5 / D-0 and
// emits a lifecycle nudge. Without RESEND_API_KEY the route logs and records
// the send — stages are still deduped via the lifecycle_sends ledger so
// enabling Resend later won't double-fire.

type Stage = "d_minus_30" | "d_minus_5" | "expired";

const STAGE_WINDOWS: { stage: Stage; minDays: number; maxDays: number }[] = [
  { stage: "d_minus_30", minDays: 28, maxDays: 30 },
  { stage: "d_minus_5", minDays: 3, maxDays: 5 },
  { stage: "expired", minDays: -7, maxDays: 0 }
];

const STAGE_SUBJECT: Record<Stage, string> = {
  d_minus_30: "Dein Starter läuft in 30 Tagen ab",
  d_minus_5: "Noch 5 Tage Starter — jetzt verlängern?",
  expired: "Dein Starter ist abgelaufen — willkommen zurück?"
};

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return runLifecycle();
}

// Vercel Cron sends GET by default; accept both.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  if (!isVercelCron && (!secret || auth !== `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runLifecycle();
}

async function runLifecycle() {
  const db = createServiceRoleClient();
  const now = Date.now();
  const results: Record<Stage, number> = {
    d_minus_30: 0,
    d_minus_5: 0,
    expired: 0
  };

  for (const window of STAGE_WINDOWS) {
    const minUntil = new Date(now + window.minDays * 86_400_000).toISOString();
    const maxUntil = new Date(now + window.maxDays * 86_400_000).toISOString();
    const [lo, hi] = [minUntil, maxUntil].sort();

    const { data: candidates } = await db
      .schema("creatorseal")
      .from("profiles")
      .select("user_id, email, starter_access_until")
      .eq("plan_code", "starter")
      .gte("starter_access_until", lo)
      .lte("starter_access_until", hi);

    for (const row of candidates || []) {
      if (!row.email) continue;

      const { data: existing } = await db
        .schema("creatorseal")
        .from("lifecycle_sends")
        .select("id")
        .eq("user_id", row.user_id)
        .eq("stage", window.stage)
        .maybeSingle();
      if (existing) continue;

      const ok = await sendLifecycleEmail({
        to: row.email,
        stage: window.stage,
        starterUntil: row.starter_access_until
      });
      if (!ok) continue;

      await db
        .schema("creatorseal")
        .from("lifecycle_sends")
        .insert({ user_id: row.user_id, stage: window.stage });
      results[window.stage] += 1;
    }
  }

  return NextResponse.json({ ok: true, sent: results });
}

async function sendLifecycleEmail(args: {
  to: string;
  stage: Stage;
  starterUntil: string | null;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "noreply@realsyncdynamics.de";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de";

  const subject = STAGE_SUBJECT[args.stage];
  const body = buildBody(args.stage, siteUrl, args.starterUntil);

  if (!apiKey) {
    console.info(
      `[lifecycle] would email to=${args.to} stage=${args.stage} subject="${subject}"`
    );
    return true;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: args.to,
      subject,
      text: body
    })
  });
  if (!res.ok) {
    console.error(
      `[lifecycle] resend failed to=${args.to} stage=${args.stage} status=${res.status}`
    );
    return false;
  }
  return true;
}

function buildBody(stage: Stage, siteUrl: string, until: string | null): string {
  const renewUrl = `${siteUrl}/starter`;
  switch (stage) {
    case "d_minus_30":
      return `Hallo,\n\nDein RealSync-Starter-Paket läuft am ${formatDate(until)} ab. Wenn du verlängern willst, kannst du einfach nochmal €9,90 für weitere 90 Tage zahlen:\n\n${renewUrl}\n\nKein Abo, keine stille Verlängerung.\n— RealSync Dynamics`;
    case "d_minus_5":
      return `Hallo,\n\nNoch 5 Tage Starter-Zugriff bis ${formatDate(until)}. Wenn du dranbleiben willst:\n\n${renewUrl}\n\n— RealSync Dynamics`;
    case "expired":
      return `Hallo,\n\nDein Starter-Zugriff ist am ${formatDate(until)} abgelaufen. Wenn du nochmal 90 Tage willst:\n\n${renewUrl}\n\n— RealSync Dynamics`;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
