import type { AgentEvent } from './types';

/**
 * Best-effort normalization of Claude Agent SDK messages into AgentEvent.
 * The SDK streams `assistant`, `user` (for tool_results), `result` and `system` messages;
 * we map content blocks into granular events and drop frames we don't forward.
 */
export function normalizeSdkMessage(message: unknown, agentId: string): AgentEvent[] {
  if (!message || typeof message !== 'object') return [];
  const m = message as Record<string, unknown>;
  const events: AgentEvent[] = [];

  switch (m.type) {
    case 'assistant': {
      const content = extractContent(m);
      for (const block of content) {
        if (block.type === 'text' && typeof block.text === 'string') {
          events.push({ type: 'message_delta', agentId, delta: block.text });
        } else if (block.type === 'tool_use') {
          events.push({
            type: 'tool_call',
            agentId,
            toolCallId: String(block.id ?? ''),
            toolName: String(block.name ?? ''),
            input: block.input,
          });
        }
      }
      break;
    }
    case 'user': {
      const content = extractContent(m);
      for (const block of content) {
        if (block.type === 'tool_result') {
          events.push({
            type: 'tool_result',
            agentId,
            toolCallId: String(block.tool_use_id ?? ''),
            output: block.content,
            isError: Boolean(block.is_error),
          });
        }
      }
      break;
    }
    case 'result': {
      events.push({
        type: 'done',
        agentId,
        finalOutput: (m.result ?? m.content ?? null) as unknown,
      });
      break;
    }
    default:
      break;
  }

  return events;
}

type ContentBlock = {
  type?: string;
  text?: unknown;
  id?: unknown;
  name?: unknown;
  input?: unknown;
  tool_use_id?: unknown;
  content?: unknown;
  is_error?: unknown;
};

function extractContent(m: Record<string, unknown>): ContentBlock[] {
  const direct = m.content;
  const nested = (m.message as Record<string, unknown> | undefined)?.content;
  const raw = Array.isArray(direct) ? direct : Array.isArray(nested) ? nested : [];
  return raw.filter((b): b is ContentBlock => typeof b === 'object' && b !== null);
}
