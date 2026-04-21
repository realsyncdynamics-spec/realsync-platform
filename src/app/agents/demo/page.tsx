'use client';

import { useState } from 'react';
import { AgentRunStream } from '../../../components/agent-os/AgentRunStream';

const AGENTS = [
  { id: 'cio_agent', label: 'CIO (delegiert an VP)' },
  { id: 'vp_customer_success', label: 'VP Customer Success' },
  { id: 'customer_service_lead', label: 'Customer Service Lead' },
  {
    id: 'specialist_creatorseal_copywriter',
    label: 'CreatorSeal Copywriter (Specialist)',
  },
];

export default function AgentOsDemoPage() {
  const [agentId, setAgentId] = useState(AGENTS[3].id);
  const [input, setInput] = useState(
    'Schreibe einen Claim für das Sync-Licensing-Pitch-Deck eines Indie-Musikers.',
  );
  const [runId, setRunId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/agent-os/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, input: { prompt: input } }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? 'run creation failed');
      setRunId(body.runId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-xl font-semibold">AgentOS Demo</h1>
        <p className="text-sm text-zinc-500">
          Vertikale Scheibe: Run erzeugen, Inngest-Worker verarbeitet, Events per Supabase
          Realtime.
        </p>
      </header>

      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Agent
          </span>
          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-full rounded border border-zinc-200 p-2 text-sm"
          >
            {AGENTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Briefing
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full rounded border border-zinc-200 p-2 text-sm"
          />
        </label>
        <div className="flex items-center justify-between">
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {submitting ? 'Starte...' : 'Run starten'}
          </button>
          {err ? <span className="text-xs text-red-600">{err}</span> : null}
        </div>
      </section>

      {runId ? <AgentRunStream runId={runId} /> : null}
    </main>
  );
}
