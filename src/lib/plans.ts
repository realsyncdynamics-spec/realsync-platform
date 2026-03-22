// ============================================================
//  REALSYNC DYNAMICS — ZENTRALES PLAN-SYSTEM
//  Single source of truth für alle Feature-Gates
// ============================================================

export type PlanId = 'gratis' | 'bronze' | 'silber' | 'gold' | 'platin' | 'diamant';

export const PLAN_ORDER: PlanId[] = ['gratis','bronze','silber','gold','platin','diamant'];

export interface Plan {
  id: PlanId;
  name: string;
  emoji: string;
  color: string;
  price: { monthly: number; yearly: number };
  tagline: string;
  verifyLevel: number;
  // Limits
  limits: {
    aiReplies: number;          // -1 = unbegrenzt
    reviews: number;            // max reviews per month
    platforms: number;          // social media platforms
    workflows: number;          // active workflows
    teamMembers: number;
    storageGB: number;
    apiCalls: number;           // -1 = unbegrenzt
    churnRetries: number;       // failed payment retries
    waitlistSignups: number;    // -1 = unbegrenzt
    exports: number;            // reports per month
  };
  // Feature flags
  features: {
    // DASHBOARD TOOLS
    dashboardTools: boolean;      // Gratis=false, Bronze+=true
    bulkActions: boolean;         // Silber+
    aiAnalytics: boolean;         // Silber+
    automation: boolean;          // Gold+
    launchSequence: boolean;      // Gold+
    churnPrediction: boolean;     // Gold+
    customWebhooks: boolean;      // Platin+
    whiteLabel: boolean;          // Platin+
    customDomain: boolean;        // Platin+
    apiAccess: boolean;           // Silber+ (limited) / Gold+ (full)
    apiUnlimited: boolean;        // Platin+
    // VERIFICATION
    watermark: boolean;           // Bronze+
    blockchainTimestamp: boolean; // Silber+
    c2pa: boolean;                // Gold+
    polygonNFT: boolean;          // Platin+
    // SOCIAL
    socialSync: boolean;          // Bronze+
    socialAutoPost: boolean;      // Gold+
    socialWebhooks: boolean;      // Platin+
    // WORKFLOWS
    workflowsBasic: boolean;      // Bronze+ (3 workflows)
    workflowsAdvanced: boolean;   // Silber+ (10 workflows)
    workflowsUnlimited: boolean;  // Gold+ (unlimited)
    // PROFILE & WEBSITE
    creatorProfile: boolean;      // alle
    customProfileDesign: boolean; // Silber+
    creatorWebsite: boolean;      // Gold+
    ownDomain: boolean;           // Platin+
    // SUPPORT
    emailSupport: boolean;        // Bronze+
    prioritySupport: boolean;     // Silber+
    slackSupport: boolean;        // Platin+
    dedicatedManager: boolean;    // Diamant
  };
}

