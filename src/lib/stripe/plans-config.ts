// ============================================================
//  REALSYNC DYNAMICS — STRIPE PLAN CONFIG
//  Derives all pricing from the central plan system in @/lib/plans.ts
// ============================================================

import { PLANS, PLAN_ORDER, type PlanId } from '@/lib/plans';

export type AppID =
  | 'creatorseal'
  | 'adengine'
  | 'trendradar'
  | 'contentforge'
  | 'collabhub'
  | 'monetizemax'
  | 'brandkit'
  | 'analyticspro'
  | 'schedulemaster'
  | 'fanconnect'
  | 'mediavault'
  | 'rightsguard';

// Re-export PlanId so existing imports still work
export type PlanTier = PlanId;

// Derived from central PLANS — single source of truth
export const UNIFIED_PRICES: Record<Exclude<PlanId, 'gratis'>, { monthly: number; yearly: number }> = {
  bronze:  { monthly: PLANS.bronze.price.monthly,  yearly: PLANS.bronze.price.yearly  },
  silber:  { monthly: PLANS.silber.price.monthly,  yearly: PLANS.silber.price.yearly  },
  gold:    { monthly: PLANS.gold.price.monthly,    yearly: PLANS.gold.price.yearly    },
  platin:  { monthly: PLANS.platin.price.monthly,  yearly: PLANS.platin.price.yearly  },
  diamant: { monthly: PLANS.diamant.price.monthly, yearly: PLANS.diamant.price.yearly },
};

// Build Stripe price ID env key for a given plan + billing cycle
export function getStripePriceKey(planId: PlanId, billing: 'monthly' | 'yearly' = 'monthly'): string {
  return `STRIPE_${planId.toUpperCase()}_${billing === 'yearly' ? 'YEARLY_' : ''}PRICE_ID`;
}

// Look up a Stripe price ID from environment
export function getStripePriceId(planId: PlanId, billing: 'monthly' | 'yearly' = 'monthly'): string | undefined {
  return process.env[getStripePriceKey(planId, billing)];
}

export const APP_PLANS: Record<AppID, Record<PlanId, { daily_limit: number; features: string[] }>> = {
  creatorseal: {
    gratis:  { daily_limit: 5, features: ['basic_scan'] },
    bronze:  { daily_limit: 50, features: ['basic_scan', 'c2pa_watermark'] },
    silber:  { daily_limit: 200, features: ['basic_scan', 'c2pa_watermark', 'blockchain_anchoring'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label', 'nft_badge'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label', 'nft_badge', 'custom_training'] },
  },
  adengine: {
    gratis:  { daily_limit: 3, features: ['single_copy'] },
    bronze:  { daily_limit: 20, features: ['multi_copy', 'platform_formatting'] },
    silber:  { daily_limit: 100, features: ['ab_testing', 'image_generation'] },
    gold:    { daily_limit: 9999, features: ['unlimited_campaigns', 'custom_models'] },
    platin:  { daily_limit: 9999, features: ['unlimited_campaigns', 'custom_models', 'api_access'] },
    diamant: { daily_limit: 9999, features: ['unlimited_campaigns', 'custom_models', 'api_access', 'white_label'] },
  },
  trendradar: {
    gratis:  { daily_limit: 10, features: ['basic_trends'] },
    bronze:  { daily_limit: 50, features: ['competitor_monitoring'] },
    silber:  { daily_limit: 500, features: ['alerts', 'pdf_reports'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'webhooks'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'webhooks', 'custom_models'] },
  },
  contentforge: {
    gratis:  { daily_limit: 5, features: ['basic_generation'] },
    bronze:  { daily_limit: 30, features: ['tone_config', 'seo'] },
    silber:  { daily_limit: 150, features: ['multi_language', 'templates'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'custom_training'] },
  },
  collabhub: {
    gratis:  { daily_limit: 3, features: ['basic_projects'] },
    bronze:  { daily_limit: 15, features: ['team_chat'] },
    silber:  { daily_limit: 100, features: ['advanced_workflows'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
  monetizemax: {
    gratis:  { daily_limit: 5, features: ['basic_links'] },
    bronze:  { daily_limit: 25, features: ['analytics'] },
    silber:  { daily_limit: 200, features: ['ab_testing', 'funnels'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
  brandkit: {
    gratis:  { daily_limit: 3, features: ['basic_assets'] },
    bronze:  { daily_limit: 20, features: ['guidelines_gen'] },
    silber:  { daily_limit: 100, features: ['consistency_checker'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
  analyticspro: {
    gratis:  { daily_limit: 10, features: ['basic_dashboard'] },
    bronze:  { daily_limit: 100, features: ['custom_reports'] },
    silber:  { daily_limit: 1000, features: ['api_access', 'exports'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'webhooks'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'webhooks', 'custom_models'] },
  },
  schedulemaster: {
    gratis:  { daily_limit: 5, features: ['basic_scheduling'] },
    bronze:  { daily_limit: 30, features: ['multi_platform'] },
    silber:  { daily_limit: 200, features: ['auto_optimization'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
  fanconnect: {
    gratis:  { daily_limit: 10, features: ['basic_messaging'] },
    bronze:  { daily_limit: 50, features: ['segments'] },
    silber:  { daily_limit: 500, features: ['automations'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'webhooks'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'webhooks', 'custom_models'] },
  },
  mediavault: {
    gratis:  { daily_limit: 100, features: ['basic_storage'] },
    bronze:  { daily_limit: 1000, features: ['auto_tagging'] },
    silber:  { daily_limit: 10000, features: ['versioning', 'cdn'] },
    gold:    { daily_limit: 100000, features: ['all_unlimited'] },
    platin:  { daily_limit: 100000, features: ['all_unlimited', 'api_access'] },
    diamant: { daily_limit: 100000, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
  rightsguard: {
    gratis:  { daily_limit: 5, features: ['basic_monitoring'] },
    bronze:  { daily_limit: 25, features: ['dmca_generator'] },
    silber:  { daily_limit: 150, features: ['legal_templates', 'blockchain'] },
    gold:    { daily_limit: 9999, features: ['all_unlimited'] },
    platin:  { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
    diamant: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
};
