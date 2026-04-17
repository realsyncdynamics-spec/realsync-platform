import { ChatMessage, ModelId, PageContext, ApiKeys, DEFAULT_SETTINGS } from './types';
import { getApiKeys, getSettings } from './storage';

// ── Request / Response types ──────────────────────────────────

export interface CompletionRequest {
  model: ModelId;
  messages: Array<{ role: string; content: string }>;
  context?: PageContext | null;
  stream?: boolean;
}

export type StreamChunk =
  | { type: 'delta'; content: string }
  | { type: 'done'; content: string }
  | { type: 'error'; message: string };

// ── Build system prompt from page context ─────────────────────

export function buildSystemPrompt(context: PageContext | null | undefined): string {
  const base = `Du bist RealSync AI, ein hilfreicher Assistent, der direkt im Browser läuft.
Antworte präzise und auf Deutsch, es sei denn, der Nutzer schreibt in einer anderen Sprache.`;

  if (!context || context.mode === 'none') return base;

  if (context.mode === 'url') {
    return `${base}\n\nAktuell geöffnete Seite: ${context.url}\nTitel: ${context.title}`;
  }
  if (context.mode === 'selection' && context.selectedText) {
    return `${base}\n\nMarkierter Text auf ${context.url}:\n---\n${context.selectedText}\n---`;
  }
  if (context.mode === 'page' && context.pageText) {
    const truncNote = context.truncated ? '\n[Seiteninhalt wurde gekürzt]' : '';
    return `${base}\n\nSeiteninhalt von ${context.url} (Titel: ${context.title}):${truncNote}\n---\n${context.pageText}\n---`;
  }
  return base;
}

// ── Map extension messages to API format ──────────────────────

function mapMessages(
  history: ChatMessage[],
  context: PageContext | null | undefined
): Array<{ role: string; content: string }> {
  const systemPrompt = buildSystemPrompt(context);
  const apiMessages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];
  for (const msg of history) {
    if (msg.role !== 'system') {
      apiMessages.push({ role: msg.role, content: msg.content });
    }
  }
  return apiMessages;
}

// ── Check if a BYO key exists for this model's provider ───────

async function getBYOKey(model: ModelId): Promise<string | undefined> {
  const keys: ApiKeys = await getApiKeys();
  if (model.startsWith('claude')) return keys.anthropic;
  if (model.startsWith('gpt')) return keys.openai;
  if (model.startsWith('gemini')) return keys.google;
  if (model === 'sonar' || model === 'sonar-pro' || model === 'sonar-deep-research')
    return keys.perplexity;
  if (model.startsWith('mistral')) return keys.mistral;
  if (model.startsWith('deepseek')) return keys.deepseek;
  return undefined;
}

// ── Call directly when BYO key is available ───────────────────

async function callProviderDirect(
  model: ModelId,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  onDelta: (text: string) => void
): Promise<string> {
  let endpoint: string;
  let body: unknown;
  let headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (model.startsWith('claude')) {
    endpoint = 'https://api.anthropic.com/v1/messages';
    headers = {
      ...headers,
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };
    const systemMsg = messages.find((m) => m.role === 'system');
    const userMsgs = messages.filter((m) => m.role !== 'system');
    body = {
      model,
      max_tokens: 4096,
      stream: true,
      system: systemMsg?.content,
      messages: userMsgs,
    };
  } else if (model.startsWith('gpt')) {
    endpoint = 'https://api.openai.com/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey}`;
    body = { model, messages, stream: true, max_tokens: 4096 };
  } else if (model.startsWith('gemini')) {
    const geminiModel = model === 'gemini-2.0-flash' ? 'gemini-2.0-flash-exp' : 'gemini-1.5-pro';
    endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?key=${apiKey}&alt=sse`;
    const systemMsg = messages.find((m) => m.role === 'system');
    const userMsgs = messages.filter((m) => m.role !== 'system');
    body = {
      system_instruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
      contents: userMsgs.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: 4096 },
    };
  } else if (model === 'sonar' || model === 'sonar-pro' || model === 'sonar-deep-research') {
    endpoint = 'https://api.perplexity.ai/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey}`;
    body = { model, messages, stream: true, max_tokens: 4096 };
  } else if (model.startsWith('mistral')) {
    endpoint = 'https://api.mistral.ai/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey}`;
    body = { model, messages, stream: true, max_tokens: 4096 };
  } else {
    endpoint = 'https://api.deepseek.com/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey}`;
    body = { model: 'deepseek-chat', messages, stream: true, max_tokens: 4096 };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const err = await res.text();
    throw new Error(`Provider error (${res.status}): ${err.slice(0, 200)}`);
  }

  return readSSEStream(res.body, model, onDelta);
}

// ── Call via RealSync AI Gateway ──────────────────────────────

async function callGateway(
  model: ModelId,
  messages: Array<{ role: string; content: string }>,
  onDelta: (text: string) => void
): Promise<string> {
  const settings = await getSettings();
  const endpoint = `${settings.gatewayUrl}?stream=1`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok || !res.body) {
    const err = await res.text();
    throw new Error(`Gateway error (${res.status}): ${err.slice(0, 200)}`);
  }

  return readSSEStream(res.body, model, onDelta);
}

// ── SSE stream parser ────────────────────────────────────────

async function readSSEStream(
  body: ReadableStream<Uint8Array>,
  model: ModelId,
  onDelta: (text: string) => void
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          let delta = '';

          if (model.startsWith('claude')) {
            // Anthropic SSE format
            if (json.type === 'content_block_delta') {
              delta = json.delta?.text ?? '';
            }
          } else if (model.startsWith('gemini')) {
            // Google SSE format
            delta = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          } else {
            // OpenAI-compatible SSE format (OpenAI, Perplexity, Mistral, DeepSeek)
            delta = json.choices?.[0]?.delta?.content ?? '';
          }

          if (delta) {
            fullText += delta;
            onDelta(delta);
          }
        } catch {
          // ignore malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

// ── Main public API ───────────────────────────────────────────

export async function streamCompletion(
  model: ModelId,
  history: ChatMessage[],
  context: PageContext | null | undefined,
  onDelta: (text: string) => void
): Promise<string> {
  const messages = mapMessages(history, context);
  const byoKey = await getBYOKey(model);

  if (byoKey) {
    return callProviderDirect(model, byoKey, messages, onDelta);
  }
  return callGateway(model, messages, onDelta);
}
