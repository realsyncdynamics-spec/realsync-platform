# ADR 0002 — Claude Agent SDK als Default-Laufzeit

Status: Accepted
Date: 2026-04-21

## Kontext

AgentOS braucht eine Laufzeit für Agenten-Sessions (Streaming, Tool-Calls, Sub-Agent-Delegation, Abbruch). Die Paperclip-`LLM`-Helfer rufen ein nicht existierendes `/api/agents/llm` auf — sie sind nicht ausführungsfähig. PR #3 führt parallel `@anthropic-ai/sdk` für einen Multi-Model-Chat ein. Wir müssen zwischen SDK-basiertem und Eigenbau entscheiden.

## Entscheidung

**Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) ist die Default-Laufzeit für alle neuen Agenten.** Paperclip bleibt als `runtime: "paperclip"`-Escape-Hatch für OpenAI/Perplexity/DeepSeek erhalten.

## Begründung

- Das SDK bringt native Sub-Agent-Delegation, Tool-Registration, Abbruch, MCP-Support und Event-Streaming mit — alles würden wir in Paperclip nachbauen müssen.
- Die Roadmap (Perplexity Computer + Connectors) passt zum Tool-/MCP-Modell des SDK.
- Die Team-Expertise liegt bei Claude Code — dasselbe Delegations- und Tool-Modell.
- Paperclip bleibt wertvoll für nicht-Anthropic-Modelle; der Adapter kostet ca. 50–100 LOC.

## Konsequenzen

- `AgentDefinition.runtime` ist ein Union-Feld: `"claude" | "paperclip"`.
- `src/lib/agent-os/runtime.ts` ist ein dünner Wrapper um `query()` aus dem SDK.
- Sub-Agent-Delegation erfolgt über SDK-native Tools `delegate_to_{agent_id}`, die die Registry aus `allowedSubAgents` generiert.
- Der Adapter `src/lib/agent-os/adapters/paperclip.ts` wickelt Paperclip-Calls in denselben `AgentEvent`-Stream.
