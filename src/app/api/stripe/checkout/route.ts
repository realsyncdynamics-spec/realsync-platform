import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

const PLANS = {
  bronze: {
    name: 'Bronze',
    priceId: process.env.STRIPE_BRONZE_PRICE_ID || 'price_bronze_monthly',
    price: 1900,
    currency: 'eur',
  },
  silber: {
    name: 'Silber',
    priceId: process.env.STRIPE_SILBER_PRICE_ID || 'price_silber_monthly',
    price: 3900,
    currency: 'eur',
  },
  gold: {
    name: 'Gold',
    priceId: process.env.STRIPE_GOLD_PRICE_ID || 'price_gold_monthly',
    price: 7900,
    currency: 'eur',
  },
} as const;

// Feature-Limits pro Plan fuer ALLE 13 Apps im Oekosystem
export const PLAN_FEATURES = {
  free: {
    c2pa: { scans: 50, reports: false },
    watermark: { files: 100, customBranding: false },
    blockchain: { hashes: 25, realtime: false },
    certificates: { count: 10, customTemplates: false },
    barcode: { count: 50, analytics: false },
    adEngine: { campaigns: 2, aiGeneration: false },
    analytics: { retention: 7, exportCsv: false },
    storage: { gb: 1, cdn: false },
    workflows: { count: 3, advanced: false },
    collabHub: { members: 2, brandDeals: false },
    schedulemaster: { posts: 30, multiPlatform: false },
    fanconnect: { communities: 1, directMessages: false },
    trendradar: { alerts: 5, historicalData: false },
  },
  bronze: {
    c2pa: { scans: 500, reports: true },
    watermark: { files: 1000, customBranding: false },
    blockchain: { hashes: 250, realtime: false },
    certificates: { count: 100, customTemplates: true },
    barcode: { count: 500, analytics: true },
    adEngine: { campaigns: 10, aiGeneration: false },
    analytics: { retention: 30, exportCsv: true },
    storage: { gb: 10, cdn: false },
    workflows: { count: 10, advanced: false },
    collabHub: { members: 10, brandDeals: true },
    schedulemaster: { posts: 150, multiPlatform: true },
    fanconnect: { communities: 3, directMessages: true },
    trendradar: { alerts: 25, historicalData: false },
  },
  silber: {
    c2pa: { scans: 5000, reports: true },
    watermark: { files: 10000, customBranding: true },
    blockchain: { hashes: 2500, realtime: true },
    certificates: { count: 1000, customTemplates: true },
    barcode: { count: 5000, analytics: true },
    adEngine: { campaigns: 50, aiGeneration: true },
    analytics: { retention: 90, exportCsv: true },
    storage: { gb: 50, cdn: true },
    workflows: { count: 50, advanced: true },
    collabHub: { members: 50, brandDeals: true },
    schedulemaster: { posts: 500, multiPlatform: true },
    fanconnect: { communities: 10, directMessages: true },
    trendradar: { alerts: 100, historicalData: true },
  },
  gold: {
    c2pa: { scans: -1, reports: true },
    watermark: { files: -1, customBranding: true },
    blockchain: { hashes: -1, realtime: true },
    certificates: { count: -1, customTemplates: true },
    barcode: { count: -1, analytics: true },
    adEngine: { campaigns: -1, aiGeneration: true },
    analytics: { retention: 365, exportCsv: true },
    storage: { gb: 500, cdn: true },
    workflows: { count: -1, advanced: true },
    collabHub: { members: -1, brandDeals: true },
    schedulemaster: { posts: -1, multiPlatform: true },
    fanconnect: { communities: -1, directMessages: true },
    trendradar: { alerts: -1, historicalData: true },
  },
};

type PlanKey = 'bronze' | 'silber' | 'gold';

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();
    const planKey = plan as PlanKey;

    if (!PLANS[planKey]) {
      return NextResponse.json({ error: 'Invalid plan. Choose bronze, silber, or gold.' }, { status: 400 });
    }

    const selectedPlan = PLANS[planKey];

    // Production Stripe Integration (uncomment with real keys)
    // const stripe = new Stripe(STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   customer_email: email,
    //   line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
    //   success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${planKey}`,
    //   cancel_url: `${req.nextUrl.origin}/pricing`,
    //   metadata: { plan: planKey, email },
    // });
    // return NextResponse.json({ url: session.url, sessionId: session.id });

    // Mock Checkout (Development)
    const mockSessionId = `cs_mock_${Date.now()}_${planKey}`;
    return NextResponse.json({
      url: `${req.nextUrl.origin}/checkout/success?session_id=${mockSessionId}&plan=${planKey}`,
      sessionId: mockSessionId,
      plan: selectedPlan,
      features: PLAN_FEATURES[planKey],
    });
  } catch {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
