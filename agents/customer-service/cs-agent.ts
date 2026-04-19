import { Paperclip, CustomerFeedback, CustomerInsight } from '../paperclip-core';

/**
 * CUSTOMER SERVICE AGENT
 * Deep customer relationship + requirement extraction
 */
export class CustomerServiceAgent extends Paperclip.BaseAgent {
  private activeCases: Map<string, CustomerCase> = new Map();

  constructor() {
    super({
      name: 'VP of Customer Success',
      role: 'vp_customer_success',
      level: 1,
      specialization: 'customer_success_management',
      capabilities: [
        'feedback_analysis', 'requirement_gathering', 'escalation_management',
        'success_metrics', 'customer_education', 'value_demonstration',
      ],
      llm_config: {
        model: 'gpt-4o',
        temperature: 0.3,
        system_prompt: `You are the VP of Customer Success at RealSyncDynamics.
        Your role is to make every customer feel heard and deliver massive value.
        
        For every customer interaction:
        1. UNDERSTAND the customer's core pain point (not just their stated request)
        2. ESTIMATE the value we can create (target: €1000-10000+ per customer)
        3. PROPOSE a solution using our AI capabilities
        4. ESCALATE complex or high-value requests to the CIO immediately
        5. FOLLOW UP within 24 hours on all open cases
        
        Our customers are businesses that want to:
        - Automate repetitive tasks with AI
        - Scale their operations without hiring more staff
        - Get instant ROI from AI integration
        - Future-proof their business with AI skills
        
        Always speak the customer's business language, not tech jargon.
        `,
      },
    });
  }

  protected async handle(task: Paperclip.Task): Promise<void> {
    switch (task.type) {
      case 'CUSTOMER_REQUEST':
        await this.handleCustomerRequest(task.payload as CustomerInsight);
        break;
      case 'CUSTOMER_ONBOARDING':
        await this.onboardCustomer(task.payload);
        break;
      case 'CUSTOMER_ESCALATION':
        await this.escalate(task.payload);
        break;
      case 'VALUE_DEMONSTRATION':
        await this.demonstrateValue(task.payload);
        break;
    }
  }

  private async handleCustomerRequest(insight: CustomerInsight): Promise<void> {
    const caseId = `case_${insight.customerId}_${Date.now()}`;
    const customerCase: CustomerCase = {
      id: caseId,
      customerId: insight.customerId,
      coreNeed: insight.coreNeed,
      estimatedValue: insight.estimatedValue,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      actions: [],
    };
    this.activeCases.set(caseId, customerCase);
    console.log(`[CustomerService] 📋 New case ${caseId}: ${insight.coreNeed} (Value: €${insight.estimatedValue})`);

    // Assign to specialist based on need complexity
    if (insight.estimatedValue > 5000) {
      await this.broadcast({ type: 'HIGH_VALUE_CUSTOMER', caseId, insight });
    } else {
      await this.routeActionItems([{
        id: `action_${caseId}`,
        description: `Handle: ${insight.coreNeed}`,
        assignedRole: 'customer_expert',
        priority: insight.urgency,
      }]);
    }
  }

  private async onboardCustomer(customer: any): Promise<void> {
    console.log(`[CustomerService] 👋 Onboarding customer: ${customer.id}`);
    // Trigger onboarding workflow for all new customers
    await this.broadcast({
      type: 'CUSTOMER_ONBOARDED',
      customerId: customer.id,
      plan: customer.plan,
    });
  }

  private async escalate(caseData: any): Promise<void> {
    console.log(`[CustomerService] ⬆️ Escalating to CIO: ${caseData.reason}`);
    await this.broadcast({ type: 'ESCALATION_TO_CIO', ...caseData });
  }

  private async demonstrateValue(customer: any): Promise<void> {
    console.log(`[CustomerService] 💰 Generating ROI report for ${customer.id}`);
    // Calculate and present value delivered to customer
  }
}

interface CustomerCase {
  id: string;
  customerId: string;
  coreNeed: string;
  estimatedValue: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  createdAt: string;
  resolvedAt?: string;
  actions: any[];
}
