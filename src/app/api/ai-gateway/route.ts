import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ── Types ────────────────────────────────────────────────────

type Provider = 'anthropic' | 'openai' | 'google' | 'perplexity' | 'mistral' | 'deepseek';

interface GatewayRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream?: boolean;
}

interface ProviderConfig {
  provider: Provider;
  endpoint: string;
  authHeader: (key: string) => Record<string, string>;
  buildBody: (model: string, messages: Array<{ role: string; content: string }>, stream: boolean) => unknown;
  extractDelta: (chunk: unknown) => string;
}

// ── Model → provider map ─────────────────────────────────────

function resolveProvider(model: string): Provider {
  if (model.startsWith('claude')) return 'anthropic';
  if (model.startsWith('gpt') || model.startsWith('o1') || model.startsWith('o3')) return 'openai';
  if (model.startsWith('gemini')) return 'google';
  if (model === 'sonar' || model === 'sonar-pro' || model === 'sonar-deep-research') return 'perplexity';
  if (model.startsWith('mistral') || model.startsWith('codestral')) return 'mistral';
  if (model.startsWith('deepseek')) return 'deepseek';
  throw new Error(`Unknown model: ${model}`);
}

function getEnvKey(provider: Provider): string {
  const map: Record<Provider, string | undefined> = {
    anthropic:  process.env.ANTHROPIC_API_KEY,
    openai:     process.env.OPENAI_API_KEY,
    google:     process.env.GOOGLE_AI_API_KEY,
    perplexity: process.env.PPLX_API_KEY ?? process.env.PERPLEXITY_API_KEY,
    mistral:    process.env.MISTRAL_API_KEY,
    deepseek:   process.env.DEEPSEEK_API_KEY,
  };
  const key = map[provider];
  if (!key) throw new Error(`API key not configured for provider: ${provider}`);
  return key;
}

// ── Provider configs ─────────────────────────────────────────

const PROVIDERS: Record<Provider, ProviderConfig> = {
  anthropic: {
    provider: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    authHeader: (key) => ({
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    }),
    buildBody(model, messages, stream) {
      const system = messages.find((m) => m.role === 'system');
      const rest = messages.filter((m) => m.role !== 'system');
      return {
        model,
        max_tokens: 4096,
        stream,
        ...(system && { system: system.content }),
        messages: rest,
      };
    },
    extractDelta(chunk) {
      const c = chunk as { type?: string; delta?: { text?: string } };
      return c.type === 'content_block_delta' ? (c.delta?.text ?? '') : '';
    },
  },

  openai: {
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: (model, messages, stream) => ({ model, messages, stream, max_tokens: 4096 }),
    extractDelta: (chunk) => {
      const c = chunk as { choices?: Array<{ delta?: { content?: string } }> };
      return c.choices?.[0]?.delta?.content ?? '';
    },
  },

  google: {
    provider: 'google',
    // key is appended as query param in fetch call
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    authHeader: () => ({}),
    buildBody(_, messages) {
      const system = messages.find((m) => m.role === 'system');
      const rest = messages.filter((m) => m.role !== 'system');
      return {
        ...(system && { system_instruction: { parts: [{ text: system.content }] } }),
        contents: rest.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 4096 },
      };
    },
    extractDelta: (chunk) => {
      const c = chunk as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      return c.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    },
  },

  perplexity: {
    provider: 'perplexity',
    endpoint: 'https://api.perplexity.ai/chat/completions',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: (model, messages, stream) => ({ model, messages, stream, max_tokens: 4096 }),
    extractDelta: (chunk) => {
      const c = chunk as { choices?: Array<{ delta?: { content?: string } }> };
      return c.choices?.[0]?.delta?.content ?? '';
    },
  },

  mistral: {
    provider: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: (model, messages, stream) => ({ model, messages, stream, max_tokens: 4096 }),
    extractDelta: (chunk) => {
      const c = chunk as { choices?: Array<{ delta?: { content?: string } }> };
      return c.choices?.[0]?.delta?.content ?? '';
    },
  },

  deepseek: {
    provider: 'deepseek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: (model, messages, stream) => ({
      model: model.startsWith('deepseek') ? model : 'deepseek-chat',
      messages,
      stream,
      max_tokens: 4096,
    }),
    extractDelta: (chunk) => {
      const c = chunk as { choices?: Array<{ delta?: { content?: string } }> };
      return c.choices?.[0]?.delta?.content ?? '';
    },
  },
};

