export type PlanCode = "gratis" | "starter" | "silber" | "gold" | "platin" | "diamant";

export type Plan = {
  code: PlanCode;
  label: string;
  priceEur: number;
  durationDays: number | null;
  stripeLookupKey?: string;
  envPriceIdKey?: string;
  monthlyVerificationLimit: number;
  oneOff?: boolean;
};

export const PLANS: Record<PlanCode, Plan> = {
  gratis: {
    code: "gratis",
    label: "Gratis",
    priceEur: 0,
    durationDays: null,
    monthlyVerificationLimit: 3
  },
  starter: {
    code: "starter",
    label: "Starter — 3 Monate alles drin",
    priceEur: 9.9,
    durationDays: 90,
    stripeLookupKey: "starter_9_90_3m",
    envPriceIdKey: "STRIPE_STARTER_PRICE_ID",
    monthlyVerificationLimit: -1,
    oneOff: true
  },
  silber: {
    code: "silber",
    label: "Silber",
    priceEur: 49,
    durationDays: null,
    monthlyVerificationLimit: 50
  },
  gold: {
    code: "gold",
    label: "Gold",
    priceEur: 99,
    durationDays: null,
    monthlyVerificationLimit: 500
  },
  platin: {
    code: "platin",
    label: "Platin",
    priceEur: 199,
    durationDays: null,
    monthlyVerificationLimit: -1
  },
  diamant: {
    code: "diamant",
    label: "Diamant",
    priceEur: 499,
    durationDays: null,
    monthlyVerificationLimit: -1
  }
};

export const STARTER_DURATION_DAYS = 90;
export const REFERRAL_BONUS_DAYS = 30;
export const REFERRALS_PER_BONUS = 3;
