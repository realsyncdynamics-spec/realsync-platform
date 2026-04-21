# ADR 0004 — Persistenz und Streaming

Status: Accepted
Date: 2026-04-21

## Kontext

Agenten-Läufe sind asynchron, langlaufend und emittieren Events (Messages, Tool-Calls, Sub-Agent-Delegationen). UIs brauchen Live-Updates. Wir brauchen Persistenz für Wiedergabe/Audit.

## Entscheidung

### Tabellen (Supabase)

1. **`agent_runs`** — eine Zeile pro Top-Level-Aufruf. Status: `queued | running | completed | failed | cancelled`.
2. **`agent_events`** — append-only. Felder: `run_id`, `seq`, `type`, `agent_id`, `parent_event_id`, `payload`.
3. **`agent_tool_calls`** — denormalisierte Sicht für Observability.

RLS: Alle Tabellen filtern nach `user_id` (direkt oder via `run_id`-Join). Service-Role-Bypass für den Worker.

### Streaming

Jedes Event, das der Worker in `agent_events` schreibt, wird gleichzeitig per Supabase Realtime in den Kanal `agent_run:{run_id}` gesendet. Clients abonnieren den Kanal und erhalten Live-Events.

**SSE-Fallback**: `GET /api/agent-os/runs/:runId/stream` liefert dieselben Events per Server-Sent-Events, für Clients ohne Realtime-Zugriff.

## Konsequenzen

- Ein Migration-File: `supabase/migrations/20260421000000_agent_os.sql`.
- `src/lib/agent-os/persistence.ts` kapselt alle Writes + Publishes.
- Das UI-Bauteil `AgentRunStream.tsx` nutzt den Realtime-Client.
- Kein Polling in der UI nötig.
