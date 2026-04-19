-- Agent Tables Migration
-- Creates tables for Paperclip Agent System

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'cio', 'scaling', 'customer', 'development', 'deployment', 'testing', 'expert'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'idle', 'offline'
  description TEXT,
  tasks_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Tasks table
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  assigned_by UUID, -- agent_id who assigned this task
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  level TEXT DEFAULT 'info', -- 'debug', 'info', 'warning', 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Communication table (for brainstorming sessions)
CREATE TABLE IF NOT EXISTS agent_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  from_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  to_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'info', -- 'info', 'question', 'decision', 'task_assignment'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_logs_agent_id ON agent_logs(agent_id);
CREATE INDEX idx_agent_logs_created_at ON agent_logs(created_at DESC);
CREATE INDEX idx_agent_communications_session ON agent_communications(session_id);

-- Insert default agents
INSERT INTO agents (name, type, description) VALUES
  ('CIO Agent', 'cio', 'Strategic decision-making and resource allocation'),
  ('Scaling Agent', 'scaling', 'Infrastructure scaling from 10K to 1M users'),
  ('Customer Agent', 'customer', 'Customer service and support automation'),
  ('Development Agent', 'development', 'Feature implementation and code development'),
  ('Deployment Agent', 'deployment', 'CI/CD and production management'),
  ('Testing Agent', 'testing', 'Quality assurance and automated testing'),
  ('Expert Agent', 'expert', 'Specialized domain knowledge and consulting')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_communications ENABLE ROW LEVEL SECURITY;

-- Create policies (allow authenticated users to read)
CREATE POLICY "Allow authenticated users to read agents"
  ON agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read tasks"
  ON agent_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read logs"
  ON agent_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read communications"
  ON agent_communications FOR SELECT
  TO authenticated
  USING (true);
