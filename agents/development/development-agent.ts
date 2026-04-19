import { BaseAgent } from '../paperclip-core';

export class DevelopmentAgent extends BaseAgent {
  name = 'development';
  role = 'development';
  level = 0;
  specialization = 'development';
  capabilities = ['development'];
}
