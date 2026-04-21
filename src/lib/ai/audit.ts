import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

// Service-role client bypasses RLS to write audit rows. Only instantiated
// when SUPABASE_URL + SERVICE_ROLE_KEY are present; otherwise logging is
// a no-op (dev without Supabase still works).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const serviceClient =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
    : null;

export type AiFeature = 'optimus' | 'reviewradar';
export type AiStatus = 'success' | 'error' | 'blocked';

export interface LogAiInteractionParams {
  userId: string | null;
  feature: AiFeature;
  provider: string;
  model: string;
  requestText?: string | null;
  responseText?: string | null;
  tokensIn?: number | null;
  tokensOut?: number | null;
  coinCost?: number | null;
  latencyMs?: number | null;
  status: AiStatus;
  errorMessage?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  disclosureAcknowledged?: boolean;
}

const PREVIEW_LIMIT = 500;

function trim(text: string | null | undefined): string | null {
  if (!text) return null;
  return text.length > PREVIEW_LIMIT ? text.slice(0, PREVIEW_LIMIT) : text;
}

function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.AI_AUDIT_IP_SALT;
  if (!salt) {
    console.warn('[ai-audit] AI_AUDIT_IP_SALT not set; skipping ip_hash.');
    return null;
  }
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

// Insert an EU-AI-Act record-keeping row. Never throws — audit must not
// break user features. Failures are logged to console.
export async function logAiInteraction(params: LogAiInteractionParams): Promise<void> {
  if (!serviceClient) {
    console.warn('[ai-audit] Supabase service role not configured; skipping insert.');
    return;
  }
  try {
    const { error } = await serviceClient.from('ai_interactions').insert({
      user_id: params.userId,
      feature: params.feature,
      provider: params.provider,
      model: params.model,
      request_preview: trim(params.requestText),
      response_preview: trim(params.responseText),
      tokens_in: params.tokensIn ?? null,
      tokens_out: params.tokensOut ?? null,
      coin_cost: params.coinCost ?? null,
      latency_ms: params.latencyMs ?? null,
      status: params.status,
      error_message: params.errorMessage ?? null,
      ip_hash: hashIp(params.ip),
      user_agent: params.userAgent ?? null,
      disclosure_acknowledged: params.disclosureAcknowledged ?? false,
    });
    if (error) console.error('[ai-audit] insert failed:', error.message);
  } catch (err) {
    console.error('[ai-audit] unexpected error:', err);
  }
}