export const PLANS: Record<PlanId, Plan> = {
  gratis: {
    id: 'gratis', name: 'Gratis', emoji: '🆓', color: '#6B7280',
    price: { monthly: 0, yearly: 0 },
    tagline: 'Für immer kostenlos — kein Ablaufdatum',
    verifyLevel: 1,
    limits: {
      aiReplies: 0, reviews: 20, platforms: 0, workflows: 0,
      teamMembers: 1, storageGB: 0.5, apiCalls: 0,
      churnRetries: 0, waitlistSignups: 100, exports: 0,
    },
    features: {
      dashboardTools: false, bulkActions: false, aiAnalytics: false,
      automation: false, launchSequence: false, churnPrediction: false,
      customWebhooks: false, whiteLabel: false, customDomain: false,
      apiAccess: false, apiUnlimited: false,
      watermark: false, blockchainTimestamp: false, c2pa: false, polygonNFT: false,
      socialSync: false, socialAutoPost: false, socialWebhooks: false,
      workflowsBasic: false, workflowsAdvanced: false, workflowsUnlimited: false,
      creatorProfile: true, customProfileDesign: false, creatorWebsite: false, ownDomain: false,
      emailSupport: false, prioritySupport: false, slackSupport: false, dedicatedManager: false,
    },
  },

  bronze: {
    id: 'bronze', name: 'Bronze', emoji: '🥉', color: '#CD7F32',
    price: { monthly: 19, yearly: 15 },
    tagline: 'Erste echte Tools — sofort loslegen',
    verifyLevel: 2,
    limits: {
      aiReplies: 50, reviews: 200, platforms: 3, workflows: 3,
      teamMembers: 1, storageGB: 10, apiCalls: 1000,
      churnRetries: 10, waitlistSignups: 1000, exports: 3,
    },
    features: {
      // TOOLS — ab Bronze freigeschaltet
      dashboardTools: true, bulkActions: false, aiAnalytics: false,
      automation: false, launchSequence: false, churnPrediction: false,
      customWebhooks: false, whiteLabel: false, customDomain: false,
      apiAccess: true, apiUnlimited: false,
      // VERIFY
      watermark: true, blockchainTimestamp: false, c2pa: false, polygonNFT: false,
      // SOCIAL
      socialSync: true, socialAutoPost: false, socialWebhooks: false,
      // WORKFLOWS
      workflowsBasic: true, workflowsAdvanced: false, workflowsUnlimited: false,
      // PROFILE
      creatorProfile: true, customProfileDesign: false, creatorWebsite: false, ownDomain: false,
      // SUPPORT
      emailSupport: true, prioritySupport: false, slackSupport: false, dedicatedManager: false,
    },
  },

  silber: {
    id: 'silber', name: 'Silber', emoji: '🥈', color: '#C0C0C0',
    price: { monthly: 49, yearly: 39 },
    tagline: 'Blockchain + KI-Analytics + Bulk Tools',
    verifyLevel: 3,
    limits: {
      aiReplies: 500, reviews: 1000, platforms: 5, workflows: 10,
      teamMembers: 3, storageGB: 50, apiCalls: 10000,
      churnRetries: 50, waitlistSignups: 5000, exports: 20,
    },
    features: {
      dashboardTools: true, bulkActions: true, aiAnalytics: true,
      automation: false, launchSequence: false, churnPrediction: false,
      customWebhooks: false, whiteLabel: false, customDomain: false,
      apiAccess: true, apiUnlimited: false,
      watermark: true, blockchainTimestamp: true, c2pa: false, polygonNFT: false,
      socialSync: true, socialAutoPost: false, socialWebhooks: false,
      workflowsBasic: true, workflowsAdvanced: true, workflowsUnlimited: false,
      creatorProfile: true, customProfileDesign: true, creatorWebsite: false, ownDomain: false,
      emailSupport: true, prioritySupport: true, slackSupport: false, dedicatedManager: false,
    },
  },

  gold: {
    id: 'gold', name: 'Gold', emoji: '🥇', color: '#FFD700',
    price: { monthly: 99, yearly: 79 },
    tagline: 'C2PA + Automation + alle 16 Apps',
    verifyLevel: 4,
    limits: {
      aiReplies: 2000, reviews: 5000, platforms: 6, workflows: -1,
      teamMembers: 5, storageGB: 200, apiCalls: 50000,
      churnRetries: -1, waitlistSignups: -1, exports: -1,
    },
    features: {
      dashboardTools: true, bulkActions: true, aiAnalytics: true,
      automation: true, launchSequence: true, churnPrediction: true,
      customWebhooks: true, whiteLabel: false, customDomain: false,
      apiAccess: true, apiUnlimited: false,
      watermark: true, blockchainTimestamp: true, c2pa: true, polygonNFT: false,
      socialSync: true, socialAutoPost: true, socialWebhooks: false,
      workflowsBasic: true, workflowsAdvanced: true, workflowsUnlimited: true,
      creatorProfile: true, customProfileDesign: true, creatorWebsite: true, ownDomain: false,
      emailSupport: true, prioritySupport: true, slackSupport: false, dedicatedManager: false,
    },
  },

  platin: {
    id: 'platin', name: 'Platin', emoji: '💎', color: '#00D4FF',
    price: { monthly: 199, yearly: 159 },
    tagline: 'White-Label + Custom Domain + Unbegrenzt API',
    verifyLevel: 5,
    limits: {
      aiReplies: 10000, reviews: 25000, platforms: 6, workflows: -1,
      teamMembers: 25, storageGB: 1000, apiCalls: -1,
      churnRetries: -1, waitlistSignups: -1, exports: -1,
    },
    features: {
      dashboardTools: true, bulkActions: true, aiAnalytics: true,
      automation: true, launchSequence: true, churnPrediction: true,
      customWebhooks: true, whiteLabel: true, customDomain: true,
      apiAccess: true, apiUnlimited: true,
      watermark: true, blockchainTimestamp: true, c2pa: true, polygonNFT: true,
      socialSync: true, socialAutoPost: true, socialWebhooks: true,
      workflowsBasic: true, workflowsAdvanced: true, workflowsUnlimited: true,
      creatorProfile: true, customProfileDesign: true, creatorWebsite: true, ownDomain: true,
      emailSupport: true, prioritySupport: true, slackSupport: true, dedicatedManager: false,
    },
  },

  diamant: {
    id: 'diamant', name: 'Diamant', emoji: '💠', color: '#93C5FD',
    price: { monthly: 499, yearly: 399 },
    tagline: 'Enterprise · Alles inklusive · Dedicated Manager',
    verifyLevel: 6,
    limits: {
      aiReplies: -1, reviews: -1, platforms: 6, workflows: -1,
      teamMembers: -1, storageGB: -1, apiCalls: -1,
      churnRetries: -1, waitlistSignups: -1, exports: -1,
    },
    features: {
      dashboardTools: true, bulkActions: true, aiAnalytics: true,
      automation: true, launchSequence: true, churnPrediction: true,
      customWebhooks: true, whiteLabel: true, customDomain: true,
      apiAccess: true, apiUnlimited: true,
      watermark: true, blockchainTimestamp: true, c2pa: true, polygonNFT: true,
      socialSync: true, socialAutoPost: true, socialWebhooks: true,
      workflowsBasic: true, workflowsAdvanced: true, workflowsUnlimited: true,
      creatorProfile: true, customProfileDesign: true, creatorWebsite: true, ownDomain: true,
      emailSupport: true, prioritySupport: true, slackSupport: true, dedicatedManager: true,
    },
  },
};

