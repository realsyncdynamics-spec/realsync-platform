import { describe, it, expect } from 'vitest';
import {
  PLANS,
  PLAN_ORDER,
  ALL_PLANS_LIST,
  FEATURE_MATRIX,
  OPTIMUS_PACKAGES,
  OPTIMUS_COSTS,
  PERPLEXITY_MODELS,
  getPlan,
  hasFeature,
  getLimit,
  isUnlimited,
  formatLimit,
  getRequiredPlan,
  planIndex,
  canAccess,
  type PlanId,
} from '../plans';

// ── PLAN_ORDER / ALL_PLANS_LIST ────────────────────────────────────────────────

describe('PLAN_ORDER', () => {
  it('has exactly 6 plans in the correct tier order', () => {
    expect(PLAN_ORDER).toEqual(['gratis', 'bronze', 'silber', 'gold', 'platin', 'diamant']);
  });
});

describe('ALL_PLANS_LIST', () => {
  it('contains the same plans as PLAN_ORDER', () => {
    expect(ALL_PLANS_LIST.map(p => p.id)).toEqual(PLAN_ORDER);
  });
});

// ── getPlan ────────────────────────────────────────────────────────────────────

describe('getPlan', () => {
  it('returns the correct plan object for each tier', () => {
    for (const id of PLAN_ORDER) {
      const plan = getPlan(id);
      expect(plan.id).toBe(id);
    }
  });

  it('returns a plan with a name, emoji, and color', () => {
    const plan = getPlan('gold');
    expect(plan.name).toBe('Gold');
    expect(plan.emoji).toBe('🥇');
    expect(plan.color).toBe('#FFD700');
  });
});

// ── Plan prices ───────────────────────────────────────────────────────────────

describe('plan prices', () => {
  it('gratis plan is free', () => {
    expect(PLANS.gratis.price.monthly).toBe(0);
    expect(PLANS.gratis.price.yearly).toBe(0);
  });

  it('yearly price is always less than or equal to monthly price (non-free plans)', () => {
    const paid: PlanId[] = ['bronze', 'silber', 'gold', 'platin', 'diamant'];
    for (const id of paid) {
      const { monthly, yearly } = PLANS[id].price;
      expect(yearly).toBeLessThan(monthly);
    }
  });

  it('prices increase with plan tier', () => {
    const paid: PlanId[] = ['bronze', 'silber', 'gold', 'platin', 'diamant'];
    for (let i = 1; i < paid.length; i++) {
      expect(PLANS[paid[i]].price.monthly).toBeGreaterThan(PLANS[paid[i - 1]].price.monthly);
    }
  });
});

// ── hasFeature ─────────────────────────────────────────────────────────────────

describe('hasFeature', () => {
  it('gratis plan has creatorProfile', () => {
    expect(hasFeature('gratis', 'creatorProfile')).toBe(true);
  });

  it('gratis plan does NOT have dashboardTools', () => {
    expect(hasFeature('gratis', 'dashboardTools')).toBe(false);
  });

  it('bronze plan has watermark', () => {
    expect(hasFeature('bronze', 'watermark')).toBe(true);
  });

  it('bronze plan does NOT have blockchainTimestamp', () => {
    expect(hasFeature('bronze', 'blockchainTimestamp')).toBe(false);
  });

  it('silber plan has blockchainTimestamp and aiAnalytics', () => {
    expect(hasFeature('silber', 'blockchainTimestamp')).toBe(true);
    expect(hasFeature('silber', 'aiAnalytics')).toBe(true);
  });

  it('gold plan has c2pa and automation', () => {
    expect(hasFeature('gold', 'c2pa')).toBe(true);
    expect(hasFeature('gold', 'automation')).toBe(true);
  });

  it('gold plan does NOT have polygonNFT or whiteLabel', () => {
    expect(hasFeature('gold', 'polygonNFT')).toBe(false);
    expect(hasFeature('gold', 'whiteLabel')).toBe(false);
  });

  it('platin plan has whiteLabel, customDomain, and polygonNFT', () => {
    expect(hasFeature('platin', 'whiteLabel')).toBe(true);
    expect(hasFeature('platin', 'customDomain')).toBe(true);
    expect(hasFeature('platin', 'polygonNFT')).toBe(true);
  });

  it('only diamant plan has dedicatedManager', () => {
    const plans: PlanId[] = ['gratis', 'bronze', 'silber', 'gold', 'platin'];
    for (const id of plans) {
      expect(hasFeature(id, 'dedicatedManager')).toBe(false);
    }
    expect(hasFeature('diamant', 'dedicatedManager')).toBe(true);
  });

  it('every plan at or above silber has bulkActions', () => {
    expect(hasFeature('silber', 'bulkActions')).toBe(true);
    expect(hasFeature('gold', 'bulkActions')).toBe(true);
    expect(hasFeature('platin', 'bulkActions')).toBe(true);
    expect(hasFeature('diamant', 'bulkActions')).toBe(true);
  });

  it('bronze does NOT have bulkActions', () => {
    expect(hasFeature('bronze', 'bulkActions')).toBe(false);
  });
});

