import type { AgentDefinition, AgentRunContext } from './types';
import { runAgent as runClaudeAgent } from './runtime';
import { runPaperclipAgent } from './adapters/paperclip';

export interface DispatchParams {
  definition: AgentDefinition;
  input: string;
  ctx: AgentRunContext;
}

export async function dispatch(params: DispatchParams) {
  if (params.definition.runtime === 'paperclip') {
    return runPaperclipAgent(params);
  }
  return runClaudeAgent(params);
}
