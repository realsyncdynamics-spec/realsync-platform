# ADR 0001 — AgentOS Overview

Status: Accepted
Date: 2026-04-21

## Kontext

`realsync-platform` enthält in `agents/` ein selbstgebautes Paperclip-Framework (Namespace `Paperclip` mit `BaseAgent`, `EventBus`, `Router`, `LLM`) plus eine Hierarchie in `agents/agent-hierarchy.json` (CIO → VPs → Leads → Spezialisten). Dieses Framework ist konzeptionell sauber, aber nie mit der Produktion verbunden: keine HTTP-Einstiegspunkte, keine Persistenz, keine Ausführung. Das Ökosystem (Next.js 14 App Router, Supabase, Vercel, Stripe, Perplexity) wartet auf eine produktionstaugliche Agenten-Laufzeit, und die Roadmap verweist auf Perplexity Computer (Q3 2026) und Connectors (Q4 2026).

## Entscheidung

Wir führen **AgentOS** als formale Agenten-Laufzeit ein. AgentOS ist:

- Eine dünne Laufzeit (`src/lib/agent-os/`) auf Basis des Claude Agent SDK.
- Ein HTTP-Einstiegspunkt unter `src/app/api/agent-os/`.
- Ein Hintergrund-Worker (Inngest), der Agenten-Läufe aus der 300 s-Vercel-Grenze herauslöst.
- Supabase-Persistenz mit Realtime-Streaming zur UI.
- Ein Vertical Slice: genau ein funktionierender Spezialist (`specialist-creatorseal-copywriter`) plus das Gerüst für weitere.

## Ziele

1. Ein End-to-End-Pfad von UI → API → Queue → Worker → SDK → Persistenz → Realtime → UI, der sich lokal und auf Vercel ausführen lässt.
2. Die Paperclip-Hierarchie (`agent-hierarchy.json`) bleibt Konfigurationsquelle; die Registry validiert Definitionen gegen sie.
3. Das bestehende Paperclip-Framework bleibt als **Escape Hatch** für OpenAI/Perplexity/DeepSeek nutzbar, ohne Rewrites.

## Nicht-Ziele

- Keine Migration oder Löschung des bestehenden `agents/`-Ordners.
- Keine Implementierung aller Agenten aus der Hierarchie — nur Stubs plus der eine arbeitende Spezialist.
- Kein neues Frontend-Design-System — wir nutzen die bestehenden Bausteine.
- Keine Multi-Tenant-Isolation über Supabase-RLS hinaus.

## Konsequenzen

- Neue Dependencies: `@anthropic-ai/claude-agent-sdk`, `@anthropic-ai/sdk`, `inngest`.
- Neue ENV-Variablen: `ANTHROPIC_API_KEY`, `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`.
- Neue Supabase-Tabellen: `agent_runs`, `agent_events`, `agent_tool_calls`.
- Neuer Webhook-Endpoint `/api/inngest`.

## Verweise

- ADR 0002 — Claude Agent SDK als Default-Laufzeit
- ADR 0003 — Paperclip-Hierarchie als Konfiguration
- ADR 0004 — Persistenz und Streaming
- ADR 0005 — Queue und Worker-Ausführung
