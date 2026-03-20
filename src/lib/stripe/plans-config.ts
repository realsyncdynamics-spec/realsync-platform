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

export type PlanTier = 'free' | 'bronze' | 'silver' | 'gold';

export const UNIFIED_PRICES: Record<Exclude<PlanTier, 'free'>, { monthly: number }> = {
  bronze: { monthly: 4.99 },
  silver: { monthly: 14.99 },
  gold: { monthly: 29.99 },
};

export const APP_PLANS: Record<AppID, Record<PlanTier, { daily_limit: number; features: string[] }>> = {
  creatorseal: {
    free: { daily_limit: 5, features: ['basic_scan'] },
    bronze: { daily_limit: 50, features: ['basic_scan', 'c2pa_watermark'] },
    silver: { daily_limit: 200, features: ['basic_scan', 'c2pa_watermark', 'blockchain_anchoring'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
  adengine: {
    free: { daily_limit: 3, features: ['single_copy'] },
    bronze: { daily_limit: 20, features: ['multi_copy', 'platform_formatting'] },
    silver: { daily_limit: 100, features: ['ab_testing', 'image_generation'] },
    gold: { daily_limit: 9999, features: ['unlimited_campaigns', 'custom_models'] },
  },
  trendradar: {
    free: { daily_limit: 10, features: ['basic_trends'] },
    bronze: { daily_limit: 50, features: ['competitor_monitoring'] },
    silver: { daily_limit: 500, features: ['alerts', 'pdf_reports'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  contentforge: {
    free: { daily_limit: 5, features: ['basic_generation'] },
    bronze: { daily_limit: 30, features: ['tone_config', 'seo'] },
    silver: { daily_limit: 150, features: ['multi_language', 'templates'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  collabhub: {
    free: { daily_limit: 3, features: ['basic_projects'] },
    bronze: { daily_limit: 15, features: ['team_chat'] },
    silver: { daily_limit: 100, features: ['advanced_workflows'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  monetizemax: {
    free: { daily_limit: 5, features: ['basic_links'] },
    bronze: { daily_limit: 25, features: ['analytics'] },
    silver: { daily_limit: 200, features: ['ab_testing', 'funnels'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  brandkit: {
    free: { daily_limit: 3, features: ['basic_assets'] },
    bronze: { daily_limit: 20, features: ['guidelines_gen'] },
    silver: { daily_limit: 100, features: ['consistency_checker'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  analyticspro: {
    free: { daily_limit: 10, features: ['basic_dashboard'] },
    bronze: { daily_limit: 100, features: ['custom_reports'] },
    silver: { daily_limit: 1000, features: ['api_access', 'exports'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  schedulemaster: {
    free: { daily_limit: 5, features: ['basic_scheduling'] },
    bronze: { daily_limit: 30, features: ['multi_platform'] },
    silver: { daily_limit: 200, features: ['auto_optimization'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  fanconnect: {
    free: { daily_limit: 10, features: ['basic_messaging'] },
    bronze: { daily_limit: 50, features: ['segments'] },
    silver: { daily_limit: 500, features: ['automations'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
  mediavault: {
    free: { daily_limit: 100, features: ['basic_storage'] },
    bronze: { daily_limit: 1000, features: ['auto_tagging'] },
    silver: { daily_limit: 10000, features: ['versioning', 'cdn'] },
    gold: { daily_limit: 100000, features: ['all_unlimited'] },
  },
  rightsguard: {
    free: { daily_limit: 5, features: ['basic_monitoring'] },
    bronze: { daily_limit: 25, features: ['dmca_generator'] },
    silver: { daily_limit: 150, features: ['legal_templates', 'blockchain'] },
    gold: { daily_limit: 9999, features: ['all_unlimited'] },
  },
};
