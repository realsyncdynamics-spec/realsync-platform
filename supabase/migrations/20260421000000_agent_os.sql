-- AgentOS schema: runs, events, tool-calls
-- Owner-read RLS via auth.uid(); service-role bypass used by the worker.

create extension if not exists "uuid-ossp";

create table if not exists public.agent_runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id text not null,
  input jsonb not null default '{}'::jsonb,
  status text not null default 'queued'
    check (status in ('queued','running','completed','failed','cancelled')),
  final_output jsonb,
  error jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists agent_runs_user_id_idx
  on public.agent_runs(user_id, created_at desc);

create table if not exists public.agent_events (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references public.agent_runs(id) on delete cascade,
  seq int not null,
  type text not null,
  agent_id text,
  parent_event_id uuid references public.agent_events(id) on delete set null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (run_id, seq)
);

create index if not exists agent_events_run_id_seq_idx
  on public.agent_events(run_id, seq);

create table if not exists public.agent_tool_calls (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references public.agent_runs(id) on delete cascade,
  event_id uuid references public.agent_events(id) on delete set null,
  tool_name text not null,
  input jsonb,
  output jsonb,
  duration_ms int,
  status text not null default 'pending'
    check (status in ('pending','completed','error')),
  created_at timestamptz not null default now()
);

create index if not exists agent_tool_calls_run_id_idx
  on public.agent_tool_calls(run_id, created_at desc);

-- RLS
alter table public.agent_runs enable row level security;
alter table public.agent_events enable row level security;
alter table public.agent_tool_calls enable row level security;

create policy "agent_runs: owner read" on public.agent_runs
  for select using (auth.uid() = user_id);
create policy "agent_runs: owner insert" on public.agent_runs
  for insert with check (auth.uid() = user_id);

create policy "agent_events: owner read" on public.agent_events
  for select using (
    exists (select 1 from public.agent_runs r
            where r.id = run_id and r.user_id = auth.uid())
  );

create policy "agent_tool_calls: owner read" on public.agent_tool_calls
  for select using (
    exists (select 1 from public.agent_runs r
            where r.id = run_id and r.user_id = auth.uid())
  );

-- Realtime: stream inserts on events + run status changes
alter publication supabase_realtime add table public.agent_events;
alter publication supabase_realtime add table public.agent_runs;
