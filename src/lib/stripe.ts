import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, {
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    prices: {},
    limits: { posts_per_month: 50, team_members: 1 },
  },
  starter: {
    name: "Starter",
    prices: { ads: "price_ads_starter", analytics: "price_analytics_starter" },
    limits: { posts_per_month: 500, team_members: 3 },
  },
  pro: {
    name: "Pro",
    prices: { ads: "price_ads_pro", analytics: "price_analytics_pro" },
    limits: { posts_per_month: 5000, team_members: 10 },
  },
};
