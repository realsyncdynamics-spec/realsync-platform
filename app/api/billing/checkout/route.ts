import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { PLANS, type PlanCode } from "@/lib/plans";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  planCode?: PlanCode;
  referralCode?: string;
};

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const ipLimit = rateLimit(`checkout:${ip}`, 5, 60_000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "retry-after": Math.ceil(ipLimit.resetInMs / 1000).toString() } }
    );
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const planCode: PlanCode = body.planCode ?? "starter";
  const plan = PLANS[planCode];
  if (!plan || !plan.envPriceIdKey) {
    return NextResponse.json({ error: "Plan not purchasable" }, { status: 400 });
  }

  const priceId = process.env[plan.envPriceIdKey];
  if (!priceId) {
    return NextResponse.json(
      { error: `${plan.envPriceIdKey} not configured` },
      { status: 503 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de";
  const stripe = getStripe();
  const admin = createServiceRoleClient();

  const { data: profile } = await admin
    .schema("creatorseal")
    .from("profiles")
    .select("stripe_customer_id, email, referral_code")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id }
    });
    customerId = customer.id;
    await admin
      .schema("creatorseal")
      .from("profiles")
      .upsert({
        user_id: user.id,
        email: user.email ?? "",
        stripe_customer_id: customerId,
        plan_code: profile?.referral_code ? undefined : "gratis"
      });
  }

  const referralCode =
    body.referralCode ||
    req.cookies.get("rs_ref")?.value ||
    null;

  const session = await stripe.checkout.sessions.create({
    mode: plan.oneOff ? "payment" : "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?starter=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/starter?canceled=1`,
    metadata: {
      user_id: user.id,
      plan_code: plan.code,
      plan_level: plan.code,
      ...(referralCode ? { referred_by_code: referralCode } : {})
    },
    payment_intent_data: plan.oneOff
      ? {
          metadata: {
            user_id: user.id,
            plan_code: plan.code,
            ...(referralCode ? { referred_by_code: referralCode } : {})
          }
        }
      : undefined
  });

  return NextResponse.json({ url: session.url });
}
