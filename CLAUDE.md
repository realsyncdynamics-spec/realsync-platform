# CLAUDE.md — RealSync Dynamics Platform

## Project
RealSync Dynamics is a creator SaaS platform for the DACH market.
Core product: CreatorSeal — content verification, trust scoring, C2PA 2.3, and monetization tools.
Target: Content creators, influencers, and small businesses in Germany, Austria, Switzerland.

## Actual tech stack (as of April 2026)
- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend/Auth:** Supabase (Auth + Postgres + Storage) — NOT Firebase
- **Payments:** Stripe subscriptions (Bronze/Silber/Gold/Platin/Diamant tiers)
- **AI:** Perplexity API (OPTIMUS agent)
- **Deployment:** Vercel
- **Verification:** C2PA 2.3, Ed25519, SHA-256, Polygon blockchain stamps

## Repo structure (single Next.js app — not a monorepo)
```
src/
  app/                    # Next.js App Router pages
    api/                  # API routes (auth, stripe, supabase calls)
    dashboard/            # Authenticated dashboard views
    apps/[app]/dashboard/ # Per-app dashboards
    hub/                  # Main authenticated home page
    [legal]/              # impressum/, datenschutz/, agb/
  components/             # Shared React components
  lib/
    supabase/             # Supabase client (browser + server)
    plans.ts              # Plan definitions (source of truth for pricing)
    stripe.ts             # Stripe helpers
```

## App / feature status
| Feature | Status |
|---------|--------|
| CreatorSeal trust score | Demo data — real C2PA integration pending |
| ReviewRadar KI answers | Beta — Perplexity API required |
| ChurnRescue | Beta — Stripe webhook must be live |
| WaitlistKit | Beta |
| OPTIMUS AI agent | Beta — PERPLEXITY_API_KEY required |
| DealFlow | Coming Soon |
| Auth (email + OAuth) | Real — Supabase credentials required |
| Stripe checkout | Real — Stripe keys + price IDs required |
| Legal pages | Drafted — require legal review before launch |

## Required environment variables
All documented in `.env.example`. Key ones:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
- `STRIPE_BRONZE_PRICE_ID` (+ SILBER, GOLD, PLATIN, DIAMANT — monthly + yearly)
- `NEXT_PUBLIC_APP_URL`
- `PERPLEXITY_API_KEY`

## Working rules
- **Language:** Code and comments in English; UI copy in German; commit messages in English
- **Communicate with the developer:** German is fine
- **Build must pass** after every meaningful change — run `npm run build` to verify
- **No fake production claims** — label demo data clearly, use "Beta" / "Coming Soon" honestly
- **No secrets in code** — use `.env.local` locally, set in Vercel dashboard for production
- **Prefer finishing blockers** over adding new features
- **Mobile first** — test layouts at 375px width

## Priorities (Q2 2026)
1. Complete Supabase setup and wire real auth/user data into hub and dashboards
2. Activate Stripe with real price IDs — test end-to-end checkout flow
3. Stabilize CreatorSeal with real C2PA/verification pipeline
4. Complete legal pages (lawyer review of Impressum, Datenschutz, AGB)
5. SEO and Google indexing for realsyncdynamics.de
6. Onboard first real users

## After each major task, report
- What changed (file list)
- What still depends on missing credentials / backend
- Build result (`npm run build`)
- Lint result (`npm run lint`)
