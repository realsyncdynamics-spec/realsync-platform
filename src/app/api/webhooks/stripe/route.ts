import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  const obj = event.data.object as any;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const customerId = obj.customer as string;
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
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
      break;
    }
    case 'customer.subscription.deleted': {
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', obj.id);
      break;
    }
  }

  await supabaseAdmin.from('webhook_events').insert({
    event_type: event.type,
    payload: event.data.object,
    processed_at: new Date().toISOString(),
  });

  return NextResponse.json({ received: true });
}
