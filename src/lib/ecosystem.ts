// RealSync Ecosystem Data Bus
// Zentraler Datenbus fuer barrierefreien Datentransfer zwischen allen 13 Apps

export type AppId = 'creatorseal' | 'adengine' | 'trendradar' | 'contentforge' | 'rightsguard' | 'mediavault' | 'brandkit' | 'collabhub' | 'monetizemax' | 'analyticspro' | 'schedulemaster' | 'fanconnect' | 'certificategen' | 'reviewradar' | 'churnrescue' | 'waitlistkit';

export interface EcosystemEvent {
  id: string;
  sourceApp: AppId;
  targetApp: AppId | 'all';
  eventType: string;
  payload: Record<string, unknown>;
  timestamp: number;
  userId: string;
}

export interface ContentAsset {
  id: string;
  type: 'image' | 'video' | 'document' | 'certificate' | 'ad';
  title: string;
  url: string;
  c2paHash?: string;
  blockchainHash?: string;
  watermarkId?: string;
  barcodeId?: string;
  createdBy: AppId;
  metadata: Record<string, unknown>;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  trigger: { app: AppId; event: string };
  actions: { app: AppId; action: string; params: Record<string, unknown> }[];
  enabled: boolean;
}

// Vordefinierte Ecosystem-Workflows
export const PRESET_WORKFLOWS: WorkflowConfig[] = [
  {
    id: 'wf-auto-watermark',
    name: 'Auto-Wasserzeichen bei Upload',
    trigger: { app: 'mediavault', event: 'file.uploaded' },
    actions: [
      { app: 'creatorseal', action: 'apply.watermark', params: { type: 'invisible' } },
      { app: 'creatorseal', action: 'generate.c2pa', params: {} },
      { app: 'rightsguard', action: 'register.blockchain', params: {} },
    ],
    enabled: true,
  },
  {
    id: 'wf-content-to-ad',
    name: 'Content automatisch zu Ad-Kampagne',
    trigger: { app: 'contentforge', event: 'content.published' },
    actions: [
      { app: 'adengine', action: 'create.campaign', params: { autoOptimize: true } },
      { app: 'schedulemaster', action: 'schedule.post', params: { platforms: ['instagram', 'tiktok'] } },
      { app: 'analyticspro', action: 'track.campaign', params: {} },
    ],
    enabled: true,
  },
  {
    id: 'wf-trend-to-content',
    name: 'Trend erkannt -> Content erstellen',
    trigger: { app: 'trendradar', event: 'trend.detected' },
    actions: [
      { app: 'contentforge', action: 'generate.content', params: { useAi: true } },
      { app: 'brandkit', action: 'apply.branding', params: {} },
      { app: 'schedulemaster', action: 'schedule.optimal', params: {} },
    ],
    enabled: true,
  },
  {
    id: 'wf-collab-certificate',
    name: 'Collab-Deal -> Zertifikat + Vertrag',
    trigger: { app: 'collabhub', event: 'deal.accepted' },
    actions: [
      { app: 'certificategen', action: 'generate.contract', params: { format: 'pdf', includeQr: true } },
      { app: 'rightsguard', action: 'register.agreement', params: {} },
      { app: 'monetizemax', action: 'track.revenue', params: {} },
    ],
    enabled: true,
  },
  {
    id: 'wf-deepfake-alert',
    name: 'Deepfake erkannt -> Schutzprotokoll',
    trigger: { app: 'creatorseal', event: 'deepfake.detected' },
    actions: [
      { app: 'rightsguard', action: 'file.takedown', params: { urgent: true } },
      { app: 'certificategen', action: 'generate.proof', params: { type: 'authenticity' } },
      { app: 'analyticspro', action: 'log.incident', params: {} },
    ],
    enabled: true,
  },
  {
    id: 'wf-fan-engage',
    name: 'Fan-Engagement -> Monetarisierung',
    trigger: { app: 'fanconnect', event: 'milestone.reached' },
    actions: [
      { app: 'certificategen', action: 'generate.badge', params: { type: 'fan-milestone' } },
      { app: 'monetizemax', action: 'create.offer', params: { type: 'exclusive' } },
      { app: 'adengine', action: 'retarget.fans', params: {} },
    ],
    enabled: true,
  },
];

