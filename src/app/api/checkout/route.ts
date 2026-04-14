import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import type { PlanId } from "@/lib/plans";

// Map plan IDs to Stripe price ID env vars (monthly)
const PLAN_PRICE_IDS: Record<string, string | undefined> = {
  bronze:  process.env.STRIPE_BRONZE_PRICE_ID,
  silber:  process.env.STRIPE_SILBER_PRICE_ID,
  gold:    process.env.STRIPE_GOLD_PRICE_ID,
  platin:  process.env.STRIPE_PLATIN_PRICE_ID,
  diamant: process.env.STRIPE_DIAMANT_PRICE_ID,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json();
  const planId: PlanId = body.planId;

  if (!planId || planId === 'gratis') {
    return NextResponse.json({ error: "Ungültiger Plan" }, { status: 400 });
  }

  const priceId = PLAN_PRICE_IDS[planId];
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert — bitte STRIPE_*_PRICE_ID setzen" },
      { status: 503 }
    );
  }

  const stripe = getStripe();

  // Get or create Stripe customer linked to this user
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  let customerId: string = profile?.stripe_customer_id || '';
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${req.nextUrl.origin}/checkout/success?plan_success=${planId}`,
    cancel_url: `${req.nextUrl.origin}/dashboard/billing?canceled=true`,
    // metadata on session (for checkout.session.completed webhook)
    metadata: { supabase_user_id: user.id, plan_id: planId },
    // metadata forwarded to subscription object (for customer.subscription.* webhooks)
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan_id: planId },
    },
  });

  return NextResponse.json({ url: session.url });
}
