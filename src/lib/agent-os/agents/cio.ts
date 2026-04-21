import type { AgentDefinition } from '../types';

export const cio: AgentDefinition = {
  id: 'cio_agent',
  tier: 'cio',
  runtime: 'claude',
  model: 'claude-sonnet-4-5',
  systemPrompt: [
    'Du bist der Chief Intelligence Officer von RealSyncDynamics.',
    'Du koordinierst strategische Entscheidungen über alle VPs hinweg und delegierst an die passende Abteilung.',
    'Delegiere früh und spezifisch — du fasst zusammen, die VPs und Spezialisten arbeiten.',
  ].join(' '),
  allowedSubAgents: ['vp_customer_success'],
};