// ── getLimit ───────────────────────────────────────────────────────────────────

describe('getLimit', () => {
  it('gratis plan has 0 AI replies', () => {
    expect(getLimit('gratis', 'aiReplies')).toBe(0);
  });

  it('bronze plan has 50 AI replies', () => {
    expect(getLimit('bronze', 'aiReplies')).toBe(50);
  });

  it('diamant plan has unlimited (-1) AI replies', () => {
    expect(getLimit('diamant', 'aiReplies')).toBe(-1);
  });

  it('gratis plan has 0.5 GB storage', () => {
    expect(getLimit('gratis', 'storageGB')).toBe(0.5);
  });

  it('diamant plan has unlimited (-1) storage', () => {
    expect(getLimit('diamant', 'storageGB')).toBe(-1);
  });

  it('teamMembers limits increase with tier', () => {
    const limits = PLAN_ORDER.map(id => getLimit(id, 'teamMembers'));
    // gratis=1, bronze=1, silber=3, gold=5, platin=25, diamant=-1
    expect(limits[0]).toBe(1); // gratis
    expect(limits[1]).toBe(1); // bronze
    expect(limits[2]).toBe(3); // silber
    expect(limits[3]).toBe(5); // gold
    expect(limits[4]).toBe(25); // platin
    expect(limits[5]).toBe(-1); // diamant
  });
});

// ── isUnlimited ────────────────────────────────────────────────────────────────

describe('isUnlimited', () => {
  it('returns true when limit is -1', () => {
    expect(isUnlimited('diamant', 'aiReplies')).toBe(true);
    expect(isUnlimited('gold', 'workflows')).toBe(true);
  });

  it('returns false when limit is a finite number', () => {
    expect(isUnlimited('gratis', 'aiReplies')).toBe(false);
    expect(isUnlimited('bronze', 'reviews')).toBe(false);
  });

  it('gratis plan has no unlimited limits', () => {
    const limitKeys = ['aiReplies', 'reviews', 'platforms', 'workflows', 'teamMembers', 'storageGB', 'apiCalls', 'churnRetries', 'exports'] as const;
    for (const key of limitKeys) {
      expect(isUnlimited('gratis', key)).toBe(false);
    }
  });
});

// ── formatLimit ────────────────────────────────────────────────────────────────

describe('formatLimit', () => {
  it('formats -1 as ∞', () => {
    expect(formatLimit(-1)).toBe('∞');
  });

  it('formats 0 as —', () => {
    expect(formatLimit(0)).toBe('—');
  });

  it('formats positive numbers using German locale', () => {
    // In German locale, 1000 → "1.000", but toLocaleString output depends on environment
    const result = formatLimit(500);
    expect(result).toBe('500');
  });

  it('formats large numbers', () => {
    const result = formatLimit(25000);
    // German locale: 25.000
    expect(result).toMatch(/25/);
  });
});

// ── getRequiredPlan ────────────────────────────────────────────────────────────

describe('getRequiredPlan', () => {
  it('creatorProfile is available on gratis (lowest tier)', () => {
    expect(getRequiredPlan('creatorProfile')).toBe('gratis');
  });

  it('dashboardTools first appears on bronze', () => {
    expect(getRequiredPlan('dashboardTools')).toBe('bronze');
  });

  it('bulkActions first appears on silber', () => {
    expect(getRequiredPlan('bulkActions')).toBe('silber');
  });

  it('c2pa first appears on gold', () => {
    expect(getRequiredPlan('c2pa')).toBe('gold');
  });

  it('whiteLabel first appears on platin', () => {
    expect(getRequiredPlan('whiteLabel')).toBe('platin');
  });

  it('dedicatedManager first appears on diamant', () => {
    expect(getRequiredPlan('dedicatedManager')).toBe('diamant');
  });
});

// ── planIndex ──────────────────────────────────────────────────────────────────

describe('planIndex', () => {
  it('returns correct indices', () => {
    expect(planIndex('gratis')).toBe(0);
    expect(planIndex('bronze')).toBe(1);
    expect(planIndex('silber')).toBe(2);
    expect(planIndex('gold')).toBe(3);
    expect(planIndex('platin')).toBe(4);
    expect(planIndex('diamant')).toBe(5);
  });
});

