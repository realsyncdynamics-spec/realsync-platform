import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AgentEvent, AgentRunContext } from './types';

let _admin: SupabaseClient | null = null;

export function admin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('[agent-os] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
  }
  _admin = createClient(url, key, { auth: { persistSession: false } });
  return _admin;
}

export async function createRun(params: {
  userId: string;
  agentId: string;
  input: unknown;
}): Promise<string> {
  const sb = admin();
  const { data, error } = await sb
    .from('agent_runs')
    .insert({
      user_id: params.userId,
      agent_id: params.agentId,
      input: params.input,
      status: 'queued',
    })
    .select('id')
    .single();
  if (error || !data) {
    throw new Error(`[agent-os] createRun failed: ${error?.message ?? 'no row returned'}`);
  }
  return data.id as string;
}

type TerminalStatus = 'running' | 'completed' | 'failed' | 'cancelled';

export async function setRunStatus(
  runId: string,
  status: TerminalStatus,
  patch: Partial<{ final_output: unknown; error: unknown }> = {},
): Promise<void> {
  const sb = admin();
  const update: Record<string, unknown> = { status };
  if (status === 'completed' || status === 'failed' || status === 'cancelled') {
    update.completed_at = new Date().toISOString();
  }
  if ('final_output' in patch) update.final_output = patch.final_output;
  if ('error' in patch) update.error = patch.error;
  const { error } = await sb.from('agent_runs').update(update).eq('id', runId);
  if (error) throw new Error(`[agent-os] setRunStatus failed: ${error.message}`);
}

export async function getRunStatus(runId: string): Promise<string | null> {
  const sb = admin();
  const { data } = await sb.from('agent_runs').select('status').eq('id', runId).single();
  return (data?.status as string | undefined) ?? null;
}

export async function getRun(runId: string) {
  const sb = admin();
  const { data } = await sb.from('agent_runs').select('*').eq('id', runId).single();
  return data;
}

export async function listEvents(runId: string) {
  const sb = admin();
  const { data } = await sb
    .from('agent_events')
    .select('*')
    .eq('run_id', runId)
    .order('seq', { ascending: true });
  return data ?? [];
}

/**
 * Returns an emitter bound to a run. Writes to agent_events; Postgres Changes on
 * that table propagate via Supabase Realtime to subscribed clients — no explicit
 * broadcast needed. Tool-call denormalization into agent_tool_calls is best-effort.
 */
export function createEmitter(runId: string): AgentRunContext['emit'] {
  const sb = admin();
  let seq = 0;
  return async (event: AgentEvent) => {
    seq += 1;
    const agentId = 'agentId' in event ? event.agentId : null;
    await sb.from('agent_events').insert({
      run_id: runId,
      seq,
      type: event.type,
      agent_id: agentId,
      payload: event as unknown,
    });

    if (event.type === 'tool_call') {
      await sb.from('agent_tool_calls').insert({
        run_id: runId,
        tool_name: event.toolName,
        input: event.input,
        status: 'pending',
      });
    } else if (event.type === 'tool_result') {
      await sb
        .from('agent_tool_calls')
        .update({ output: event.output, status: event.isError ? 'error' : 'completed' })
        .eq('run_id', runId)
        .eq('status', 'pending');
    }
  };
}
