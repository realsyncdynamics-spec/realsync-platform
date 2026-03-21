// RealSync Agent Router - KI-Agent Orchestration System

export type AgentType = 'perplexity' | 'gemini' | 'comet' | 'mistral' | 'llama' | 'claude' | 'deepseek';

export interface TaskRequest {
  task: string;
  agent: AgentType;
  priority?: 'high' | 'medium' | 'low';
  fallback?: AgentType[];
}

export interface TaskResponse {
  report: string;
  agent: AgentType;
  latency: number;
  tokens: number;
  cached: boolean;
}

const AGENT_ENDPOINTS: Record<AgentType, string> = {
  perplexity: 'https://api.perplexity.ai/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  comet: '/api/agents/comet',
  mistral: 'https://api.mistral.ai/v1/chat/completions',
  llama: '/api/agents/llama',
  claude: 'https://api.anthropic.com/v1/messages',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
};

const FALLBACK_CHAIN: AgentType[] = ['perplexity', 'gemini', 'mistral', 'llama', 'claude', 'deepseek'];

async function callPerplexity(task: string): Promise<string> {
  const apiKey = process.env.PPLX_API_KEY;
  if (!apiKey) throw new Error('PPLX_API_KEY not set');
  
  const res = await fetch(AGENT_ENDPOINTS.perplexity, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{ role: 'user', content: task }],
      max_tokens: 2048,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response';
}

async function callGemini(task: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  
  const res = await fetch(`${AGENT_ENDPOINTS.gemini}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: task }] }],
    }),
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}

async function callAgent(agent: AgentType, task: string): Promise<string> {
  switch (agent) {
    case 'perplexity': return callPerplexity(task);
    case 'gemini': return callGemini(task);
    default: return `[${agent}] Agent not yet configured. Task: ${task}`;
  }
}

export async function dispatchTask(request: TaskRequest): Promise<TaskResponse> {
  const start = Date.now();
  const agents = [request.agent, ...(request.fallback || FALLBACK_CHAIN.filter(a => a !== request.agent))];
  
  for (const agent of agents) {
    try {
      const report = await callAgent(agent, request.task);
      return {
        report,
        agent,
        latency: Date.now() - start,
        tokens: Math.ceil(report.length / 4),
        cached: false,
      };
    } catch (err) {
      console.warn(`[Router] Agent ${agent} failed, trying fallback...`, err);
      continue;
    }
  }
  
  return {
    report: 'All agents failed. Please try again later.',
    agent: request.agent,
    latency: Date.now() - start,
    tokens: 0,
    cached: false,
  };
}

export async function orchestrateEcosystem(userTask: string): Promise<{ targetApp: string }> {
  const result = await dispatchTask({
    task: `Welche der 13 RealSync Apps ist am besten geeignet fuer: "${userTask}"? Apps: CreatorSeal, AdEngine, TrendRadar, ContentForge, RightsGuard, MediaVault, BrandKit, CollabHub, MonetizeMax, AnalyticsPro, ScheduleMaster, FanConnect, CertificateGen. Antworte nur mit dem App-Namen.`,
    agent: 'perplexity',
  });
  return { targetApp: result.report.trim() };
}
