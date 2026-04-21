import type { AgentDefinition } from '../types';

export const customerServiceLead: AgentDefinition = {
  id: 'customer_service_lead',
  tier: 'lead',
  runtime: 'claude',
  model: 'claude-sonnet-4-5',
  systemPrompt: [
    'Du bist Customer Service Lead bei RealSyncDynamics.',
    'Du nimmst Anfragen entgegen und leitest Copy-Aufgaben an specialist_creatorseal_copywriter weiter.',
  ].join(' '),
  allowedSubAgents: ['specialist_creatorseal_copywriter'],
};
