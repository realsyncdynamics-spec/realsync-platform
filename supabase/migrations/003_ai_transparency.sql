-- ═══════════════════════════════════════════════════════════════
--  EU AI ACT TRANSPARENCY LAYER — Art. 50 + Art. 12
--
--  ai_interactions logs every server-side AI call routed through
--  /api/optimus (OPTIMUS + ReviewRadar).
--
--  Purpose:
--   - Art. 50: evidence that the user was informed and acknowledged
--     (disclosure_acknowledged column).
--   - Art. 12: technical record-keeping (provider, model, tokens,
--     latency, status) with ≥ 6 month retention.
--   - DSGVO Art. 15: users can read their own interaction history
--     via the select-policy below.
--
--  Writes: service role only (src/lib/ai/audit.ts).
--  Raw IPs are NEVER stored — only sha256(AI_AUDIT_IP_SALT + ip).
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature                  TEXT NOT NULL CHECK (feature IN ('optimus', 'reviewradar')),
  provider                 TEXT NOT NULL,
  model                    TEXT NOT NULL,
  request_preview          TEXT,
  response_preview         TEXT,
  tokens_in                INTEGER,
  tokens_out               INTEGER,
  coin_cost                INTEGER,
  latency_ms               INTEGER,
  status                   TEXT NOT NULL CHECK (status IN ('success', 'error', 'blocked')),
  error_message            TEXT,
  ip_hash                  TEXT,
  user_agent               TEXT,
  disclosure_acknowledged  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_created
  ON public.ai_interactions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_feature_created
  ON public.ai_interactions (feature, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_created
  ON public.ai_interactions (created_at);

ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- DSGVO Art. 15: users may read their own AI-interaction records.
CREATE POLICY "Users read own ai_interactions"
  ON public.ai_interactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for anon/authenticated roles.
-- Writes go through the service role, which bypasses RLS.

COMMENT ON TABLE public.ai_interactions IS
  'EU AI Act Art. 12 technical record-keeping for AI interactions. '
  'Retention >= 6 months; scheduled deletion after 12 months. '
  'Writes only via service role (src/lib/ai/audit.ts).';
