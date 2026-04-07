/* eslint-disable @typescript-eslint/no-explicit-any */
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
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    if (!sig) {
      return NextResponse.json(
        { error: true, message: 'Stripe-Signatur fehlt', code: 'MISSING_SIGNATURE' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    let event: any;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (sigErr: any) {
      console.error('[Stripe Webhook] Signature verification failed:', sigErr.message);
      return NextResponse.json(
        { error: true, message: 'Webhook-Signatur ungültig', code: 'INVALID_SIGNATURE' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const obj = event.data.object as any;

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const customerId = obj.customer as string;
      const customer = await stripe.customers.retrieve(customerId) as any;
      const userId = customer.metadata?.supabase_user_id;
      if (userId) {
        const { error: upsertError } = await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: obj.id,
          status: obj.status,
          plan_id: obj.items?.data[0]?.price?.lookup_key || 'unknown',
          current_period_end: obj.current_period_end,
        }, { onConflict: 'stripe_subscription_id' });

        if (upsertError) {
          console.error('[Stripe Webhook] Subscription upsert failed:', upsertError);
        }
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', obj.id);

      if (updateError) {
        console.error('[Stripe Webhook] Subscription cancel update failed:', updateError);
      }
    }

    await supabaseAdmin.from('webhook_events').insert({
      event_type: event.type,
      payload: event.data.object,
      processed_at: new Date().toISOString(),
    });

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Stripe Webhook]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Webhook-Verarbeitung fehlgeschlagen', code: 'WEBHOOK_FAILED' },
      { status: 500 }
    );
  }
}
