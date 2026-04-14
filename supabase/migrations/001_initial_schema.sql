-- ============================================================
-- REALSYNC DYNAMICS — COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- ── PROFILES ─────────────────────────────────────────────
-- Extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  creator_code    TEXT UNIQUE,              -- RS-2026-XXXXXX
  niche           TEXT,
  bio             TEXT,
  website         TEXT,

  -- Plan
  plan_id         TEXT NOT NULL DEFAULT 'gratis'
                  CHECK (plan_id IN ('gratis','bronze','silber','gold','platin','diamant')),
  plan_expires_at TIMESTAMPTZ,
  plan_source     TEXT DEFAULT 'direct',   -- 'direct' | 'referral' | 'coins'

  -- Coins
  coin_balance    INTEGER NOT NULL DEFAULT 0,
  coins_earned    INTEGER NOT NULL DEFAULT 0,
  coins_spent     INTEGER NOT NULL DEFAULT 0,

  -- Trust
  trust_score     NUMERIC(5,2) DEFAULT 0,
  verify_level    INTEGER DEFAULT 1,

  -- Referral
  referral_code   TEXT UNIQUE,             -- for /join/[code]
  referred_by     UUID REFERENCES public.profiles(id),

  -- Admin
  is_admin        BOOLEAN NOT NULL DEFAULT false,

  -- Stripe
  stripe_customer_id TEXT,

  -- Meta
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate creator_code and referral_code on insert
CREATE OR REPLACE FUNCTION public.generate_creator_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.creator_code IS NULL THEN
    NEW.creator_code := 'RS-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
      UPPER(SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 6));
  END IF;
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := LOWER(SPLIT_PART(NEW.full_name, ' ', 1)) || '-' ||
      LOWER(SUBSTRING(MD5(NEW.id::TEXT || 'ref') FROM 1 FOR 4));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_creator_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_creator_code();

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate username from email
  base_username := LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9]', '_', 'g'));

  -- Ensure unique
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── SOCIAL ACCOUNTS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform     TEXT NOT NULL
               CHECK (platform IN ('youtube','tiktok','instagram','facebook','x','google')),
  platform_id  TEXT NOT NULL,              -- external platform user ID
  username     TEXT,
  display_name TEXT,
  avatar_url   TEXT,
  followers    INTEGER DEFAULT 0,
  access_token TEXT,                       -- encrypted in prod
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- ── COIN TRANSACTIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('earn','spend','bonus','referral','refund')),
  amount      INTEGER NOT NULL,            -- positive=earn, negative=spend
  description TEXT NOT NULL,
  ref_user_id UUID REFERENCES public.profiles(id),  -- who triggered this
  ref_plan_id TEXT,                        -- which plan was purchased
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update coin_balance on transaction
CREATE OR REPLACE FUNCTION public.update_coin_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    coin_balance = coin_balance + NEW.amount,
    coins_earned = CASE WHEN NEW.amount > 0 THEN coins_earned + NEW.amount ELSE coins_earned END,
    coins_spent  = CASE WHEN NEW.amount < 0 THEN coins_spent  + ABS(NEW.amount) ELSE coins_spent  END,
    updated_at   = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_coin_transaction
  AFTER INSERT ON public.coin_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_coin_balance();

-- ── REFERRALS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id     UUID NOT NULL REFERENCES public.profiles(id),
  referred_id     UUID NOT NULL REFERENCES public.profiles(id),
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','converted','rewarded')),
  converted_plan  TEXT,                    -- which plan they purchased
  coin_reward     INTEGER DEFAULT 0,       -- coins given to referrer
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  converted_at    TIMESTAMPTZ,
  UNIQUE(referred_id)                      -- one referral per user
);

-- ── PLAN SUBSCRIPTIONS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id              TEXT NOT NULL,
  status               TEXT DEFAULT 'active' CHECK (status IN ('active','cancelled','expired','trial')),
  billing_cycle        TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','yearly','coins')),
  stripe_sub_id        TEXT UNIQUE,
  stripe_customer_id   TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONTENT VERIFICATIONS (CreatorSeal) ──────────────────
