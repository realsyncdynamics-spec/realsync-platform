// ── Model IDs ────────────────────────────────────────────────
export type ModelId =
  | 'claude-sonnet-4-6'
  | 'claude-opus-4-7'
  | 'claude-haiku-4-5'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gemini-2.0-flash'
  | 'gemini-1.5-pro'
  | 'sonar'
  | 'sonar-pro'
  | 'sonar-deep-research'
  | 'mistral-large'
  | 'deepseek-v3';

export interface ModelDef {
  id: ModelId;
  label: string;
  provider: 'anthropic' | 'openai' | 'google' | 'perplexity' | 'mistral' | 'deepseek';
  icon: string;
  color: string;
  description: string;
  supportsVision: boolean;
  supportsSearch: boolean;
  tier: 'free' | 'pro' | 'premium';
}

export const MODELS: ModelDef[] = [
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet',
    provider: 'anthropic',
    icon: '🟠',
    color: '#CC785C',
    description: 'Schnell & klug – für die meisten Aufgaben',
    supportsVision: true,
    supportsSearch: false,
    tier: 'pro',
  },
  {
    id: 'claude-opus-4-7',
    label: 'Claude Opus',
    provider: 'anthropic',
    icon: '🟠',
    color: '#CC785C',
    description: 'Intelligentestes Claude Modell',
    supportsVision: true,
    supportsSearch: false,
    tier: 'premium',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku',
    provider: 'anthropic',
    icon: '🟠',
    color: '#CC785C',
    description: 'Ultraschnell & kosteneffizient',
    supportsVision: true,
    supportsSearch: false,
    tier: 'free',
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    provider: 'openai',
    icon: '🟢',
    color: '#10A37F',
    description: 'OpenAIs bestes Multimodal-Modell',
    supportsVision: true,
    supportsSearch: false,
    tier: 'pro',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    provider: 'openai',
    icon: '🟢',
    color: '#10A37F',
    description: 'Schnell & günstig von OpenAI',
    supportsVision: true,
    supportsSearch: false,
    tier: 'free',
  },
  {
    id: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
    provider: 'google',
    icon: '🔵',
    color: '#4285F4',
    description: 'Googles schnellstes Modell',
    supportsVision: true,
    supportsSearch: true,
    tier: 'free',
  },
  {
    id: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro',
    provider: 'google',
    icon: '🔵',
    color: '#4285F4',
    description: '1M Token Kontext – ideal für lange Texte',
    supportsVision: true,
    supportsSearch: true,
    tier: 'pro',
  },
  {
    id: 'sonar',
    label: 'Perplexity Sonar',
    provider: 'perplexity',
    icon: '⚡',
    color: '#20B2AA',
    description: 'Echtzeit Web-Suche',
    supportsVision: false,
    supportsSearch: true,
    tier: 'free',
  },
  {
    id: 'sonar-pro',
    label: 'Sonar Pro',
    provider: 'perplexity',
    icon: '🔍',
    color: '#20B2AA',
    description: 'Tiefe Web-Recherche mit Citations',
    supportsVision: false,
    supportsSearch: true,
    tier: 'pro',
  },
  {
    id: 'mistral-large',
    label: 'Mistral Large',
    provider: 'mistral',
    icon: '🌊',
    color: '#F97316',
    description: 'Europäisches Flaggschiff-Modell',
    supportsVision: false,
    supportsSearch: false,
    tier: 'pro',
  },
  {
    id: 'deepseek-v3',
    label: 'DeepSeek V3',
    provider: 'deepseek',
    icon: '🦈',
    color: '#6366F1',
    description: 'Leistungsstarkes Open-Source-Modell',
    supportsVision: false,
    supportsSearch: false,
    tier: 'free',
  },
];

// ── Chat types ───────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  model?: ModelId;
  timestamp: number;
  contextUsed?: PageContext | null;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: ModelId;
  createdAt: number;
  updatedAt: number;
}

// ── Page context ─────────────────────────────────────────────
export type ContextMode = 'none' | 'selection' | 'page' | 'url';

export interface PageContext {
  mode: ContextMode;
  url: string;
  title: string;
  selectedText?: string;
  pageText?: string;
  truncated?: boolean;
}

// ── Extension messages ───────────────────────────────────────
export type ExtMessage =
  | { type: 'GET_PAGE_CONTEXT' }
  | { type: 'PAGE_CONTEXT'; payload: PageContext }
  | { type: 'OPEN_SIDEBAR' }
  | { type: 'CONTEXT_UPDATED'; payload: PageContext };

// ── Storage keys ─────────────────────────────────────────────
export const STORAGE_KEYS = {
  SESSIONS: 'rs_sessions',
  ACTIVE_SESSION: 'rs_active_session',
  ACTIVE_MODEL: 'rs_active_model',
  API_KEYS: 'rs_api_keys',
  CONTEXT_MODE: 'rs_context_mode',
  SETTINGS: 'rs_settings',
} as const;

// ── Settings ─────────────────────────────────────────────────
export interface ApiKeys {
  anthropic?: string;
  openai?: string;
  google?: string;
  perplexity?: string;
  mistral?: string;
  deepseek?: string;
}

export interface ExtSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'de' | 'en';
  streamingEnabled: boolean;
  contextModeDefault: ContextMode;
  gatewayUrl: string;
}

export const DEFAULT_SETTINGS: ExtSettings = {
  theme: 'dark',
  language: 'de',
  streamingEnabled: true,
  contextModeDefault: 'selection',
  gatewayUrl: 'https://realsyncdynamics.de/api/ai-gateway',
};
