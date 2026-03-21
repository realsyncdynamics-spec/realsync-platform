import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

const PLANS = {
  bronze: {
    name: 'Bronze',
    priceId: process.env.STRIPE_BRONZE_PRICE_ID || 'price_bronze_monthly',
    price: 1900, // 19.00 EUR
    currency: 'eur',
  },
  silber: {
    name: 'Silber',
    priceId: process.env.STRIPE_SILBER_PRICE_ID || 'price_silber_monthly',
    price: 4900, // 49.00 EUR
    currency: 'eur',
  },
  gold: {
    name: 'Gold',
    priceId: process.env.STRIPE_GOLD_PRICE_ID || 'price_gold_monthly',
    price: 9900, // 99.00 EUR
    currency: 'eur',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { plan, email } = await request.json();

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    const origin = request.headers.get('origin') || 'https://realsync-platform.vercel.app';

    // If Stripe key is configured, create real checkout session
    if (STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.startsWith('sk_')) {
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'subscription',
          'payment_method_types[0]': 'card',
          'line_items[0][price]': selectedPlan.priceId,
          'line_items[0][quantity]': '1',
          'success_url': `${origin}/dashboard?checkout=success&plan=${plan}`,
          'cancel_url': `${origin}/pricing?checkout=cancelled`,
          ...(email ? { 'customer_email': email } : {}),
          'metadata[plan]': plan,
          'metadata[platform]': 'realsync',
          'allow_promotion_codes': 'true',
        }),
      });

      const session = await response.json();

      if (session.error) {
        return NextResponse.json({ error: session.error.message }, { status: 400 });
      }

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
      });
    }

    // Demo mode - return mock checkout URL
    return NextResponse.json({
      sessionId: `demo_${plan}_${Date.now()}`,
      url: `${origin}/dashboard?checkout=success&plan=${plan}&demo=true`,
      demo: true,
      plan: selectedPlan.name,
      price: `${(selectedPlan.price / 100).toFixed(2)} EUR/Monat`,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
