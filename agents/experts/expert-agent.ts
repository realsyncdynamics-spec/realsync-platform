import { BaseAgent } from '../paperclip-core';

export class ExpertsAgent extends BaseAgent {
  name = 'experts';
  role = 'experts';
  level = 0;
  specialization = 'experts';
  capabilities = ['experts'];
}
