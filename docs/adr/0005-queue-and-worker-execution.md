# ADR 0005 — Queue und Worker-Ausführung

Status: Accepted
Date: 2026-04-21

## Kontext

Vercels serverless Functions haben ein Timeout von 300 s (Pro-Plan). Agenten-Läufe können länger dauern, benötigen Retries bei transienten Fehlern und sollen die API-Route-Latenz nicht aufhalten. In-Request-Streaming funktioniert für den Demo-Fall, skaliert aber nicht.

## Entscheidung

**Inngest** (https://inngest.com) ist der Queue/Worker-Mechanismus. Begründung:

- Zero-Infra auf Vercel — kein Redis, kein separater Worker-Host.
- Automatische Retries mit konfigurierbarem Backoff.
- Step-Functions erlauben Checkpoints länger als 300 s.
- Die Worker-Funktion lebt im selben Next.js-Code-Base (`src/lib/agent-os/inngest/functions.ts`) und wird per `/api/inngest`-Webhook registriert.
- Free-Tier reicht für den MVP.

## Fluss

1. `POST /api/agent-os/runs` → Insert in `agent_runs` (Status `queued`) → `inngest.send({ name: 'agent/run.requested', data: { runId } })` → Rückgabe `{ runId }` in <200 ms.
2. Inngest ruft `POST /api/inngest` auf → `runAgent`-Funktion lädt Run, ruft `runtime.run()` auf, persistiert Events, setzt Endstatus.
3. Bei Cancel → `POST /api/agent-os/runs/:runId/cancel` setzt `agent_runs.status = cancelled`. Der Worker pollt den Status bei jedem Event-Tick und bricht sauber ab (via `AbortController`).

## Fehler- und Retry-Modell

- Fehler im Runtime-Call → Inngest retry (max. 3), dann `status = failed` + `error`-JSON.
- Timeouts auf Step-Ebene (`step.run`) — SDK-Call ist 1 Step; der Step kann länger als 300 s laufen, da Inngest Steps über Durable Execution hinweg weiterführt.

## Alternativen (verworfen)

- **Vercel Queues**: noch beta, weniger Tooling.
- **Trigger.dev**: ähnlich, aber höhere Einstiegshürde.
- **Eigener Worker-Prozess**: zusätzliche Infra, widerspricht Zero-Infra-Ziel.

## Konsequenzen

- Zwei neue ENV-Variablen: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`.
- `/api/inngest` ist öffentlich, aber signierte Requests werden vom Inngest-SDK validiert.
- Der Worker nutzt den Supabase-Service-Role-Key → niemals client-side exportieren.
