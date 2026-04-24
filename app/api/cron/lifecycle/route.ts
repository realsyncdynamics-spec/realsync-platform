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
  const text = buildBody(args.stage, siteUrl, args.starterUntil);
  const html = buildHtml(args.stage, siteUrl, args.starterUntil);

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
      text,
      html
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

function buildHtml(stage: Stage, siteUrl: string, until: string | null): string {
  const renewUrl = `${siteUrl}/starter`;
  const headline: Record<Stage, string> = {
    d_minus_30: `Dein Starter läuft in 30 Tagen ab`,
    d_minus_5: `Noch 5 Tage Starter`,
    expired: `Dein Starter ist abgelaufen`
  };
  const intro: Record<Stage, string> = {
    d_minus_30: `Dein RealSync-Starter-Paket endet am <strong>${formatDate(until)}</strong>. Wenn du dranbleiben willst, kannst du einfach nochmal €9,90 für weitere 90 Tage zahlen — kein Abo, kein Haken.`,
    d_minus_5: `Noch 5 Tage Vollzugriff bis <strong>${formatDate(until)}</strong>. Danach endet dein Starter ohne weitere Abbuchung. Wenn du verlängern willst:`,
    expired: `Dein Starter-Zugriff ist am <strong>${formatDate(until)}</strong> abgelaufen. Wenn du nochmal 90 Tage willst, kein Stress — gleicher Preis, kein Abo.`
  };

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${headline[stage]}</title>
  </head>
  <body style="margin:0;padding:0;background:#0a0a0a;color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111318;border:1px solid #1f232b;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#ffd700;font-weight:700;margin-bottom:16px;">
                  RealSync Dynamics
                </div>
                <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.01em;color:#f5f5f5;margin:0 0 16px 0;line-height:1.2;">
                  ${headline[stage]}
                </h1>
                <p style="font-size:15px;line-height:1.6;color:#b8bcc5;margin:0 0 28px 0;">
                  ${intro[stage]}
                </p>
                <a href="${renewUrl}" style="display:inline-block;background:#ffd700;color:#0a0a0a;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;">
                  Starter für €9,90 verlängern →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 28px 32px;border-top:1px solid #1f232b;">
                <p style="font-size:11px;color:#6a6f78;line-height:1.7;margin:0;">
                  Einmalzahlung, 90 Tage, kein Abo, keine stille Verlängerung.
                  14 Tage Widerrufsrecht laut deutschem Verbraucherrecht.
                </p>
              </td>
            </tr>
          </table>
          <p style="font-size:10px;color:#4a4f58;margin-top:16px;">
            RealSync Dynamics · <a href="${siteUrl}" style="color:#6a6f78;text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
