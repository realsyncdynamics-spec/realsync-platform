import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' });

const PLANS = {
  bronze:  { monthly: process.env.STRIPE_BRONZE_PRICE_ID!,  yearly: process.env.STRIPE_BRONZE_YEARLY_PRICE_ID!,  name: 'Bronze',  cents: 1900 },
  silber:  { monthly: process.env.STRIPE_SILBER_PRICE_ID!,  yearly: process.env.STRIPE_SILBER_YEARLY_PRICE_ID!,  name: 'Silber',  cents: 4900 },
  gold:    { monthly: process.env.STRIPE_GOLD_PRICE_ID!,    yearly: process.env.STRIPE_GOLD_YEARLY_PRICE_ID!,    name: 'Gold',    cents: 9900 },
  platin:  { monthly: process.env.STRIPE_PLATIN_PRICE_ID!,  yearly: process.env.STRIPE_PLATIN_YEARLY_PRICE_ID!,  name: 'Platin',  cents: 19900 },
  diamant: { monthly: process.env.STRIPE_DIAMANT_PRICE_ID!, yearly: process.env.STRIPE_DIAMANT_YEARLY_PRICE_ID!, name: 'Diamant', cents: 49900 },
};

export async function POST(request: NextRequest) {
  try {
    const { planId, billing = 'monthly', coinsRedeem = 0 } = await request.json();

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) return NextResponse.json({ error: 'Ungültiger Plan' }, { status: 400 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, coin_balance, stripe_customer_id')
      .eq('id', user.id)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realsync-platform.vercel.app';

    // Coins redemption path
    if (coinsRedeem > 0 && profile && profile.coin_balance >= plan.cents) {
      const pi = await stripe.paymentIntents.create({
        amount: 0, // free via coins
        currency: 'eur',
        metadata: {
          user_id:    user.id,
          plan_id:    planId,
          coins_used: plan.cents.toString(),
        },
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });
      return NextResponse.json({ success: true, via: 'coins', clientSecret: pi.client_secret });
    }

    // Get or create Stripe customer
    let stripeCustomerId = profile?.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email:    user.email,
        name:     profile?.full_name || user.email?.split('@')[0],
        metadata: { user_id: user.id },
      });
      stripeCustomerId = customer.id;
      await supabase.from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer:    stripeCustomerId,
      mode:        'subscription',
      line_items:  [{ price: billing === 'yearly' ? plan.yearly : plan.monthly, quantity: 1 }],
      success_url: `${appUrl}/hub?plan_success=${planId}`,
      cancel_url:  `${appUrl}/pricing`,
      subscription_data: {
        metadata: { user_id: user.id, plan_id: planId },
      },
      metadata: { user_id: user.id, plan_id: planId },
      allow_promotion_codes: true,
      locale: 'de',
      custom_text: {
        submit: { message: 'Keine versteckten Kosten · Jederzeit kündbar' },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe Checkout]', err);
    return NextResponse.json({ error: err.message || 'Checkout fehlgeschlagen' }, { status: 500 });
  }
}
