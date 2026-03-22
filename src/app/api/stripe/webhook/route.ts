import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' });

const PLAN_PRICE_MAP: Record<string, { plan: string; cents: number }> = {
  [process.env.STRIPE_BRONZE_PRICE_ID  || 'price_bronze']:  { plan: 'bronze',  cents: 1900 },
  [process.env.STRIPE_SILBER_PRICE_ID  || 'price_silber']:  { plan: 'silber',  cents: 4900 },
  [process.env.STRIPE_GOLD_PRICE_ID    || 'price_gold']:    { plan: 'gold',    cents: 9900 },
  [process.env.STRIPE_PLATIN_PRICE_ID  || 'price_platin']:  { plan: 'platin',  cents: 19900 },
  [process.env.STRIPE_DIAMANT_PRICE_ID || 'price_diamant']: { plan: 'diamant', cents: 49900 },
  // Yearly variants
  [process.env.STRIPE_BRONZE_YEARLY_PRICE_ID  || 'price_bronze_y']:  { plan: 'bronze',  cents: 15200 },
  [process.env.STRIPE_SILBER_YEARLY_PRICE_ID  || 'price_silber_y']:  { plan: 'silber',  cents: 39200 },
  [process.env.STRIPE_GOLD_YEARLY_PRICE_ID    || 'price_gold_y']:    { plan: 'gold',    cents: 79200 },
};

export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {

    // ── New subscription created ─────────────────────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const priceId    = sub.items.data[0]?.price.id;
      const planInfo   = PLAN_PRICE_MAP[priceId];

      if (!planInfo) break;

      // Find user by stripe customer id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()
        .catch(() => ({ data: null }));

      // Also check subscriptions table
      const userId = profile?.id || (sub.metadata?.user_id as string);
      if (!userId) break;

      // Update subscription record
      await supabase.from('subscriptions').upsert({
        user_id:             userId,
        plan_id:             planInfo.plan,
        status:              sub.status === 'active' ? 'active' : sub.status,
        stripe_sub_id:       sub.id,
        stripe_customer_id:  customerId,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end:  new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
        updated_at:          new Date().toISOString(),
      }, { onConflict: 'stripe_sub_id' });

      // Update profile plan
      await supabase.from('profiles').update({
        plan_id:         planInfo.plan,
        plan_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
        plan_source:     'stripe',
        updated_at:      new Date().toISOString(),
      }).eq('id', userId);

      // Award referral coins (50% of plan price)
      await supabase.rpc('award_referral_coins', {
        p_referred_id:       userId,
        p_plan_id:           planInfo.plan,
        p_plan_price_cents:  planInfo.cents,
      });

      console.log(`[Stripe] Plan ${planInfo.plan} activated for user ${userId}`);
      break;
    }

    // ── Subscription cancelled ───────────────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('stripe_sub_id', sub.id);

      // Find user and downgrade to gratis
      const { data: dbSub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_sub_id', sub.id)
        .single();

      if (dbSub) {
        await supabase.from('profiles').update({
          plan_id: 'gratis', plan_expires_at: null, updated_at: new Date().toISOString(),
        }).eq('id', dbSub.user_id);
      }
      break;
    }

    // ── One-time payment (coins redemption) ──────────────
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const userId  = pi.metadata?.user_id;
      const planId  = pi.metadata?.plan_id;
      const coinsUsed = parseInt(pi.metadata?.coins_used || '0');

      if (userId && planId && coinsUsed > 0) {
        // Deduct coins
        await supabase.from('coin_transactions').insert({
          user_id:     userId,
          type:        'spend',
          amount:      -coinsUsed,
          description: `${planId} Plan mit Coins eingelöst`,
          ref_plan_id: planId,
        });

        const oneMonth = new Date();
        oneMonth.setMonth(oneMonth.getMonth() + 1);
        await supabase.from('profiles').update({
          plan_id: planId, plan_expires_at: oneMonth.toISOString(), plan_source: 'coins',
        }).eq('id', userId);
      }
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
