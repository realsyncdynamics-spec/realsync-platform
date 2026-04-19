import { BaseAgent } from '../paperclip-core';

export class DeploymentAgent extends BaseAgent {
  name = 'deployment';
  role = 'deployment';
  level = 0;
  specialization = 'deployment';
  capabilities = ['deployment'];
}
