-- ============================================================
-- REALSYNC DYNAMICS — MIGRATION 002
-- Apply after 001_initial_schema.sql
-- Run in Supabase SQL Editor
-- ============================================================

-- Add is_admin flag to profiles (used by middleware for admin route protection)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Add Stripe customer ID to profiles (avoids tenants table dependency)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Index for admin lookups
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON public.profiles(is_admin) WHERE is_admin = true;
