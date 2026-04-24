import Stripe from "stripe";

export const STRIPE_API_VERSION = "2024-11-20.acacia" as const;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }
  return new Stripe(key, { apiVersion: STRIPE_API_VERSION });
}
