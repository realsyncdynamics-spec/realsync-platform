-- Initial schema migration for RealSyncDynamics platform

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- profiles.id mirrors auth.users.id (set by Supabase Auth trigger), so no default is needed
create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  full_name text,
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now()
);