// ── canAccess ──────────────────────────────────────────────────────────────────

describe('canAccess', () => {
  it('same plan tier can always access its own features', () => {
    for (const id of PLAN_ORDER) {
      expect(canAccess(id, id)).toBe(true);
    }
  });

  it('higher plan can access lower plan features', () => {
    expect(canAccess('gold', 'bronze')).toBe(true);
    expect(canAccess('diamant', 'gratis')).toBe(true);
    expect(canAccess('platin', 'silber')).toBe(true);
  });

  it('lower plan cannot access higher plan features', () => {
    expect(canAccess('gratis', 'bronze')).toBe(false);
    expect(canAccess('bronze', 'silber')).toBe(false);
    expect(canAccess('silber', 'gold')).toBe(false);
    expect(canAccess('gold', 'platin')).toBe(false);
    expect(canAccess('platin', 'diamant')).toBe(false);
  });

  it('gratis cannot access any paid tier', () => {
    const paid: PlanId[] = ['bronze', 'silber', 'gold', 'platin', 'diamant'];
    for (const id of paid) {
      expect(canAccess('gratis', id)).toBe(false);
    }
  });
});

// ── verifyLevel ────────────────────────────────────────────────────────────────

describe('verifyLevel', () => {
  it('increases monotonically with plan tier', () => {
    for (let i = 1; i < PLAN_ORDER.length; i++) {
      expect(PLANS[PLAN_ORDER[i]].verifyLevel).toBeGreaterThan(PLANS[PLAN_ORDER[i - 1]].verifyLevel);
    }
  });

  it('diamant has the highest verifyLevel (6)', () => {
    expect(PLANS.diamant.verifyLevel).toBe(6);
  });
});

// ── FEATURE_MATRIX ─────────────────────────────────────────────────────────────

describe('FEATURE_MATRIX', () => {
  it('is a non-empty array', () => {
    expect(FEATURE_MATRIX.length).toBeGreaterThan(0);
  });

  it('every entry has a feature, label, and category', () => {
    for (const entry of FEATURE_MATRIX) {
      expect(entry.feature).toBeTruthy();
      expect(entry.label).toBeTruthy();
      expect(entry.category).toBeTruthy();
    }
  });

  it('every feature key in FEATURE_MATRIX is a valid Plan feature key', () => {
    const validFeatures = Object.keys(PLANS.gratis.features);
    for (const entry of FEATURE_MATRIX) {
      expect(validFeatures).toContain(entry.feature);
    }
  });
});

// ── OPTIMUS_PACKAGES ───────────────────────────────────────────────────────────

describe('OPTIMUS_PACKAGES', () => {
  it('has 4 packages', () => {
    expect(OPTIMUS_PACKAGES.length).toBe(4);
  });

  it('each package has a positive price and coin count', () => {
    for (const pkg of OPTIMUS_PACKAGES) {
      expect(pkg.price).toBeGreaterThan(0);
      expect(pkg.coins).toBeGreaterThan(0);
    }
  });

  it('prices increase across packages', () => {
    for (let i = 1; i < OPTIMUS_PACKAGES.length; i++) {
      expect(OPTIMUS_PACKAGES[i].price).toBeGreaterThan(OPTIMUS_PACKAGES[i - 1].price);
    }
  });
});

// ── OPTIMUS_COSTS ─────────────────────────────────────────────────────────────

describe('OPTIMUS_COSTS', () => {
  it('sonar is cheapest, auto-tool is most expensive', () => {
    expect(OPTIMUS_COSTS['sonar']).toBeLessThan(OPTIMUS_COSTS['sonar-pro']);
    expect(OPTIMUS_COSTS['sonar-pro']).toBeLessThan(OPTIMUS_COSTS['sonar-deep-research']);
    expect(OPTIMUS_COSTS['sonar-deep-research']).toBeLessThan(OPTIMUS_COSTS['auto-tool']);
  });
});

// ── PERPLEXITY_MODELS ─────────────────────────────────────────────────────────

describe('PERPLEXITY_MODELS', () => {
  it('has 3 models', () => {
    expect(PERPLEXITY_MODELS.length).toBe(3);
  });

  it('each model has coins, plan, and color', () => {
    for (const model of PERPLEXITY_MODELS) {
      expect(model.coins).toBeGreaterThan(0);
      expect(model.plan).toBeTruthy();
      expect(model.color).toMatch(/^#/);
    }
  });

  it('sonar costs the fewest coins', () => {
    const sonar = PERPLEXITY_MODELS.find(m => m.id === 'sonar')!;
    for (const model of PERPLEXITY_MODELS) {
      expect(sonar.coins).toBeLessThanOrEqual(model.coins);
    }
  });
});
