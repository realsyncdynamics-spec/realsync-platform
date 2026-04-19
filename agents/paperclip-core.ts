/**
 * PAPERCLIP CORE - The Multi-Agent Orchestration Framework
 * for RealSyncDynamics
 */

export namespace Paperclip {

  // ─── BASE AGENT ──────────────────────────────────────────────────────────
  export abstract class BaseAgent {
    public name: string;
    public role: string;
    public level: number;
    public specialization?: string;
    public capabilities: string[];
    protected llm_config: LLMConfig;
    private messageQueue: Task[] = [];
    private listeners: Map<string, Function[]> = new Map();

    constructor(config: AgentConstructorConfig) {
      this.name = config.name;
      this.role = config.role;
      this.level = config.level;
      this.capabilities = config.capabilities || [];
      this.llm_config = config.llm_config;
      console.log(`[Paperclip] Agent initialized: ${this.name} (Level ${this.level})`);
    }

    // Receive and queue a task
    async receive(task: Task): Promise<void> {
      this.messageQueue.push(task);
      this.emit('task_received', task);
      await this.processNext();
    }

    // Process next queued task
    async processNext(): Promise<void> {
      if (this.messageQueue.length === 0) return;
      const task = this.messageQueue.shift()!;
      console.log(`[${this.name}] Processing: ${task.type}`);
      await this.handle(task);
    }

    // Override in subclasses
    protected abstract handle(task: Task): Promise<void>;

    // Propose an idea in brainstorming
    async propose(context: { context: string; mode: 'brainstorm' | 'plan' }): Promise<AgentProposal> {
      const prompt = `You are ${this.name}. Based on your expertise in ${this.role}:
      Topic: ${context.context}
      Provide 3 concrete ideas/recommendations. Format as JSON.`;
      return LLM.complete<AgentProposal>(prompt, this.llm_config);
    }

    // Route action items to subordinates
    protected async routeActionItems(items: ActionItem[]): Promise<void> {
      for (const item of items) {
        console.log(`[${this.name}] Routing action: ${item.description} -> ${item.assignedRole}`);
        this.emit('action_routed', item);
      }
    }

    // Broadcast a message to all listeners
    protected async broadcast(message: AgentMessage): Promise<void> {
      EventBus.publish(message);
    }

    // Event system
    protected emit(event: string, data: any): void {
      const handlers = this.listeners.get(event) || [];
      handlers.forEach(h => h(data));
    }

    on(event: string, handler: Function): void {
      if (!this.listeners.has(event)) this.listeners.set(event, []);
      this.listeners.get(event)!.push(handler);
    }
  }

  // ─── LLM INTERFACE ───────────────────────────────────────────────────────
  export namespace LLM {
    export async function complete<T>(prompt: string, config: LLMConfig): Promise<T> {
      // Real implementation: calls OpenAI/Anthropic/Gemini
      // Uses the configured model (e.g. gpt-4o, claude-3-5-sonnet)
      const response = await fetch('/api/agents/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...config }),
      });
      return response.json();
    }

    export async function classify(task: Task, context: any): Promise<TaskAssignment> {
      const prompt = `Classify this task and assign to the best agent role:
      Task: ${JSON.stringify(task)}
      Available roles: ${JSON.stringify(Object.keys(context.roles))}
      Return JSON: { role, specialization, suggestedName, config }`;
      return complete<TaskAssignment>(prompt, { model: 'gpt-4o-mini', temperature: 0 });
    }

    export async function synthesize(ideas: any[], options: any): Promise<any> {
      const prompt = `Synthesize these brainstorming ideas into decisions and action items:
      Ideas: ${JSON.stringify(ideas)}
      Return max ${options.maxDecisions} decisions and actionable items as JSON.`;
      return complete(prompt, { model: 'gpt-4o', temperature: 0.1 });
    }

    export async function plan(pattern: any, options: any): Promise<any> {
      const prompt = `Create a scaling plan:
      Pattern: ${JSON.stringify(pattern)}
      Target: ${options.target} users, Region: ${options.region}
      Return JSON scaling plan with infrastructure and cost estimates.`;
      return complete(prompt, { model: 'gpt-4o', temperature: 0.1 });
    }