// ── SSE stream passthrough ────────────────────────────────────

async function streamFromProvider(
  provider: Provider,
  model: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>
): Promise<Response> {
  const cfg = PROVIDERS[provider];

  let endpoint = cfg.endpoint;
  if (provider === 'google') {
    const geminiId = model === 'gemini-2.0-flash' ? 'gemini-2.0-flash-exp' : model;
    endpoint = `${cfg.endpoint}/${geminiId}:streamGenerateContent?key=${apiKey}&alt=sse`;
  }

  const body = cfg.buildBody(model, messages, true);
  const authHeaders = cfg.authHeader(apiKey);

  const upstream = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify(body),
  });

  if (!upstream.ok || !upstream.body) {
    const err = await upstream.text();
    return NextResponse.json(
      { error: `Provider error ${upstream.status}`, detail: err.slice(0, 500) },
      { status: upstream.status }
    );
  }

  // Pipe upstream SSE → client SSE
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  upstream.body.pipeTo(writable).catch(() => {});

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// ── Non-streaming fallback ────────────────────────────────────

async function fetchComplete(
  provider: Provider,
  model: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>
): Promise<NextResponse> {
  const cfg = PROVIDERS[provider];

  let endpoint = cfg.endpoint;
  if (provider === 'google') {
    const geminiId = model === 'gemini-2.0-flash' ? 'gemini-2.0-flash-exp' : model;
    endpoint = `${cfg.endpoint}/${geminiId}:generateContent?key=${apiKey}`;
  }

  const body = cfg.buildBody(model, messages, false);
  const authHeaders = cfg.authHeader(apiKey);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: `Provider error ${res.status}`, detail: err.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = await res.json();

  // Normalize to OpenAI-style response
  let content = '';
  if (provider === 'anthropic') {
    content = (data.content as Array<{ text?: string }>)?.[0]?.text ?? '';
  } else if (provider === 'google') {
    content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } else {
    content = data.choices?.[0]?.message?.content ?? '';
  }

  return NextResponse.json({
    choices: [{ message: { role: 'assistant', content }, finish_reason: 'stop' }],
    model,
    provider,
  });
}

// ── CORS preflight ────────────────────────────────────────────

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// ── Main handler ──────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check (optional — allow unauthenticated for extension BYO flow)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Validate request body
  let body: GatewayRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { model, messages, stream = false } = body;

  if (!model || typeof model !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid "model" field' }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Missing or empty "messages" array' }, { status: 400 });
  }

  // Resolve provider + API key
  let provider: Provider;
  let apiKey: string;

  try {
    provider = resolveProvider(model);
    apiKey = getEnvKey(provider);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Provider setup failed' },
      { status: 400 }
    );
  }

  // Rate limiting: unauthenticated users get a limited model set
  if (!user) {
    const freeModels = ['claude-haiku-4-5', 'gpt-4o-mini', 'gemini-2.0-flash', 'sonar', 'deepseek-v3'];
    if (!freeModels.includes(model)) {
      return NextResponse.json(
        { error: 'Login required for this model. Please sign in at realsyncdynamics.de' },
        { status: 401 }
      );
    }
  }

  try {
    if (stream || req.nextUrl.searchParams.get('stream') === '1') {
      return streamFromProvider(provider, model, apiKey, messages);
    }
    return fetchComplete(provider, model, apiKey, messages);
  } catch (err) {
    console.error('[ai-gateway]', err);
    return NextResponse.json(
      { error: 'Internal gateway error', detail: String(err).slice(0, 200) },
      { status: 500 }
    );
  }
}
