export type AgentTier = 'cio' | 'vp' | 'lead' | 'specialist';
export type AgentRuntime = 'claude' | 'paperclip';

export interface AgentDefinition {
  id: string;
  tier: AgentTier;
  runtime: AgentRuntime;
  model: string;
  systemPrompt: string;
  allowedTools?: string[];
  allowedSubAgents?: string[];
  mcpServers?: string[];
}

export type AgentEvent =
  | { type: 'run_start'; agentId: string; runId: string }
  | { type: 'message_delta'; agentId: string; delta: string }
  | { type: 'tool_call'; agentId: string; toolCallId: string; toolName: string; input: unknown }
  | { type: 'tool_result'; agentId: string; toolCallId: string; output: unknown; isError?: boolean }
  | { type: 'sub_agent_start'; agentId: string; childAgentId: string; input: unknown }
  | { type: 'sub_agent_end'; agentId: string; childAgentId: string; output: unknown }
  | { type: 'done'; agentId: string; finalOutput: unknown }
  | { type: 'error'; agentId: string; error: { message: string; stack?: string } };

export interface AgentRunContext {
  runId: string;
  userId: string;
  parentAgentId?: string;
  abortSignal: AbortSignal;
  emit(event: AgentEvent): Promise<void>;
}
