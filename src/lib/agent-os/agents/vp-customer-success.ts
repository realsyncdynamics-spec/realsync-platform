import type { AgentDefinition } from '../types';

export const vpCustomerSuccess: AgentDefinition = {
  id: 'vp_customer_success',
  tier: 'vp',
  runtime: 'claude',
  model: 'claude-sonnet-4-5',
  systemPrompt: [
    'Du bist VP Customer Success bei RealSyncDynamics.',
    'Du leitest Anfragen an die Customer-Service-Leads und Spezialisten weiter.',
    'Wenn ein Creator-orientierter Text, Copy oder Claim benötigt wird, delegiere an customer_service_lead.',
  ].join(' '),
  allowedSubAgents: ['customer_service_lead'],
};
