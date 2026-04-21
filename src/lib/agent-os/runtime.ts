import { query, type Options } from '@anthropic-ai/claude-agent-sdk';
import type { AgentDefinition, AgentRunContext } from './types';
import { getAgent } from './registry';
import { normalizeSdkMessage } from './transport';

export interface RunAgentParams {
  definition: AgentDefinition;
  input: string;
  ctx: AgentRunContext;
}

export interface RunAgentResult {
  finalOutput: unknown;
}

/**
 * Invoke a Claude-runtime agent. Paperclip-runtime agents go through the adapter.
 */
export async function runAgent(params: RunAgentParams): Promise<RunAgentResult> {
  const { definition, input, ctx } = params;

  await ctx.emit({ type: 'run_start', agentId: definition.id, runId: ctx.runId });

  const subAgents: Record<
    string,
    { description: string; prompt: string; model: string; tools?: string[] }
  > = {};
  for (const subId of definition.allowedSubAgents ?? []) {
    const sub = getAgent(subId);
    subAgents[subId] = {
      description: `Delegate to ${subId} (${sub.tier})`,
      prompt: sub.systemPrompt,
      model: sub.model,
      tools: sub.allowedTools,
    };
  }

  const options: Options = {
    model: definition.model,
    systemPrompt: definition.systemPrompt,
    agents: Object.keys(subAgents).length > 0 ? subAgents : undefined,
    allowedTools: definition.allowedTools,
    abortSignal: ctx.abortSignal,
  } as unknown as Options;

  let finalOutput: unknown = null;

  try {
    const iter = query({ prompt: input, options });
    for await (const message of iter as AsyncIterable<unknown>) {
      const events = normalizeSdkMessage(message, definition.id);
      for (const ev of events) {
        await ctx.emit(ev);
        if (ev.type === 'done') finalOutput = ev.finalOutput;
      }
    }
    if (finalOutput == null) {
      await ctx.emit({ type: 'done', agentId: definition.id, finalOutput: null });
    }
  } catch (err) {
    const error =
      err instanceof Error ? { message: err.message, stack: err.stack } : { message: String(err) };
    await ctx.emit({ type: 'error', agentId: definition.id, error });
    throw err;
  }

  return { finalOutput };
}