// ── HELPER FUNCTIONS ──────────────────────────────────────

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}

export function hasFeature(planId: PlanId, feature: keyof Plan['features']): boolean {
  return PLANS[planId].features[feature];
}

export function getLimit(planId: PlanId, limit: keyof Plan['limits']): number {
  return PLANS[planId].limits[limit];
}

export function isUnlimited(planId: PlanId, limit: keyof Plan['limits']): boolean {
  return PLANS[planId].limits[limit] === -1;
}

export function formatLimit(val: number): string {
  if (val === -1) return '∞';
  if (val === 0) return '—';
  return val.toLocaleString('de');
}

export function getRequiredPlan(feature: keyof Plan['features']): PlanId {
  return PLAN_ORDER.find(id => PLANS[id].features[feature]) || 'diamant';
}

export function planIndex(id: PlanId): number {
  return PLAN_ORDER.indexOf(id);
}

export function canAccess(userPlan: PlanId, requiredPlan: PlanId): boolean {
  return planIndex(userPlan) >= planIndex(requiredPlan);
}

// ── PLAN FEATURE MATRIX für UI ────────────────────────────

export const FEATURE_MATRIX = [
  // ReviewRadar Tools
  { feature: 'dashboardTools',    label: 'Dashboard Tools (KI-Antwort, Sync, Export)',  category: 'Tools'        },
  { feature: 'aiAnalytics',       label: 'KI-Trend-Analyse & Sentiment',                category: 'KI'           },
  { feature: 'bulkActions',       label: 'Bulk-Antworten & Massen-Aktionen',             category: 'Tools'        },
  { feature: 'automation',        label: 'Automation & Auto-Workflows',                  category: 'Automation'   },
  // ChurnRescue Tools
  { feature: 'dashboardTools',    label: 'Smart Retry Engine',                           category: 'ChurnRescue'  },
  { feature: 'churnPrediction',   label: 'KI Churn-Prediction (14 Tage vorher)',         category: 'KI'           },
  // WaitlistKit Tools
  { feature: 'workflowsBasic',    label: 'Workflows (3 aktive)',                         category: 'Workflows'    },
  { feature: 'workflowsAdvanced', label: 'Workflows (10 aktive)',                        category: 'Workflows'    },
  { feature: 'workflowsUnlimited',label: 'Workflows (unbegrenzt)',                       category: 'Workflows'    },
  { feature: 'launchSequence',    label: 'Launch Sequence Automation',                   category: 'WaitlistKit'  },
  // Verification
  { feature: 'watermark',         label: 'Unsichtbares Wasserzeichen',                   category: 'Verifikation' },
  { feature: 'blockchainTimestamp',label: 'Polygon Blockchain Zeitstempel',              category: 'Verifikation' },
  { feature: 'c2pa',              label: 'C2PA 2.3 Standard (EU AI Act)',                category: 'Verifikation' },
  // Social
  { feature: 'socialSync',        label: 'Social Media API Sync',                        category: 'Social'       },
  { feature: 'socialAutoPost',    label: 'Auto-Posting (YouTube/TikTok/IG)',             category: 'Social'       },
  // Profile & Website
  { feature: 'customProfileDesign',label: 'Custom Profil Design & Themes',              category: 'Profil'       },
  { feature: 'creatorWebsite',    label: 'Eigene Creator-Website',                       category: 'Website'      },
  { feature: 'customDomain',      label: 'Custom Domain (dein-name.de)',                 category: 'Website'      },
  { feature: 'whiteLabel',        label: 'White-Label Plattform',                        category: 'Enterprise'   },
  { feature: 'apiUnlimited',      label: 'Unbegrenzte API-Aufrufe',                      category: 'API'          },
] as { feature: keyof Plan['features']; label: string; category: string }[];

export const ALL_PLANS_LIST = PLAN_ORDER.map(id => PLANS[id]);
