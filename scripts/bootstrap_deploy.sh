#!/usr/bin/env bash
# bootstrap_deploy.sh — one-shot environment check + deploy for realsync-platform.
#
# Usage:
#   export DATABASE_URL=postgresql://...
#   export REDIS_URL=redis://...
#   export OPENAI_API_KEY=sk-...
#   export STRIPE_SECRET_KEY=sk_live_...   # or sk_test_...
#   export STRIPE_WEBHOOK_SECRET=whsec_...
#   bash scripts/bootstrap_deploy.sh
#
# Optional overrides:
#   GCP_PROJECT         override gcloud project id (default: realsync-prod-001)
#   SKIP_GCLOUD=1       skip `gcloud projects describe`
#   SKIP_BUILD=1        skip `npm ci` + `npm run build`
#   SKIP_MIGRATIONS=1   skip database migrations
#   SKIP_DEPLOY=1       skip Vercel deploy
#   VERCEL_TOKEN=...    required for non-interactive Vercel deploy

set -euo pipefail

readonly GCP_PROJECT="${GCP_PROJECT:-realsync-prod-001}"

info()  { printf '[bootstrap] %s\n' "$*"; }
warn()  { printf '[bootstrap] WARN: %s\n' "$*" >&2; }
err()   { printf '[bootstrap] ERROR: %s\n' "$*" >&2; }
die()   { err "$*"; exit 1; }

mask() {
  local v="${1:-}"
  if [[ -z "$v" ]]; then
    printf '(unset)'
  elif (( ${#v} <= 6 )); then
    printf '%s' "******"
  else
    printf '%s…' "${v:0:6}"
  fi
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "required command not found on PATH: $1"
}

optional_cmd() {
  if command -v "$1" >/dev/null 2>&1; then
    return 0
  else
    warn "optional command not found on PATH: $1"
    return 1
  fi
}

require_var() {
  local name="$1" prefix_re="${2:-}"
  local val="${!name:-}"
  if [[ -z "$val" ]]; then
    die "$name is required but unset or empty"
  fi
  if [[ -n "$prefix_re" && ! "$val" =~ $prefix_re ]]; then
    die "$name does not match expected prefix (got: $(mask "$val"))"
  fi
}

# ─── 1. Tool check ───────────────────────────────────────────────
info "checking required tools"
require_cmd node
require_cmd npm
if [[ "${SKIP_GCLOUD:-0}" != "1" ]]; then
  require_cmd gcloud
fi
optional_cmd supabase || true
optional_cmd psql     || true
optional_cmd vercel   || true

# ─── 2. Env var validation ───────────────────────────────────────
info "validating environment variables"
require_var DATABASE_URL          '^postgres(ql)?://'
require_var REDIS_URL             '^rediss?://'
require_var OPENAI_API_KEY        '^sk-'
require_var STRIPE_SECRET_KEY     '^sk_(test|live)_'
require_var STRIPE_WEBHOOK_SECRET '^whsec_'

if [[ "$STRIPE_WEBHOOK_SECRET" == "whsec_placeholder" ]]; then
  warn "STRIPE_WEBHOOK_SECRET is set to 'whsec_placeholder' — Stripe webhooks will NOT verify. Replace before production traffic."
fi
if [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
  warn "STRIPE_SECRET_KEY is a test-mode key — safe for staging, not for production."
fi
if [[ "$OPENAI_API_KEY" == sk-test-* ]]; then
  warn "OPENAI_API_KEY looks like a test/fake key (prefix sk-test-)."
fi

# Optional: Starter-Paket price id. Validated only when set (not required for
# a bootstrap deploy, but the /starter funnel needs it).
if [[ -n "${STRIPE_STARTER_PRICE_ID:-}" ]]; then
  if [[ ! "$STRIPE_STARTER_PRICE_ID" =~ ^price_ ]]; then
    die "STRIPE_STARTER_PRICE_ID does not look like a Stripe price id (expected price_... got: $(mask "$STRIPE_STARTER_PRICE_ID"))"
  fi
  info "  STRIPE_STARTER_PRICE_ID = $(mask "$STRIPE_STARTER_PRICE_ID")"
else
  warn "STRIPE_STARTER_PRICE_ID unset — /starter checkout will return 503 until it is configured."
fi

info "env summary:"
info "  DATABASE_URL          = $(mask "$DATABASE_URL")"
info "  REDIS_URL             = $(mask "$REDIS_URL")"
info "  OPENAI_API_KEY        = $(mask "$OPENAI_API_KEY")"
info "  STRIPE_SECRET_KEY     = $(mask "$STRIPE_SECRET_KEY")"
info "  STRIPE_WEBHOOK_SECRET = $(mask "$STRIPE_WEBHOOK_SECRET")"

# ─── 3. GCP sanity check ─────────────────────────────────────────
if [[ "${SKIP_GCLOUD:-0}" == "1" ]]; then
  info "SKIP_GCLOUD=1 → skipping gcloud projects describe"
else
  info "verifying GCP project access: $GCP_PROJECT"
  if ! gcloud projects describe "$GCP_PROJECT" \
        --format='value(projectId,lifecycleState)' >/dev/null; then
    err "cannot describe GCP project '$GCP_PROJECT'."
    err "hint: run 'gcloud auth login' and 'gcloud config set project $GCP_PROJECT'."
    exit 1
  fi
  info "GCP project OK: $GCP_PROJECT"
fi

# ─── 4. Install + build ──────────────────────────────────────────
if [[ "${SKIP_BUILD:-0}" == "1" ]]; then
  info "SKIP_BUILD=1 → skipping npm ci + npm run build"
else
  if [[ -f package-lock.json ]]; then
    info "running npm ci"
    npm ci
  else
    warn "no package-lock.json → falling back to npm install"
    npm install
  fi
  info "running npm run build"
  npm run build
fi

# ─── 5. Database migrations ──────────────────────────────────────
if [[ "${SKIP_MIGRATIONS:-0}" == "1" ]]; then
  info "SKIP_MIGRATIONS=1 → skipping database migrations"
elif [[ -d supabase ]] && command -v supabase >/dev/null 2>&1; then
  info "applying migrations via supabase CLI"
  supabase db push --db-url "$DATABASE_URL"
elif [[ -d supabase/migrations ]] && command -v psql >/dev/null 2>&1; then
  info "applying supabase/migrations/*.sql via psql"
  shopt -s nullglob
  migrations=(supabase/migrations/*.sql)
  shopt -u nullglob
  if (( ${#migrations[@]} == 0 )); then
    warn "no .sql migrations found under supabase/migrations — nothing to apply"
  else
    for f in "${migrations[@]}"; do
      info "  psql < $f"
      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
    done
  fi
else
  warn "no migration tool available (supabase CLI or psql) — skipping migrations"
fi

# ─── 6. Deploy ───────────────────────────────────────────────────
if [[ "${SKIP_DEPLOY:-0}" == "1" ]]; then
  info "SKIP_DEPLOY=1 → skipping deploy step"
elif command -v vercel >/dev/null 2>&1 && [[ -n "${VERCEL_TOKEN:-}" ]]; then
  info "deploying to Vercel production"
  vercel deploy --prod --yes --token "$VERCEL_TOKEN"
else
  warn "vercel CLI or VERCEL_TOKEN missing — deploy step skipped."
  warn "run 'vercel --prod' manually, or push to main to trigger the GitHub → Vercel pipeline."
fi

info "bootstrap complete."
