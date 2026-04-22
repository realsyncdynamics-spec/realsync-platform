import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getStripePriceKey,
  getStripePriceId,
  UNIFIED_PRICES,
  APP_PLANS,
} from '../plans-config';
import { PLANS } from '@/lib/plans';

// ── getStripePriceKey ──────────────────────────────────────────────────────────

describe('getStripePriceKey', () => {
  it('returns the correct env key for monthly billing', () => {
    expect(getStripePriceKey('bronze', 'monthly')).toBe('STRIPE_BRONZE_PRICE_ID');
    expect(getStripePriceKey('silber', 'monthly')).toBe('STRIPE_SILBER_PRICE_ID');
    expect(getStripePriceKey('gold', 'monthly')).toBe('STRIPE_GOLD_PRICE_ID');
    expect(getStripePriceKey('platin', 'monthly')).toBe('STRIPE_PLATIN_PRICE_ID');
    expect(getStripePriceKey('diamant', 'monthly')).toBe('STRIPE_DIAMANT_PRICE_ID');
  });

  it('returns the correct env key for yearly billing', () => {
    expect(getStripePriceKey('bronze', 'yearly')).toBe('STRIPE_BRONZE_YEARLY_PRICE_ID');
    expect(getStripePriceKey('gold', 'yearly')).toBe('STRIPE_GOLD_YEARLY_PRICE_ID');
    expect(getStripePriceKey('diamant', 'yearly')).toBe('STRIPE_DIAMANT_YEARLY_PRICE_ID');
  });

  it('defaults to monthly when billing is not provided', () => {
    expect(getStripePriceKey('bronze')).toBe('STRIPE_BRONZE_PRICE_ID');
  });

  it('uppercases the plan id portion', () => {
    expect(getStripePriceKey('silber', 'monthly')).toContain('SILBER');
    expect(getStripePriceKey('platin', 'yearly')).toContain('PLATIN');
  });
});

// ── getStripePriceId ───────────────────────────────────────────────────────────

describe('getStripePriceId', () => {
  beforeEach(() => {
    process.env.STRIPE_GOLD_PRICE_ID = 'price_test_gold_monthly';
    process.env.STRIPE_GOLD_YEARLY_PRICE_ID = 'price_test_gold_yearly';
  });

  afterEach(() => {
    delete process.env.STRIPE_GOLD_PRICE_ID;
    delete process.env.STRIPE_GOLD_YEARLY_PRICE_ID;
    delete process.env.STRIPE_BRONZE_PRICE_ID;
  });

  it('returns the env variable value when set', () => {
    expect(getStripePriceId('gold', 'monthly')).toBe('price_test_gold_monthly');
    expect(getStripePriceId('gold', 'yearly')).toBe('price_test_gold_yearly');
  });

  it('returns undefined when env variable is not set', () => {
    expect(getStripePriceId('bronze', 'monthly')).toBeUndefined();
  });

  it('defaults to monthly billing when billing is not provided', () => {
    expect(getStripePriceId('gold')).toBe('price_test_gold_monthly');
  });
});

// ── UNIFIED_PRICES ─────────────────────────────────────────────────────────────

describe('UNIFIED_PRICES', () => {
  it('matches the source-of-truth PLANS for monthly prices', () => {
    const paid = ['bronze', 'silber', 'gold', 'platin', 'diamant'] as const;
    for (const id of paid) {
      expect(UNIFIED_PRICES[id].monthly).toBe(PLANS[id].price.monthly);
    }
  });

  it('matches the source-of-truth PLANS for yearly prices', () => {
    const paid = ['bronze', 'silber', 'gold', 'platin', 'diamant'] as const;
    for (const id of paid) {
      expect(UNIFIED_PRICES[id].yearly).toBe(PLANS[id].price.yearly);
    }
  });

  it('does not include gratis (free) plan', () => {
    expect((UNIFIED_PRICES as Record<string, unknown>)['gratis']).toBeUndefined();
  });
});

// ── APP_PLANS ──────────────────────────────────────────────────────────────────

describe('APP_PLANS', () => {
  it('has an entry for creatorseal', () => {
    expect(APP_PLANS.creatorseal).toBeDefined();
  });

  it('every app has all 6 plan tiers defined', () => {
    const tiers = ['gratis', 'bronze', 'silber', 'gold', 'platin', 'diamant'] as const;
    for (const [, tierMap] of Object.entries(APP_PLANS)) {
      for (const tier of tiers) {
        expect(tierMap[tier]).toBeDefined();
        expect(Array.isArray(tierMap[tier].features)).toBe(true);
        expect(tierMap[tier].daily_limit).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('daily_limit increases with plan tier for creatorseal', () => {
    const { gratis, bronze, silber } = APP_PLANS.creatorseal;
    expect(bronze.daily_limit).toBeGreaterThan(gratis.daily_limit);
    expect(silber.daily_limit).toBeGreaterThan(bronze.daily_limit);
  });

  it('gratis tier always has fewer features than gold tier', () => {
    for (const [, tierMap] of Object.entries(APP_PLANS)) {
      expect(tierMap.gold.features.length).toBeGreaterThanOrEqual(tierMap.gratis.features.length);
    }
  });
});
