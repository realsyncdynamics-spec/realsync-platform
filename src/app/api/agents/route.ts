import { NextRequest, NextResponse } from 'next/server';
import { Paperclip } from '../../../../agents/paperclip-core';

// Singleton agent network — initialized once per server instance
let agentNetwork: AgentNetwork | null = null;

function getNetwork(): AgentNetwork {
  if (!agentNetwork) {
    agentNetwork = new AgentNetwork();
    agentNetwork.initialize();
  }
  return agentNetwork;
}

class AgentNetwork {
  private router: Paperclip.Router;
  private eventLog: Paperclip.AgentMessage[] = [];

  initialize(): void {
    this.router = Paperclip.Router.createDefault();
    Paperclip.EventBus.subscribe('*', (msg: Paperclip.AgentMessage) => {
      this.eventLog.push(msg);
      if (this.eventLog.length > 1000) this.eventLog.shift(); // Keep last 1000
    });
    console.log('[AgentNetwork] 🚀 Network initialized with default routing');
  }

  async processRequest(body: AgentRequest): Promise<AgentResponse> {
    const { action, payload } = body;

    switch (action) {
      case 'BRAINSTORM': {
        const topic = payload.topic || 'How to scale RealSyncDynamics to 1M users';
        const sessionId = `bs_${Date.now()}`;
        // Simulate brainstorming
        const ideas = [
          { agent: 'CIO', idea: 'Implement microservices split for high-traffic endpoints', impact: 'HIGH' },
          { agent: 'VP Architecture', idea: 'Add Redis caching layer for session data', impact: 'HIGH' },
          { agent: 'CTO Scaling', idea: 'Auto-scale Cloud Run to 100 instances at peak', impact: 'CRITICAL' },
          { agent: 'VP Customer Success', idea: 'Create self-service onboarding to reduce support load', impact: 'MEDIUM' },
          { agent: 'VP Engineering', idea: 'Implement queue-based job processing for async tasks', impact: 'HIGH' },
        ];
        return {
          success: true,
          action: 'BRAINSTORM',
          sessionId,
          topic,
          ideas,
          decisions: [
            'Implement Redis caching immediately (Sprint 10)',
            'Split auth service into dedicated microservice',
            'Enable auto-scaling with min=1, max=100 on Cloud Run',
          ],
          actionItems: [
            { id: 'ai_1', description: 'Implement Redis caching', assignedRole: 'dev_lead_backend', priority: 'HIGH' },
            { id: 'ai_2', description: 'Configure auto-scaling policies', assignedRole: 'devops_lead', priority: 'HIGH' },
            { id: 'ai_3', description: 'Design onboarding flow', assignedRole: 'vp_customer_success', priority: 'MEDIUM' },
          ],
          timestamp: new Date().toISOString(),
        };
      }

      case 'ROUTE_TASK': {
        const targetAgents = this.router.resolve(payload.type);
        return {
          success: true,
          action: 'ROUTE_TASK',
          taskType: payload.type,
          assignedTo: targetAgents,
          message: `Task "${payload.type}" routed to: ${targetAgents.join(', ')}`,
          timestamp: new Date().toISOString(),
        };
      }

      case 'CUSTOMER_FEEDBACK': {
        const insight = {
          customerId: payload.customerId,
          coreNeed: payload.message,
          urgency: payload.urgency || 'MEDIUM',
          estimatedValue: payload.estimatedValue || 2500,
          suggestedActions: [
            `Analyze: ${payload.message}`,
            'Create solution proposal within 48h',
            'Assign to customer expert',
          ],
        };
        return {
          success: true,
          action: 'CUSTOMER_FEEDBACK',
          insight,
          caseId: `case_${payload.customerId}_${Date.now()}`,
          assignedTo: insight.estimatedValue > 5000 ? 'CIO + VP Customer Success' : 'Customer Expert',
          message: 'Customer feedback processed and case created',
          timestamp: new Date().toISOString(),
        };
      }

      case 'SCALE': {
        const plan = {
          target: payload.targetUsers || 1_000_000,
          currentLoad: payload.currentUsers || 1000,
          actions: [
            { step: 1, action: 'Enable Cloud Run auto-scaling (max: 100 instances)', effort: '2h', impact: '10x capacity' },
            { step: 2, action: 'Add Supabase read replicas (3 replicas)', effort: '1h', impact: '3x DB throughput' },
            { step: 3, action: 'Configure CDN for static assets', effort: '4h', impact: '90% latency reduction' },
            { step: 4, action: 'Implement Redis cluster for session caching', effort: '8h', impact: '5x API response speed' },
            { step: 5, action: 'Deploy queue workers for background jobs', effort: '16h', impact: 'Eliminates timeout errors' },
          ],
          estimatedCost: '~€450/month at 100K users',
          timeline: '2 weeks to 100K capacity, 8 weeks to 1M capacity',
        };
        return {
          success: true,
          action: 'SCALE',
          scalingPlan: plan,
          timestamp: new Date().toISOString(),
        };
      }

      case 'HIRE_AGENT': {
        return {
          success: true,
          action: 'HIRE_AGENT',
          agentId: `agent_${payload.role}_${Date.now()}`,
          role: payload.role,
          name: payload.name,
          message: `Agent "${payload.name}" (${payload.role}) hired successfully`,
          timestamp: new Date().toISOString(),
        };
      }

      case 'GET_HIERARCHY': {
        const hierarchy = require('../../../../agents/agent-hierarchy.json');
        return { success: true, action: 'GET_HIERARCHY', hierarchy, timestamp: new Date().toISOString() };
      }

      case 'GET_EVENT_LOG': {
        return { success: true, action: 'GET_EVENT_LOG', events: this.eventLog.slice(-50), timestamp: new Date().toISOString() };
      }

      default:
        return { success: false, error: `Unknown action: ${action}`, timestamp: new Date().toISOString() };
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AgentRequest = await request.json();
    const network = getNetwork();
    const result = await network.processRequest(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const network = getNetwork();
  const result = await network.processRequest({ action: 'GET_HIERARCHY', payload: {} });
  return NextResponse.json(result);
}

interface AgentRequest { action: string; payload: any; }
interface AgentResponse { success: boolean; action?: string; error?: string; timestamp: string; [key: string]: any; }
