import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PLAN_PRICE_MAP: Record<string, { plan: string; cents: number }> = {
  price_bronze:   { plan:'bronze',  cents:1900  },
  price_silber:   { plan:'silber',  cents:4900  },
  price_gold:     { plan:'gold',    cents:9900  },
  price_platin:   { plan:'platin',  cents:19900 },
  price_diamant:  { plan:'diamant', cents:49900 },
};

function buildPriceMap() {
  const map: Record<string, { plan: string; cents: number }> = { ...PLAN_PRICE_MAP };
  const keys = ['BRONZE','SILBER','GOLD','PLATIN','DIAMANT'];
  const cents = [1900, 4900, 9900, 19900, 49900];
  keys.forEach((k, i) => {
    const mid = process.env[`STRIPE_${k}_PRICE_ID`];
    const yid = process.env[`STRIPE_${k}_YEARLY_PRICE_ID`];
    if (mid) map[mid] = { plan: k.toLowerCase(), cents: cents[i] };
    if (yid) map[yid] = { plan: k.toLowerCase(), cents: Math.round(cents[i] * 0.8 * 12) };
  });
  return map;
}

export async function POST(request: NextRequest) {
  // Lazy init Stripe
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' });

  const body      = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();
  const priceMap = buildPriceMap();

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const priceId  = sub.items.data[0]?.price.id;
      const planInfo = priceMap[priceId];
      if (!planInfo) break;

      const userId = sub.metadata?.user_id;
      if (!userId) break;

      await supabase.from('subscriptions').upsert({
        user_id:             userId,
        plan_id:             planInfo.plan,
        status:              sub.status === 'active' ? 'active' : sub.status,
        stripe_sub_id:       sub.id,
        stripe_customer_id:  sub.customer,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end:  new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
        updated_at:          new Date().toISOString(),
      }, { onConflict: 'stripe_sub_id' });

      await supabase.from('profiles').update({
        plan_id:         planInfo.plan,
        plan_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
        plan_source:     'stripe',
        updated_at:      new Date().toISOString(),
      }).eq('id', userId);

      // Award referral coins — 50%
      await supabase.rpc('award_referral_coins', {
        p_referred_id:      userId,
        p_plan_id:          planInfo.plan,
        p_plan_price_cents: planInfo.cents,
      }).catch(() => {});
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const { data: dbSub } = await supabase.from('subscriptions')
        .select('user_id').eq('stripe_sub_id', sub.id).single();
      if (dbSub) {
        await supabase.from('profiles').update({
          plan_id:'gratis', plan_expires_at:null, updated_at:new Date().toISOString(),
        }).eq('id', dbSub.user_id);
        await supabase.from('subscriptions')
          .update({ status:'cancelled', updated_at:new Date().toISOString() })
          .eq('stripe_sub_id', sub.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