    export async function analyze(feedback: any, options: any): Promise<any> {
      const prompt = `Analyze this customer feedback for insights:
      Feedback: ${JSON.stringify(feedback)}
      Estimate business value and urgency. Return JSON CustomerInsight.`;
      return complete(prompt, { model: 'gpt-4o', temperature: 0.2 });
    }
  }

  // ─── AGENT FACTORY ───────────────────────────────────────────────────────
  export namespace AgentFactory {
    export function create(role: AgentRole, config: AgentConfig): BaseAgent {
      const agents: Record<string, any> = {
        'architecture': () => import('./architecture/architecture-agent'),
        'customer-service': () => import('./customer-service/cs-agent'),
        'development': () => import('./development/dev-agent'),
        'deployment': () => import('./deployment/deploy-agent'),
        'testing': () => import('./testing/testing-agent'),
        'scaling': () => import('./scaling/scaling-agent'),
        'expert': () => import('./experts/expert-agent'),
      };
      // Dynamic instantiation based on role
      // In production: lazy-load the agent class
      console.log(`[Factory] Creating agent of type: ${role}`);
      return { ...config, role, handle: async (task: Task) => console.log(`Handling: ${task.type}`) } as any;
    }
  }

  // ─── EVENT BUS ───────────────────────────────────────────────────────────
  export namespace EventBus {
    const subscribers: Map<string, Function[]> = new Map();
    const eventLog: AgentMessage[] = [];

    export function publish(message: AgentMessage): void {
      eventLog.push({ ...message, timestamp: new Date().toISOString() });
      const handlers = subscribers.get(message.type) || [];
      handlers.forEach(h => h(message));
      // Also notify wildcard subscribers
      (subscribers.get('*') || []).forEach(h => h(message));
    }

    export function subscribe(eventType: string, handler: Function): void {
      if (!subscribers.has(eventType)) subscribers.set(eventType, []);
      subscribers.get(eventType)!.push(handler);
    }

    export function getLog(): AgentMessage[] { return [...eventLog]; }
  }

  // ─── ROUTER ──────────────────────────────────────────────────────────────
  export class Router {
    private routes: Map<string, string[]> = new Map();

    // Define routing rules
    addRoute(taskType: string, agentRoles: string[]): void {
      this.routes.set(taskType, agentRoles);
    }

    // Get target agents for a task type
    resolve(taskType: string): string[] {
      return this.routes.get(taskType) || this.routes.get('*') || [];
    }

    // Initialize default routes
    static createDefault(): Router {
      const r = new Router();
      r.addRoute('ARCHITECTURE_DECISION', ['vp_architecture', 'senior_architect']);
      r.addRoute('CUSTOMER_REQUEST', ['vp_customer_success', 'customer_service_lead']);
      r.addRoute('DEVELOPMENT_TASK', ['vp_engineering', 'dev_lead_backend']);
      r.addRoute('DEPLOYMENT', ['vp_deployment', 'devops_lead']);
      r.addRoute('SCALING_TASK', ['cto_scaling', 'scaling_engineer']);
      r.addRoute('TESTING', ['dev_lead_backend', 'testing_specialist']);
      r.addRoute('BUG_REPORT', ['dev_lead_backend', 'sre_specialist']);
      r.addRoute('SECURITY_ISSUE', ['security_specialist', 'cto_scaling']);
      r.addRoute('BRAINSTORM', ['cio_agent', 'vp_architecture', 'vp_customer_success']);
      return r;
    }
  }

  // ─── TYPES ───────────────────────────────────────────────────────────────
  export interface LLMConfig {
    model: string;
    temperature?: number;
    system_prompt?: string;
  }

  export interface AgentConstructorConfig {
    name: string;
    role: string;
    level: number;
    specialization?: string;
    capabilities?: string[];
    llm_config: LLMConfig;
  }

  export type AgentRole =
    | 'executive' | 'vp_architecture' | 'vp_customer_success'
    | 'vp_engineering' | 'vp_deployment' | 'cto_scaling'
    | 'architecture' | 'customer-service' | 'development'
    | 'deployment' | 'testing' | 'scaling' | 'expert';

  export interface AgentConfig { name: string; [key: string]: any; }

  export interface Task {
    type: string;
    payload?: any;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
    customerId?: string;
    sessionId?: string;
  }

  export interface ActionItem {
    id: string;
    description: string;
    assignedRole: string;
    priority: string;
    deadline?: string;
    estimatedHours?: number;
  }

  export interface AgentMessage {
    type: string;
    agentId?: string;
    role?: string;
    message?: string;
    timestamp?: string;
    [key: string]: any;
  }

  export interface AgentProposal {
    agentName: string;
    ideas: string[];
    recommendation: string;
  }

  export interface TaskAssignment {
    role: string;
    specialization?: string;
    suggestedName: string;
    config: AgentConfig;
  }
}

// Shared type exports
export interface BrainstormSession {
  id: string;
  topic: string;
  participants: string[];
  ideas: any[];
  decisions: string[];
  actionItems: Paperclip.ActionItem[];
  startedAt: string;
  completedAt?: string;
}

export interface BrainstormResult {
  session: BrainstormSession;
  synthesis: any;
}

export interface CustomerFeedback {
  customerId: string;
  message: string;
  channel: 'email' | 'chat' | 'ticket' | 'survey';
  timestamp: string;
  metadata?: any;
}

export interface CustomerInsight {
  customerId: string;
  coreNeed: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedValue: number;
  suggestedActions: string[];
}

export interface SuccessPattern {
  name: string;
  description: string;
  targetUsers: number;
  currentUsers?: number;
  metrics?: any;
}

export interface ScalingPlan {
  pattern: SuccessPattern;
  infrastructure: any;
  timeline: string;
  estimatedCost: number;
  milestones: string[];
}
