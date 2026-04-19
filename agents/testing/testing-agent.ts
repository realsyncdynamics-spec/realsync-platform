import { BaseAgent } from '../paperclip-core';

export class TestingAgent extends BaseAgent {
  name = 'testing';
  role = 'tester';
  level = 0;
  specialization = 'testing';
  capabilities = ['test'];
}
