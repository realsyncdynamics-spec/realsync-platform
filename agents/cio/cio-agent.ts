import { Paperclip } from '../paperclip-core';
import hierarchy from '../agent-hierarchy.json';

/**
 * CIO AGENT — Chief Intelligence Officer
 * The top-level orchestrator for the entire RealSyncDynamics
 * AI Agent Network targeting 1,000,000 users.
 *
 * Responsibilities:
 * - Hire and assign specialized agents
 * - Run brainstorming sessions
 * - Route tasks to correct agents
 * - Scale to 1M+ users
 * - Maximize customer value (€1000s+ per customer)
 */
export class CIOAgent extends Paperclip.BaseAgent {
  private subordinates: Map<string, Paperclip.BaseAgent> = new Map();
  private brainstormSessions: BrainstormSession[] = [];
  private customerInsights: CustomerInsight[] = [];

  constructor() {
    super({
      name: 'CIO — Chief Intelligence Officer',
      role: 'executive',
      level: 0,
      capabilities: [
        'strategic_planning',
        'agent_management',
        'resource_allocation',
        'customer_strategy',
        'scaling_decisions',
        'brainstorming',
        'task_routing',
      ],
      llm_config: {
        model: 'gpt-4o',
        temperature: 0.2, // Precise strategic thinking
        system_prompt: `You are the CIO (Chief Intelligence Officer) of RealSyncDynamics.
        Your mission is to scale the platform to 1,000,000 users while maximizing customer value.
        You:
        1. HIRE the right specialized agents for every task
        2. BRAINSTORM with your VP team before every major decision
        3. ROUTE tasks to the correct specialist — never execute what others can do better
        4. SCALE every successful pattern immediately
        5. LISTEN to customers and turn their needs into features within 48 hours
        6. GENERATE €1000s+ of value per customer through AI automation
        Always think: "Will this scale to 1M users? Does this delight the customer?"
        `,
      },
    });
  }

  // ─── HIRING: CIO brings agents on board ───────────────────────────────────
  async hireAgent(role: AgentRole, config: AgentConfig): Promise<string> {
    const agentId = `${role}_${Date.now()}`;
    const agent = Paperclip.AgentFactory.create(role, config);
    this.subordinates.set(agentId, agent);
    await this.broadcast({
      type: 'AGENT_HIRED',
      agentId,
      role,
      message: `New ${role} agent hired. Welcome to the network.`,
    });
    console.log(`[CIO] ✅ Hired ${config.name} as ${role} (ID: ${agentId})`);
    return agentId;
  }

  // ─── BRAINSTORMING: Structured idea sessions ──────────────────────────────
  async runBrainstorm(topic: string, participants: string[]): Promise<BrainstormResult> {
    console.log(`[CIO] 🧠 Starting brainstorm: "${topic}"`);
    const session: BrainstormSession = {
      id: `bs_${Date.now()}`,
      topic,
      participants,
      ideas: [],
      decisions: [],
      actionItems: [],
      startedAt: new Date().toISOString(),
    };

    // Phase 1: Diverge — collect all ideas
    const ideas = await Promise.all(
      participants.map(async (agentId) => {
        const agent = this.subordinates.get(agentId);
        if (!agent) return null;
        return agent.propose({ context: topic, mode: 'brainstorm' });
      })
    );

    session.ideas = ideas.filter(Boolean);

    // Phase 2: Converge — synthesize and decide
    const synthesis = await this.synthesize(session.ideas);
    session.decisions = synthesis.decisions;
    session.actionItems = synthesis.actionItems;
    session.completedAt = new Date().toISOString();

    this.brainstormSessions.push(session);
    await this.routeActionItems(session.actionItems);

    console.log(`[CIO] ✅ Brainstorm complete: ${session.decisions.length} decisions, ${session.actionItems.length} action items`);
    return { session, synthesis };
  }

  // ─── ROUTING: Sends tasks to the right agent ──────────────────────────────
  async route(task: Task): Promise<void> {
    const assignment = await this.classifyTask(task);
    const targetAgent = this.findBestAgent(assignment.role, assignment.specialization);

    if (!targetAgent) {
      console.warn(`[CIO] ⚠️ No agent found for task: ${task.type}. Hiring specialist...`);
      await this.hireAgent(assignment.role, { name: assignment.suggestedName, ...assignment.config });
      return this.route(task); // Retry with new agent
    }

    console.log(`[CIO] 📨 Routing "${task.type}" → ${targetAgent.name}`);
    await targetAgent.receive(task);
  }

  // ─── SCALING: Scales patterns that work ───────────────────────────────────
  async scalePattern(pattern: SuccessPattern): Promise<void> {
    console.log(`[CIO] 📈 Scaling pattern: "${pattern.name}" (target: ${pattern.targetUsers} users)`);
    const scalingPlan = await this.generateScalingPlan(pattern);
    await this.route({ type: 'SCALING_TASK', payload: scalingPlan, priority: 'HIGH' });
  }

  // ─── CUSTOMER LOOP: Customer insights drive decisions ─────────────────────
  async processCustomerFeedback(feedback: CustomerFeedback): Promise<void> {
    console.log(`[CIO] 👤 Processing customer feedback from ${feedback.customerId}`);
    const insight: CustomerInsight = await this.analyzeCustomerNeed(feedback);
    this.customerInsights.push(insight);

    if (insight.urgency === 'HIGH' || insight.estimatedValue > 5000) {
      // High-value customer request goes straight to CIO for brainstorm
      await this.runBrainstorm(
        `Customer ${feedback.customerId}: ${insight.coreNeed}`,
        ['vp_customer_success', 'vp_engineering', 'cto_scaling']
      );
    } else {
      // Standard routing to customer success team
      await this.route({ type: 'CUSTOMER_REQUEST', payload: insight, priority: 'NORMAL' });
    }
  }

  // ─── INTERNAL HELPERS ─────────────────────────────────────────────────────
  private async classifyTask(task: Task): Promise<TaskAssignment> {
    // AI-powered task classification
    return Paperclip.LLM.classify(task, {
      roles: hierarchy.hierarchy,
      context: 'RealSyncDynamics agent network',
    });
  }

  private findBestAgent(role: string, specialization?: string) {
    for (const [, agent] of this.subordinates) {
      if (agent.role === role && (!specialization || agent.specialization === specialization)) {
        return agent;
      }
    }
    return null;
  }

  private async synthesize(ideas: any[]): Promise<{ decisions: string[]; actionItems: ActionItem[] }> {
    return Paperclip.LLM.synthesize(ideas, { maxDecisions: 5, actionable: true });
  }

  private async generateScalingPlan(pattern: SuccessPattern): Promise<ScalingPlan> {
    return Paperclip.LLM.plan(pattern, {
      target: 1_000_000,
      region: 'europe-west1',
      costOptimize: true,
    });
  }

  private async analyzeCustomerNeed(feedback: CustomerFeedback): Promise<CustomerInsight> {
    return Paperclip.LLM.analyze(feedback, {
      estimateValue: true,
      prioritize: true,
    });
  }
}