CREATE TABLE IF NOT EXISTS public.verifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('image','video','audio','document','post')),
  filename     TEXT,
  file_hash    TEXT NOT NULL,              -- SHA-256
  c2pa_data    JSONB DEFAULT '{}',
  blockchain_tx TEXT,                      -- Polygon tx hash
  deepfake_score NUMERIC(5,4),             -- 0.0000 - 1.0000
  trust_score  NUMERIC(5,2),
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','verified','failed','expired')),
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── REVIEWS (ReviewRadar) ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform     TEXT NOT NULL,
  external_id  TEXT,
  author_name  TEXT,
  rating       INTEGER CHECK (rating BETWEEN 1 AND 5),
  text         TEXT,
  ai_reply     TEXT,
  replied_at   TIMESTAMPTZ,
  sentiment    TEXT CHECK (sentiment IN ('positive','neutral','negative')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, external_id)
);

-- ── WAITLIST (WaitlistKit) ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID NOT NULL,
  email        TEXT NOT NULL,
  name         TEXT,
  referral_code TEXT,
  referred_by  TEXT,
  rank         INTEGER,
  refs_count   INTEGER DEFAULT 0,
  reward       TEXT,
  source       TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, email)
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries  ENABLE ROW LEVEL SECURITY;

-- Profiles: read own, read others' public info
CREATE POLICY "Public profiles visible" ON public.profiles
  FOR SELECT USING (TRUE);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- All other tables: own data only
CREATE POLICY "Own social accounts" ON public.social_accounts
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own coin transactions" ON public.coin_transactions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own verifications" ON public.verifications
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own reviews" ON public.reviews
  FOR ALL USING (auth.uid() = user_id);

-- Referrals: see own referrals (as referrer or referred)
CREATE POLICY "Own referrals" ON public.referrals
  FOR ALL USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- ── INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_creator_code  ON public.profiles(creator_code);
CREATE INDEX IF NOT EXISTS idx_profiles_username      ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_coin_tx_user           ON public.coin_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer     ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_social_user            ON public.social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user           ON public.reviews(user_id, created_at DESC);

-- ── HELPER FUNCTIONS ─────────────────────────────────────

