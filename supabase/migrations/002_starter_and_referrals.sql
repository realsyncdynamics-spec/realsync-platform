-- 002_starter_and_referrals.sql
-- Adds the €9,90 / 3-month Starter plan, per-user referral codes, and the
-- lifecycle-send ledger. All tables live in the creatorseal schema (consistent
-- with migration 001 and the webhook handler).

set search_path to creatorseal, public;

-- 1. Ensure the Starter plan row exists. 'plans' table already exists from 001.
insert into creatorseal.plans (code, stripe_lookup_key, monthly_verification_limit, label, price_eur)
values ('starter', 'starter_9_90_3m', -1, 'Starter — 3 Monate alles drin', 9.90)
on conflict (code) do update
  set stripe_lookup_key = excluded.stripe_lookup_key,
      monthly_verification_limit = excluded.monthly_verification_limit,
      label = excluded.label,
      price_eur = excluded.price_eur;

-- 2. Extend profiles with starter-access metadata and referral codes.
alter table creatorseal.profiles
  add column if not exists starter_access_until timestamptz,
  add column if not exists referral_code        text,
  add column if not exists referred_by_code     text,
  add column if not exists referral_bonus_days  integer not null default 0;

-- Backfill referral_code for any existing row (short, URL-safe, 8 chars).
update creatorseal.profiles
set referral_code = substr(
    translate(encode(gen_random_bytes(8), 'base64'), '+/=', 'abc'),
    1, 8
  )
where referral_code is null;

alter table creatorseal.profiles
  alter column referral_code set not null,
  alter column referral_code set default substr(
    translate(encode(gen_random_bytes(8), 'base64'), '+/=', 'abc'),
    1, 8
  );

create unique index if not exists profiles_referral_code_key
  on creatorseal.profiles (referral_code);
create index if not exists profiles_starter_access_until_idx
  on creatorseal.profiles (starter_access_until);

-- 3. Referrals ledger — one row per paid referred signup.
create table if not exists creatorseal.referrals (
  id           uuid primary key default gen_random_uuid(),
  referrer_id  uuid not null references auth.users(id) on delete cascade,
  referred_id  uuid not null references auth.users(id) on delete cascade,
  paid_at      timestamptz,
  rewarded_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (referred_id)
);

create index if not exists referrals_referrer_id_idx
  on creatorseal.referrals (referrer_id);
create index if not exists referrals_rewarded_idx
  on creatorseal.referrals (referrer_id, rewarded_at);

-- 4. Lifecycle-send ledger — prevents duplicate D-30 / D-5 emails.
create table if not exists creatorseal.lifecycle_sends (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  stage     text not null check (stage in ('d_minus_30', 'd_minus_5', 'expired')),
  sent_at   timestamptz not null default now(),
  unique (user_id, stage)
);

create index if not exists lifecycle_sends_user_stage_idx
  on creatorseal.lifecycle_sends (user_id, stage);

-- 5. Row Level Security.
alter table creatorseal.profiles       enable row level security;
alter table creatorseal.subscriptions  enable row level security;
alter table creatorseal.referrals      enable row level security;
alter table creatorseal.lifecycle_sends enable row level security;

-- Owner-only read on profiles. Writes are service-role only (bypasses RLS).
drop policy if exists profiles_own_select on creatorseal.profiles;
create policy profiles_own_select on creatorseal.profiles
  for select using (auth.uid() = user_id);

drop policy if exists subscriptions_own_select on creatorseal.subscriptions;
create policy subscriptions_own_select on creatorseal.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists referrals_own_select on creatorseal.referrals;
create policy referrals_own_select on creatorseal.referrals
  for select using (auth.uid() = referrer_id or auth.uid() = referred_id);

drop policy if exists lifecycle_sends_own_select on creatorseal.lifecycle_sends;
create policy lifecycle_sends_own_select on creatorseal.lifecycle_sends
  for select using (auth.uid() = user_id);
