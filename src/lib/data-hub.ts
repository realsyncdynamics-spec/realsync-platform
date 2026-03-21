// RealSync Ecosystem Data Hub - Cross-App Data Transfer & Automation
// Barrierefreier Datenbus fuer nahtlose App-Kommunikation

export type AppId = 'creatorseal' | 'adengine' | 'trendradar' | 'contentforge' | 'fanconnect' | 'mediavault' | 'rightsguard' | 'schedulemaster' | 'monetizehub' | 'collabspace' | 'analyticsplus' | 'brandkit' | 'gate';

export interface DataPacket {
  id: string;
  sourceApp: AppId;
  targetApp: AppId;
  dataType: 'content' | 'analytics' | 'certificate' | 'media' | 'schedule' | 'trend' | 'ad' | 'rights' | 'payment' | 'profile' | 'collaboration';
  payload: Record<string, any>;
  timestamp: number;
  userId: string;
  status: 'pending' | 'delivered' | 'processed' | 'failed';
}

export interface WorkflowStep {
  id: string;
  appId: AppId;
  action: string;
  config: Record<string, any>;
  next?: string;
  condition?: { field: string; operator: 'eq' | 'gt' | 'lt' | 'contains'; value: any };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: { appId: AppId; event: string };
  steps: WorkflowStep[];
  active: boolean;
  createdAt: number;
  executionCount: number;
}

export interface DataTransferRoute {
  source: AppId;
  target: AppId;
  dataTypes: string[];
  description: string;
  autoSync: boolean;
}

// All possible data routes between apps
export const DATA_ROUTES: DataTransferRoute[] = [
  { source: 'creatorseal', target: 'mediavault', dataTypes: ['certificate', 'media'], description: 'Verifizierte Inhalte automatisch in MediaVault archivieren', autoSync: true },
  { source: 'creatorseal', target: 'rightsguard', dataTypes: ['certificate', 'rights'], description: 'C2PA-Zertifikate fuer Rechteschutz uebertragen', autoSync: true },
  { source: 'trendradar', target: 'contentforge', dataTypes: ['trend'], description: 'Trending Topics als Content-Vorlagen nutzen', autoSync: true },
  { source: 'trendradar', target: 'adengine', dataTypes: ['trend', 'analytics'], description: 'Trend-Daten fuer Werbekampagnen verwenden', autoSync: true },
  { source: 'contentforge', target: 'schedulemaster', dataTypes: ['content', 'schedule'], description: 'Erstellte Inhalte direkt zum Planen weiterleiten', autoSync: true },
  { source: 'contentforge', target: 'creatorseal', dataTypes: ['content', 'media'], description: 'Inhalte zur C2PA-Verifizierung senden', autoSync: false },
  { source: 'schedulemaster', target: 'analyticsplus', dataTypes: ['schedule', 'analytics'], description: 'Posting-Daten fuer Performance-Analyse', autoSync: true },
  { source: 'analyticsplus', target: 'trendradar', dataTypes: ['analytics'], description: 'Performance-Daten fuer Trend-Erkennung', autoSync: true },
  { source: 'analyticsplus', target: 'adengine', dataTypes: ['analytics'], description: 'Analytics fuer Ad-Optimierung nutzen', autoSync: true },
  { source: 'adengine', target: 'monetizehub', dataTypes: ['ad', 'payment'], description: 'Werbeeinnahmen tracken', autoSync: true },
  { source: 'fanconnect', target: 'analyticsplus', dataTypes: ['analytics', 'profile'], description: 'Fan-Engagement-Daten analysieren', autoSync: true },
  { source: 'fanconnect', target: 'adengine', dataTypes: ['profile', 'analytics'], description: 'Zielgruppen-Daten fuer Ad-Targeting', autoSync: false },
  { source: 'monetizehub', target: 'analyticsplus', dataTypes: ['payment', 'analytics'], description: 'Einnahmen-Daten in Analytics', autoSync: true },
  { source: 'collabspace', target: 'contentforge', dataTypes: ['collaboration', 'content'], description: 'Kollaborations-Ergebnisse als Content nutzen', autoSync: false },
  { source: 'brandkit', target: 'contentforge', dataTypes: ['media', 'profile'], description: 'Brand-Assets in Content-Erstellung', autoSync: true },
  { source: 'brandkit', target: 'adengine', dataTypes: ['media', 'profile'], description: 'Brand-Assets fuer Werbung verwenden', autoSync: true },
  { source: 'gate', target: 'creatorseal', dataTypes: ['content', 'media'], description: 'Gate-Inhalte verifizieren', autoSync: false },
  { source: 'rightsguard', target: 'monetizehub', dataTypes: ['rights', 'payment'], description: 'Lizenzeinnahmen tracken', autoSync: true },
];

