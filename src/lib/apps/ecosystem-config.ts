export interface AppConfig {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  features: string[];
  route: string;
}

export const ECOSYSTEM_APPS: AppConfig[] = [
  { id: 'creatorseal', name: 'CreatorSeal', color: '#F0C040', icon: '🛡️', description: 'Deepfake Protection & C2PA Verification', features: ['AI Deepfake Scan', 'C2PA Watermarking', 'Blockchain Anchoring', 'Verified Creator Badge'], route: '/apps/creatorseal' },
  { id: 'adengine', name: 'AdEngine', color: '#FF6888', icon: '📣', description: 'KI Multi-Channel Ad Generator', features: ['Multi-Platform Ads', 'Perplexity Research', 'A/B Testing', 'Live Analytics'], route: '/apps/adengine' },
  { id: 'trendradar', name: 'TrendRadar', color: '#00F0FF', icon: '📡', description: 'Echtzeit Markt-Intelligence', features: ['Trend Detection', 'Competitor Monitoring', 'PDF Reports', 'Alert System'], route: '/apps/trendradar' },
  { id: 'contentforge', name: 'ContentForge', color: '#A78BFA', icon: '✍️', description: 'KI Content Generator', features: ['Blog Posts', 'Social Captions', 'SEO Optimization', 'Multi-Language'], route: '/apps/contentforge' },
  { id: 'rightsguard', name: 'RightsGuard', color: '#2DD4BF', icon: '⚖️', description: 'Digital Rights Management', features: ['Reverse Image Search', 'DMCA Generator', 'Copyright Monitoring', 'Legal Templates'], route: '/apps/rightsguard' },
  { id: 'mediavault', name: 'MediaVault', color: '#FFA040', icon: '🗄️', description: 'Sicherer Media Storage', features: ['Encrypted Upload', 'AI Auto-Tagging', 'Version Control', 'CDN Distribution'], route: '/apps/mediavault' },
  { id: 'brandkit', name: 'BrandKit', color: '#C9A84C', icon: '🎨', description: 'Brand Identity Manager', features: ['Logo & Colors', 'AI Guidelines', 'Asset Export', 'Consistency Checker'], route: '/apps/brandkit' },
  { id: 'collabhub', name: 'CollabHub', color: '#818CF8', icon: '🤝', description: 'Creator Collaboration Platform', features: ['Project Management', 'Team Chat', 'Contract Templates', 'Revenue Sharing'], route: '/apps/collabhub' },
  { id: 'monetizemax', name: 'MonetizeMax', color: '#34D399', icon: '💰', description: 'Revenue Optimization Engine', features: ['Smart Links', 'Funnel Builder', 'A/B Testing', 'Analytics Dashboard'], route: '/apps/monetizemax' },
  { id: 'analyticspro', name: 'AnalyticsPro', color: '#F472B6', icon: '📊', description: 'Cross-Platform Analytics', features: ['Unified Dashboard', 'Custom Reports', 'API Access', 'Data Exports'], route: '/apps/analyticspro' },
  { id: 'schedulemaster', name: 'ScheduleMaster', color: '#60A5FA', icon: '📅', description: 'Multi-Platform Content Scheduler', features: ['Auto-Scheduling', 'Best-Time AI', 'Content Calendar', 'Batch Upload'], route: '/apps/schedulemaster' },
  { id: 'fanconnect', name: 'FanConnect', color: '#FB923C', icon: '💬', description: 'Community & Fan Engagement', features: ['Direct Messaging', 'Fan Segments', 'Automations', 'Loyalty System'], route: '/apps/fanconnect' },
];
