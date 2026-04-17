import {
  ApiKeys,
  ChatSession,
  ExtSettings,
  DEFAULT_SETTINGS,
  ModelId,
  ContextMode,
  STORAGE_KEYS,
} from './types';

// ── Typed chrome.storage.local wrappers ──────────────────────

function get<T>(key: string, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] !== undefined ? (result[key] as T) : fallback);
    });
  });
}

function set(key: string, value: unknown): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

// ── Sessions ─────────────────────────────────────────────────

export async function getSessions(): Promise<ChatSession[]> {
  return get<ChatSession[]>(STORAGE_KEYS.SESSIONS, []);
}

export async function saveSession(session: ChatSession): Promise<void> {
  const sessions = await getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  await set(STORAGE_KEYS.SESSIONS, sessions.slice(0, 50));
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  await set(STORAGE_KEYS.SESSIONS, sessions.filter((s) => s.id !== id));
}

export async function getActiveSessionId(): Promise<string | null> {
  return get<string | null>(STORAGE_KEYS.ACTIVE_SESSION, null);
}

export async function setActiveSessionId(id: string): Promise<void> {
  await set(STORAGE_KEYS.ACTIVE_SESSION, id);
}

// ── Model preference ─────────────────────────────────────────

export async function getActiveModel(): Promise<ModelId> {
  return get<ModelId>(STORAGE_KEYS.ACTIVE_MODEL, 'claude-sonnet-4-6');
}

export async function setActiveModel(model: ModelId): Promise<void> {
  await set(STORAGE_KEYS.ACTIVE_MODEL, model);
}

// ── Context mode ─────────────────────────────────────────────

export async function getContextMode(): Promise<ContextMode> {
  return get<ContextMode>(STORAGE_KEYS.CONTEXT_MODE, 'selection');
}

export async function setContextMode(mode: ContextMode): Promise<void> {
  await set(STORAGE_KEYS.CONTEXT_MODE, mode);
}

// ── API Keys (BYO) ───────────────────────────────────────────

export async function getApiKeys(): Promise<ApiKeys> {
  return get<ApiKeys>(STORAGE_KEYS.API_KEYS, {});
}

export async function setApiKeys(keys: ApiKeys): Promise<void> {
  await set(STORAGE_KEYS.API_KEYS, keys);
}

// ── Settings ─────────────────────────────────────────────────

export async function getSettings(): Promise<ExtSettings> {
  return get<ExtSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: Partial<ExtSettings>): Promise<void> {
  const current = await getSettings();
  await set(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
}

// ── ID helpers ───────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
