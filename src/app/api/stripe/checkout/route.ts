import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS as CENTRAL_PLANS, type PlanId } from '@/lib/plans';

export async function POST(request: NextRequest) {
  try {
    // Lazy init Stripe — avoids build-time crash when ENV missing
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' });

    const { planId, billing = 'monthly', coinsRedeem = 0 } = await request.json();

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: true, message: 'Nicht eingeloggt', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const plan = CENTRAL_PLANS[planId as PlanId];
    if (!plan || planId === 'gratis') {
      return NextResponse.json(
        { error: true, message: 'Ungültiger Plan', code: 'INVALID_PLAN' },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, coin_balance, stripe_customer_id')
      .eq('id', user.id)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realsync-platform.vercel.app';

    // Get price ID from env
    const priceKey = `STRIPE_${planId.toUpperCase()}_${billing === 'yearly' ? 'YEARLY_' : ''}PRICE_ID`;
    const priceId = process.env[priceKey];
    if (!priceId) {
      return NextResponse.json(
        { error: true, message: `Stripe Preis-ID fehlt: ${priceKey}`, code: 'MISSING_STRIPE_PRICE' },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    let stripeCustomerId = (profile as any)?.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: (profile as any)?.full_name || user.email?.split('@')[0],
        metadata: { user_id: user.id },
      });
      stripeCustomerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: stripeCustomerId }).eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer:    stripeCustomerId,
      mode:        'subscription',
      line_items:  [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/hub?plan_success=${planId}`,
      cancel_url:  `${appUrl}/pricing`,
      subscription_data: { metadata: { user_id: user.id, plan_id: planId } },
      metadata:    { user_id: user.id, plan_id: planId },
      allow_promotion_codes: true,
      locale: 'de',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe Checkout]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Checkout fehlgeschlagen', code: 'CHECKOUT_FAILED' },
      { status: 500 }
    );
  }
}