// App-Beschreibungen
export const APP_DESCRIPTIONS: Record<AppId, { name: string; tagline: string; description: string; features: string[]; useCases: string[]; integrations: AppId[]; color: string }> = {
  creatorseal: { name: 'CreatorSeal', tagline: 'Deepfake Protection & C2PA', description: 'Schuetze deinen Content vor Deepfakes und Manipulation mit C2PA, Wasserzeichen und KI-Erkennung.', features: ['C2PA Credentials', 'Deepfake-Erkennung', 'Unsichtbare Wasserzeichen', 'Blockchain-Hash', 'Echtzeit-Monitoring', 'Takedown-Automatisierung'], useCases: ['Content-Authentizitaet beweisen', 'Influencer-Schutz', 'Markenintegritaet'], integrations: ['rightsguard', 'mediavault', 'certificategen'], color: '#00D4FF' },
  adengine: { name: 'AdEngine', tagline: 'KI-Ad Generator', description: 'Erstelle hochkonvertierende Ads mit KI. Analysiert Zielgruppen, generiert Creatives, optimiert Kampagnen.', features: ['KI-Ad-Generierung', 'A/B Testing', 'Multi-Platform', 'ROI-Tracking', 'Retargeting', 'Creative-Bibliothek'], useCases: ['Social Media Ads', 'Performance Marketing', 'Brand Awareness'], integrations: ['analyticspro', 'contentforge', 'schedulemaster'], color: '#FF6B35' },
  trendradar: { name: 'TrendRadar', tagline: 'Virale Trend-Erkennung', description: 'Erkenne virale Trends bevor sie mainstream werden. Scannt Social Media in Echtzeit.', features: ['Echtzeit-Scanning', 'Viralitaets-Score', 'Cross-Platform', 'Historische Analyse', 'Keyword-Alerts', 'Nischen-Erkennung'], useCases: ['Frueh auf Trends reagieren', 'Content optimieren', 'Virale Videos'], integrations: ['contentforge', 'schedulemaster', 'adengine'], color: '#00FF88' },
  contentforge: { name: 'ContentForge', tagline: 'KI-Content Erstellung', description: 'Erstelle professionellen Content mit KI. Texte, Bilder, Videos - dein kreatives Kraftwerk.', features: ['KI-Text', 'Bild-Erstellung', 'Video-Templates', 'Brand Voice', 'Kalender', 'Multi-Format'], useCases: ['Blog-Artikel', 'Social Media Posts', 'Video-Skripte'], integrations: ['brandkit', 'schedulemaster', 'adengine'], color: '#A855F7' },
  rightsguard: { name: 'RightsGuard', tagline: 'Digital Rights Management', description: 'Verwalte digitale Rechte mit Blockchain-Registrierung, Nutzungs-Monitoring und Takedowns.', features: ['Blockchain-Registrierung', 'Lizenz-Management', 'Auto-Takedowns', 'Monitoring', 'Rechte-DB', 'DMCA'], useCases: ['Diebstahl verhindern', 'Lizenzen verwalten', 'Urheberrecht'], integrations: ['creatorseal', 'certificategen', 'mediavault'], color: '#2DD4BF' },
  mediavault: { name: 'MediaVault', tagline: 'Sicherer Cloud-Speicher', description: 'Sichere Medien-Cloud mit Auto-Organisation, Versionierung und CDN.', features: ['Verschluesselung', 'Auto-Organisation', 'Versionierung', 'CDN', 'Batch-Upload', 'Smart-Tags'], useCases: ['Medien speichern', 'Team-Collab', 'Content-Archiv'], integrations: ['creatorseal', 'contentforge', 'brandkit'], color: '#8B5CF6' },
  brandkit: { name: 'BrandKit', tagline: 'KI-Brand Identity', description: 'Brand Identity mit KI erstellen und verwalten. Logos, Farben, Schriften, Guidelines.', features: ['KI-Logo', 'Farbpaletten', 'Brand Guidelines', 'Templates', 'Konsistenz-Check', 'Export'], useCases: ['Brand aufbauen', 'Konsistentes Design', 'Templates'], integrations: ['contentforge', 'adengine', 'mediavault'], color: '#EC4899' },
  collabhub: { name: 'CollabHub', tagline: 'Creator Collaboration', description: 'Finde Kooperationen mit Creatorn und Marken. Kontakt bis Vertrag in einer Plattform.', features: ['Creator-Matching', 'Brand-Deals', 'Vertraege', 'Chat', 'Projekt-Tracking', 'Bewertungen'], useCases: ['Brand Deals', 'Creator-Koops', 'Netzwerk aufbauen'], integrations: ['certificategen', 'monetizemax', 'analyticspro'], color: '#F59E0B' },
  monetizemax: { name: 'MonetizeMax', tagline: 'Revenue Optimization', description: 'Maximiere Einnahmen ueber alle Kanaele mit Analyse und Optimierung.', features: ['Revenue Dashboard', 'Multi-Channel', 'Preis-Optimierung', 'Affiliate', 'Abo-Verwaltung', 'Steuer-Reports'], useCases: ['Einnahmen maximieren', 'Revenue Streams', 'Finanzen'], integrations: ['analyticspro', 'collabhub', 'adengine'], color: '#10B981' },
  analyticspro: { name: 'AnalyticsPro', tagline: 'Cross-Platform Analytics', description: 'Performance ueber alle Plattformen in einem Dashboard verstehen.', features: ['Cross-Platform', 'Audience Insights', 'Content Performance', 'Wachstum', 'Export', 'Echtzeit'], useCases: ['Performance analysieren', 'Wachstum tracken', 'Strategie optimieren'], integrations: ['adengine', 'monetizemax', 'trendradar'], color: '#6366F1' },
  schedulemaster: { name: 'ScheduleMaster', tagline: 'KI-Content Planer', description: 'Content zur optimalen Zeit planen und veroeffentlichen mit KI-Zeitoptimierung.', features: ['Multi-Platform', 'KI-Zeitoptimierung', 'Kalender', 'Batch', 'Auto-Posting', 'Vorschau'], useCases: ['Content vorplanen', 'Optimale Zeiten', 'Multi-Platform'], integrations: ['contentforge', 'trendradar', 'analyticspro'], color: '#F97316' },
  fanconnect: { name: 'FanConnect', tagline: 'Community Management', description: 'Community aufbauen und verwalten mit Fan-Engagement, DMs und exklusiven Inhalten.', features: ['Community-Dashboard', 'Segmentierung', 'DMs', 'Exklusive Inhalte', 'Meilensteine', 'Engagement'], useCases: ['Community aufbauen', 'Engagement steigern', 'Memberships'], integrations: ['monetizemax', 'certificategen', 'analyticspro'], color: '#EF4444' },
  reviewradar: { name: 'ReviewRadar', tagline: 'Alle Bewertungen. Ein Dashboard.', description: 'Google, Trustpilot, ProvenExpert und Yelp in einem Dashboard. KI-Antwortvorschlaege auf Deutsch. Sofort-Alerts bei 1-Stern-Bewertungen. DSGVO-konform.', features: ['Google Business Integration', 'Trustpilot & ProvenExpert', 'KI-Antworten auf Deutsch', 'Sofort-Push bei 1-Stern', 'Sentiment-Analyse', 'Review-Widget'], useCases: ['Lokalbetriebe', 'Restaurants & Hotels', 'Arztpraxen & Kanzleien'], integrations: ['analyticspro', 'fanconnect', 'certificategen'], color: '#1A73E8' },
  churnrescue: { name: 'ChurnRescue', tagline: 'Rette dein MRR. Automatisch.', description: 'Stripe Churn Recovery fuer SaaS-Gruender. Smart Retry, KI Dunning-Mails, Recovery Dashboard. 5-15% MRR-Verlust durch fehlgeschlagene Zahlungen automatisch zurueckholen.', features: ['Smart Retry Engine', 'KI Dunning-Mails DE', 'Recovery Dashboard', 'Stripe Webhooks', 'Churn-Risiko Scoring', 'Slack-Alerts'], useCases: ['SaaS-Gruender', 'Membership Sites', 'Subscription Businesses'], integrations: ['analyticspro', 'monetizemax', 'certificategen'], color: '#FF3B3B' },
  waitlistkit: { name: 'WaitlistKit', tagline: 'Launch mit Hype. Nicht ohne.', description: 'Viral Waitlist + Referral-Tracking in 5 Minuten live. KI optimiert Conversion. Embed-Widget fuer jede Website. DSGVO-konform.', features: ['Virales Referral-System', '5-Min Embed', 'KI Conversion-Opt.', 'Live Dashboard', 'Automatische E-Mails DE', 'Milestone-Rewards'], useCases: ['Startup-Launches', 'Product Launches', 'Pre-Launch Hype'], integrations: ['analyticspro', 'fanconnect', 'adengine'], color: '#7C3AED' },
  certificategen: { name: 'CertificateGen', tagline: 'PDF/QR Zertifikate & Blockchain', description: 'Verifizierbare Zertifikate, Vertraege und Badges mit QR, Barcode und Blockchain.', features: ['PDF-Zertifikate', 'QR-Codes', 'Barcode', 'Blockchain', 'Custom Templates', 'Batch'], useCases: ['Vertraege', 'Authentizitaets-Zertifikate', 'Fan-Badges'], integrations: ['rightsguard', 'collabhub', 'creatorseal'], color: '#FBBF24' },
};

// Ecosystem Event Bus
export class EcosystemBus {
  private static listeners: Map<string, ((event: EcosystemEvent) => void)[]> = new Map();

  static emit(event: EcosystemEvent): void {
    const key = `${event.targetApp}:${event.eventType}`;
    const allKey = `all:${event.eventType}`;
    [...(this.listeners.get(key) || []), ...(this.listeners.get(allKey) || [])]
      .forEach(cb => cb(event));
  }

  static on(app: AppId | 'all', eventType: string, callback: (event: EcosystemEvent) => void): void {
    const key = `${app}:${eventType}`;
    if (!this.listeners.has(key)) this.listeners.set(key, []);
    this.listeners.get(key)!.push(callback);
  }

  static off(app: AppId | 'all', eventType: string): void {
    this.listeners.delete(`${app}:${eventType}`);
  }
}
