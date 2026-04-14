import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Reverse-map Stripe price ID → our plan_id using env vars
function planIdFromPriceId(priceId: string): string {
  const map: Record<string, string> = {};
  if (process.env.STRIPE_BRONZE_PRICE_ID)  map[process.env.STRIPE_BRONZE_PRICE_ID]  = 'bronze';
  if (process.env.STRIPE_SILBER_PRICE_ID)  map[process.env.STRIPE_SILBER_PRICE_ID]  = 'silber';
  if (process.env.STRIPE_GOLD_PRICE_ID)    map[process.env.STRIPE_GOLD_PRICE_ID]    = 'gold';
  if (process.env.STRIPE_PLATIN_PRICE_ID)  map[process.env.STRIPE_PLATIN_PRICE_ID]  = 'platin';
  if (process.env.STRIPE_DIAMANT_PRICE_ID) map[process.env.STRIPE_DIAMANT_PRICE_ID] = 'diamant';
  return map[priceId] || 'unknown';
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const stripe = getStripe();
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const obj = event.data.object as any;

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const customerId = obj.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as any;
    const userId: string | undefined = customer.metadata?.supabase_user_id;
    if (!userId) {
      // Customer created before this convention — skip profile update
      return NextResponse.json({ received: true });
    }

    const priceId: string = obj.items?.data[0]?.price?.id || '';
    const planId = planIdFromPriceId(priceId);
    const periodEnd = obj.current_period_end
      ? new Date(obj.current_period_end * 1000).toISOString()
      : null;

    // 1. Upsert into subscriptions table
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_sub_id: obj.id,
      status: obj.status,
      plan_id: planId,
      billing_cycle: obj.items?.data[0]?.plan?.interval === 'year' ? 'yearly' : 'monthly',
      current_period_end: periodEnd,
    }, { onConflict: 'stripe_sub_id' });

    // 2. Update profiles.plan_id so the app reflects the paid plan immediately
    if (planId !== 'unknown' && obj.status === 'active') {
      await supabaseAdmin.from('profiles').update({
        plan_id: planId,
        plan_expires_at: periodEnd,
        plan_source: 'stripe',
        stripe_customer_id: customerId,
      }).eq('id', userId);
    }

  } else if (event.type === 'customer.subscription.deleted') {
    // Mark subscription canceled
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_sub_id', obj.id);

    // Revert profile to gratis
    const customerId = obj.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as any;
    const userId: string | undefined = customer.metadata?.supabase_user_id;
    if (userId) {
      await supabaseAdmin.from('profiles').update({
        plan_id: 'gratis',
        plan_expires_at: null,
        plan_source: 'direct',
      }).eq('id', userId);
    }
  }

  return NextResponse.json({ received: true });
}
