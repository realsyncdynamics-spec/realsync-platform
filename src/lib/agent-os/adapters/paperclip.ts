import { Paperclip } from '../../../../agents/paperclip-core';
import type { AgentDefinition, AgentRunContext } from '../types';

/**
 * Paperclip escape hatch. Runs a legacy Paperclip call through the same
 * AgentEvent pipeline as the Claude SDK runtime so UI + persistence behave
 * identically. The underlying Paperclip.LLM.complete helper hits
 * /api/agents/llm which is not implemented in this slice — this adapter is
 * structural. Implement /api/agents/llm separately when reviving Paperclip
 * for a specific non-Anthropic provider.
 */
export async function runPaperclipAgent(params: {
  definition: AgentDefinition;
  input: string;
  ctx: AgentRunContext;
}): Promise<{ finalOutput: unknown }> {
  const { definition, input, ctx } = params;

  await ctx.emit({ type: 'run_start', agentId: definition.id, runId: ctx.runId });

  const llmConfig: Paperclip.LLMConfig = {
    model: definition.model,
    system_prompt: definition.systemPrompt,
  };

  try {
    const result = await Paperclip.LLM.complete<unknown>(input, llmConfig);
    const text = typeof result === 'string' ? result : JSON.stringify(result);
    await ctx.emit({ type: 'message_delta', agentId: definition.id, delta: text });
    await ctx.emit({ type: 'done', agentId: definition.id, finalOutput: result });
    return { finalOutput: result };
  } catch (err) {
    const error =
      err instanceof Error
        ? { message: err.message, stack: err.stack }
        : { message: String(err) };
    await ctx.emit({ type: 'error', agentId: definition.id, error });
    throw err;
  }
}
