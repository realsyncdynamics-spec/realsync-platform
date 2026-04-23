import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const startedAt = Date.now();
  const checks: Record<string, { ok: boolean; latency_ms: number; error?: string }> =
    {};

  // DB check
  try {
    const t0 = Date.now();
    const supabase = await createClient();
    const { error } = await supabase
      .schema("creatorseal")
      .from("plans")
      .select("plan_code", { count: "exact", head: true });
    checks.db = {
      ok: !error,
      latency_ms: Date.now() - t0,
      error: error?.message
    };
  } catch (e) {
    checks.db = {
      ok: false,
      latency_ms: Date.now() - startedAt,
      error: e instanceof Error ? e.message : "unknown"
    };
  }

  // Stripe check (only if key configured — don't fail health if it's not set yet)
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const t0 = Date.now();
      const res = await fetch("https://api.stripe.com/v1/prices?limit=1", {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
        },
        cache: "no-store"
      });
      checks.stripe = {
        ok: res.ok,
        latency_ms: Date.now() - t0,
        error: res.ok ? undefined : `HTTP ${res.status}`
      };
    } catch (e) {
      checks.stripe = {
        ok: false,
        latency_ms: 0,
        error: e instanceof Error ? e.message : "unknown"
      };
    }
  }

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      ok: allOk,
      checks,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev",
      uptime_seconds: Math.floor(process.uptime())
    },
    { status: allOk ? 200 : 503 }
  );
}