// Preset automation workflows
export const PRESET_WORKFLOWS: Workflow[] = [
  {
    id: 'auto-verify-publish',
    name: 'Auto-Verifizierung & Publishing',
    description: 'Neuer Content wird automatisch mit C2PA verifiziert, mit Wasserzeichen versehen und geplant',
    trigger: { appId: 'contentforge', event: 'content.created' },
    steps: [
      { id: 's1', appId: 'creatorseal', action: 'verify_c2pa', config: { addWatermark: true, addBarcode: true } },
      { id: 's2', appId: 'mediavault', action: 'archive', config: { folder: 'verified' }, next: 's3' },
      { id: 's3', appId: 'schedulemaster', action: 'schedule_post', config: { platforms: ['instagram', 'tiktok', 'youtube'], optimizeTime: true } },
    ],
    active: true, createdAt: Date.now(), executionCount: 147
  },
  {
    id: 'trend-to-content',
    name: 'Trend-zu-Content Pipeline',
    description: 'Erkannte Trends werden automatisch in Content-Vorlagen und Werbekampagnen umgewandelt',
    trigger: { appId: 'trendradar', event: 'trend.detected' },
    steps: [
      { id: 's1', appId: 'contentforge', action: 'generate_template', config: { type: 'reel', aiAssisted: true } },
      { id: 's2', appId: 'adengine', action: 'create_campaign', config: { budget: 'auto', targeting: 'trend-based' } },
    ],
    active: true, createdAt: Date.now(), executionCount: 89
  },
  {
    id: 'full-protection',
    name: 'Vollstaendiger Content-Schutz',
    description: 'Jeder Upload wird mit C2PA, Wasserzeichen, Blockchain-Hash und Barcode geschuetzt',
    trigger: { appId: 'mediavault', event: 'media.uploaded' },
    steps: [
      { id: 's1', appId: 'creatorseal', action: 'apply_c2pa', config: {} },
      { id: 's2', appId: 'creatorseal', action: 'apply_watermark', config: { type: 'invisible' } },
      { id: 's3', appId: 'creatorseal', action: 'generate_blockchain_hash', config: {} },
      { id: 's4', appId: 'creatorseal', action: 'generate_barcode', config: { type: 'qr' } },
      { id: 's5', appId: 'rightsguard', action: 'register_rights', config: { license: 'creator-owned' } },
    ],
    active: true, createdAt: Date.now(), executionCount: 312
  },
  {
    id: 'monetization-pipeline',
    name: 'Monetarisierungs-Pipeline',
    description: 'Analytics-basierte automatische Ad-Optimierung und Einnahmen-Tracking',
    trigger: { appId: 'analyticsplus', event: 'report.generated' },
    steps: [
      { id: 's1', appId: 'adengine', action: 'optimize_ads', config: { strategy: 'roi-max' } },
      { id: 's2', appId: 'monetizehub', action: 'update_revenue', config: {} },
      { id: 's3', appId: 'fanconnect', action: 'segment_audience', config: { criteria: 'engagement' } },
    ],
    active: false, createdAt: Date.now(), executionCount: 56
  },
  {
    id: 'collab-workflow',
    name: 'Kollaborations-Workflow',
    description: 'Team-Projekte automatisch verteilen, Brand-Assets laden und Ergebnisse verifizieren',
    trigger: { appId: 'collabspace', event: 'project.created' },
    steps: [
      { id: 's1', appId: 'brandkit', action: 'load_assets', config: { type: 'all' } },
      { id: 's2', appId: 'contentforge', action: 'create_workspace', config: {} },
      { id: 's3', appId: 'creatorseal', action: 'prepare_verification', config: {} },
    ],
    active: true, createdAt: Date.now(), executionCount: 23
  },
];

// Data Hub class for managing cross-app data transfer
export class EcosystemDataHub {
  private packets: DataPacket[] = [];
  private listeners: Map<string, ((packet: DataPacket) => void)[]> = new Map();

  emit(sourceApp: AppId, targetApp: AppId, dataType: DataPacket['dataType'], payload: Record<string, any>, userId: string): DataPacket {
    const packet: DataPacket = {
      id: `pkt_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      sourceApp, targetApp, dataType, payload, userId,
      timestamp: Date.now(), status: 'pending'
    };
    this.packets.push(packet);
    const key = `${targetApp}:${dataType}`;
    this.listeners.get(key)?.forEach(fn => { try { fn(packet); packet.status = 'delivered'; } catch { packet.status = 'failed'; } });
    if (packet.status === 'pending') packet.status = 'delivered';
    return packet;
  }

  on(appId: AppId, dataType: DataPacket['dataType'], callback: (packet: DataPacket) => void) {
    const key = `${appId}:${dataType}`;
    if (!this.listeners.has(key)) this.listeners.set(key, []);
    this.listeners.get(key)!.push(callback);
  }

  getHistory(userId: string, limit = 50): DataPacket[] {
    return this.packets.filter(p => p.userId === userId).slice(-limit);
  }

  getRoutes(): DataTransferRoute[] { return DATA_ROUTES; }
  getWorkflows(): Workflow[] { return PRESET_WORKFLOWS; }
}

export const dataHub = new EcosystemDataHub();
