import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const customerId = obj.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as any;
    const userId = customer.metadata?.supabase_user_id;
    if (userId) {
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: obj.id,
        status: obj.status,
        plan_id: obj.items?.data[0]?.price?.lookup_key || 'unknown',
        current_period_end: obj.current_period_end,
      }, { onConflict: 'stripe_subscription_id' });
    }
  } else if (event.type === 'customer.subscription.deleted') {
    await supabaseAdmin.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', obj.id);
  }

  await supabaseAdmin.from('webhook_events').insert({
    event_type: event.type,
    payload: event.data.object,
    processed_at: new Date().toISOString(),
  });

  return NextResponse.json({ received: true });
}
