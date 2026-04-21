'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';

type EventRow = {
  id: string;
  run_id: string;
  seq: number;
  type: string;
  agent_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

export function AgentRunStream({ runId }: { runId: string }) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [status, setStatus] = useState<string>('queued');

  useEffect(() => {
    const sb = createClient();
    let mounted = true;

    async function bootstrap() {
      const { data: initial } = await sb
        .from('agent_events')
        .select('*')
        .eq('run_id', runId)
        .order('seq', { ascending: true });
      if (mounted && initial) setEvents(initial as EventRow[]);

      const { data: run } = await sb
        .from('agent_runs')
        .select('status')
        .eq('id', runId)
        .single();
      if (mounted && run) setStatus(run.status as string);
    }

    bootstrap();

    const channel = sb
      .channel(`agent_run:${runId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_events',
          filter: `run_id=eq.${runId}`,
        },
        (payload) => {
          if (!mounted) return;
          setEvents((prev) => [...prev, payload.new as EventRow]);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agent_runs',
          filter: `id=eq.${runId}`,
        },
        (payload) => {
          if (!mounted) return;
          setStatus((payload.new as { status: string }).status);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      sb.removeChannel(channel);
    };
  }, [runId]);

  async function cancel() {
    await fetch(`/api/agent-os/runs/${runId}/cancel`, { method: 'POST' });
  }

  const isActive = status === 'queued' || status === 'running';

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">Run: {runId.slice(0, 8)}...</span>
        <div className="flex items-center gap-2">
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs uppercase tracking-wide">
            {status}
          </span>
          {isActive ? (
            <button
              onClick={cancel}
              className="rounded border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
      <div className="max-h-96 space-y-1 overflow-auto font-mono text-xs">
        {events.map((e) => (
          <div key={e.id} className="border-b border-zinc-100 pb-1">
            <span className="text-zinc-400">#{e.seq}</span>{' '}
            <span className="text-emerald-600">{e.type}</span>
            {e.agent_id ? <span className="text-zinc-500"> @{e.agent_id}</span> : null}
            <EventPayload payload={e.payload} type={e.type} />
          </div>
        ))}
        {events.length === 0 ? (
          <div className="text-zinc-400">Warte auf Events...</div>
        ) : null}
      </div>
    </div>
  );
}

function EventPayload({
  payload,
  type,
}: {
  payload: Record<string, unknown>;
  type: string;
}) {
  if (type === 'message_delta') {
    return (
      <div className="whitespace-pre-wrap pl-4 text-zinc-900">
        {String(payload.delta ?? '')}
      </div>
    );
  }
  if (type === 'tool_call') {
    return (
      <div className="pl-4 text-zinc-600">
        -&gt; {String(payload.toolName)}({JSON.stringify(payload.input)})
      </div>
    );
  }
  if (type === 'done') {
    return (
      <div className="pl-4 text-zinc-800">
        Ergebnis:{' '}
        <span className="whitespace-pre-wrap">{JSON.stringify(payload.finalOutput)}</span>
      </div>
    );
  }
  if (type === 'error') {
    const err = payload.error as { message?: string } | undefined;
    return <div className="pl-4 text-red-600">{err?.message ?? 'error'}</div>;
  }
  return null;
}