-- Get user by referral code (for /join/[code] page)
CREATE OR REPLACE FUNCTION public.get_creator_by_ref(ref_code TEXT)
RETURNS TABLE (
  id UUID, username TEXT, full_name TEXT, avatar_url TEXT,
  plan_id TEXT, creator_code TEXT, trust_score NUMERIC
) AS $$
  SELECT p.id, p.username, p.full_name, p.avatar_url,
         p.plan_id, p.creator_code, p.trust_score
  FROM public.profiles p
  WHERE p.referral_code = ref_code OR p.creator_code = ref_code
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Award coins to referrer when referred user purchases
CREATE OR REPLACE FUNCTION public.award_referral_coins(
  p_referred_id UUID,
  p_plan_id TEXT,
  p_plan_price_cents INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_referrer_id UUID;
  v_coins INTEGER;
BEGIN
  SELECT referrer_id INTO v_referrer_id
  FROM public.referrals
  WHERE referred_id = p_referred_id AND status = 'pending';

  IF v_referrer_id IS NOT NULL THEN
    -- 50% of plan price as coins (price in cents / 2 / 100 * 100coins per euro)
    v_coins := p_plan_price_cents / 2;

    INSERT INTO public.coin_transactions (user_id, type, amount, description, ref_user_id, ref_plan_id)
    VALUES (v_referrer_id, 'referral', v_coins,
            'Referral-Bonus: ' || p_plan_id || ' Plan', p_referred_id, p_plan_id);

    UPDATE public.referrals
    SET status = 'rewarded', coin_reward = v_coins, converted_plan = p_plan_id, converted_at = NOW()
    WHERE referred_id = p_referred_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── CORRECTION: B2B COIN WORKFLOW ────────────────────────
-- Creator teilt QR/Link → Jemand kauft → Creator bekommt 50%
-- 
-- Workflow:
-- 1. Creator hat referral_code (z.B. "rs-dominik")
-- 2. Jemand scannt QR → /join/rs-dominik → registriert sich
-- 3. Neue Person kauft Paket (z.B. Bronze €19 = 1900 Cents)
-- 4. award_referral_coins() wird aufgerufen
-- 5. Creator (referrer) bekommt 50% = 950 Coins = €9,50
-- 6. Creator löst Coins im RealSync Store ein
--
-- 100 Coins = €1 | Coins verfallen nie | Sofort gutgeschrieben
--
-- Store-Artikel (Coming Soon):
-- - Pakete upgraden (Bronze=1900, Silber=4900, Gold=9900 Coins)
-- - Creator Merch (ab 2500 Coins)
-- - Exklusive Kurse (ab 5000 Coins)
-- - Setup Service 1:1 (10000 Coins)
-- - Polygon NFT Badge (25000 Coins)
-- - Priority Feature Request (50000 Coins)

-- Re-create function with correct comment
CREATE OR REPLACE FUNCTION public.award_referral_coins(
  p_referred_id UUID,      -- Die Person die gekauft hat
  p_plan_id TEXT,          -- Welches Paket gekauft wurde
  p_plan_price_cents INTEGER  -- Preis in Cents (z.B. 1900 für Bronze)
)
RETURNS VOID AS $$
DECLARE
  v_referrer_id UUID;
  v_coins INTEGER;
  v_referrer_username TEXT;
BEGIN
  -- Wer hat diese Person eingeladen?
  SELECT r.referrer_id, p.username 
  INTO v_referrer_id, v_referrer_username
  FROM public.referrals r
  JOIN public.profiles p ON p.id = r.referrer_id
  WHERE r.referred_id = p_referred_id 
    AND r.status IN ('pending', 'converted')
  LIMIT 1;

  IF v_referrer_id IS NOT NULL THEN
    -- 50% des Paketpreises als Coins (Cents / 2 = Coins, da 100 Coins = €1)
    -- Beispiel: Bronze €19 = 1900 Cents → 950 Coins = €9,50 für Creator
    v_coins := p_plan_price_cents / 2;

    -- Coins dem Creator gutschreiben
    INSERT INTO public.coin_transactions (
      user_id, type, amount, description, ref_user_id, ref_plan_id, metadata
    ) VALUES (
      v_referrer_id,
      'referral',
      v_coins,
      'B2B Referral: ' || p_plan_id || ' Plan gekauft',
      p_referred_id,
      p_plan_id,
      jsonb_build_object(
        'plan_price_cents', p_plan_price_cents,
        'commission_pct', 50,
        'source', 'qr_referral'
      )
    );

    -- Referral als vergütet markieren
    UPDATE public.referrals
    SET 
      status = 'rewarded',
      coin_reward = v_coins,
      converted_plan = p_plan_id,
      converted_at = NOW()
    WHERE referred_id = p_referred_id;

    RAISE NOTICE 'Coins vergeben: % Coins an % für % Plan', v_coins, v_referrer_username, p_plan_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── OPTIMUS SPACES ────────────────────────────────────────────
-- Perplexity Spaces Konzept: Persistente Creator Research-Workspaces
CREATE TABLE IF NOT EXISTS public.optimus_spaces (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  context      TEXT,
  app          TEXT,
  icon         TEXT DEFAULT '🗂',
  color        TEXT DEFAULT '#00D4FF',
  messages     JSONB DEFAULT '[]'::jsonb,
  citations    JSONB DEFAULT '[]'::jsonb,
  total_coins  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.optimus_spaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own spaces" ON public.optimus_spaces FOR ALL USING (auth.uid() = user_id);
