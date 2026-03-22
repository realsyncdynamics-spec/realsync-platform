# 🚀 RealSync Dynamics — The Creator OS

> Multi-Tenant SaaS-Plattform für Creator im DACH-Markt · 16 Apps · 1 Plattform · KI-gestützt

**Live:** [realsynccreator.realsyncdynamics.de](https://realsynccreator.realsyncdynamics.de) · [realsyncdynamics.de](https://realsyncdynamics.de)

---

## Was ist RealSync Dynamics?

RealSync Dynamics ist das erste **Creator OS für den DACH-Markt** — eine vollständige SaaS-Plattform, die 16 KI-gestützte Tools in einem einzigen Ökosystem vereint.

**Kernproblem:** Creator verlieren täglich Geld durch unbeantworte Reviews, failed Payments, fehlende Brand Deals und unkontrollierten Content.

**Lösung:** Trust-Score, KI-Automatisierung und Revenue-Optimierung — in einer Plattform, ab €0,00/Monat.

---

## ✨ Kernfeatures

- 🛡 **CreatorSeal** — Trust-Score (C2PA 2.3 + Deepfake-Detection + Blockchain) + 7-Tage-Promo-Plan
- ⭐ **ReviewRadar** — KI-Antworten auf Google, Trustpilot, App Store, Yelp in unter 3 Minuten
- 💳 **ChurnRescue** — 72% Failed Payments automatisch gerettet (Smart Retry + KI-E-Mail + SMS)
- 🎯 **DealFlow** — Brand-Matching via OPTIMUS KI-Agent
- 🚀 **WaitlistKit** — Viral Launch Builder (3,2x Multiplikator)
- ✍️ **ContentForge** — KI-Content in 6 Formaten in 30 Sekunden
- 🤖 **OPTIMUS** — KI-Agent powered by Perplexity AI (sonar, sonar-pro, sonar-deep-research)
- 📡 **TrendRadar**, 📊 **AnalyticsPro**, 📺 **AdEngine** + 7 weitere Apps
- 🪙 **RealSyncCoins** — Gamification-Ökosystem (100 Coins = €1,00)

---

## 🔥 Tech Stack

| Layer | Technologie |
|-------|-------------|
| Framework | Next.js 15 (App Router, React Server Components) |
| Sprache | TypeScript |
| Auth + DB | Supabase (PostgreSQL, Row Level Security, Realtime) |
| Payments | Stripe (Subscriptions, Webhooks, Recovery) |
| KI-Agent | Perplexity Sonar API (sonar · sonar-pro · sonar-deep-research) |
| Content-Verifikation | C2PA 2.3, Ed25519, SHA-256 Hash-Chains |
| Blockchain | Polygon (Zeitstempel-Anchoring, NFT-Badges) |
| Hosting | Vercel (Edge Network, CI/CD via GitHub) |
| DNS/Security | Cloudflare |

---

## 🚀 Lokaler Start (< 2 Minuten)

**Voraussetzungen:** Node.js 20+, pnpm

```bash
# 1. Repo klonen
git clone https://github.com/realsyncdynamics-spec/realsync-platform.git
cd realsync-platform

# 2. Dependencies installieren
pnpm install

# 3. Environment Variables
cp .env.example .env.local
# → .env.local mit eigenen Keys befüllen (siehe unten)

# 4. Dev-Server starten
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

| Variable | Beschreibung | Pflicht |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (sk_live_...) | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret | ✅ |
| `STRIPE_BRONZE_PRICE_ID` | Stripe Price ID Bronze (€19/Mo) | ✅ |
| `STRIPE_SILBER_PRICE_ID` | Stripe Price ID Silber (€49/Mo) | ✅ |
| `STRIPE_GOLD_PRICE_ID` | Stripe Price ID Gold (€99/Mo) | ✅ |
| `STRIPE_PLATIN_PRICE_ID` | Stripe Price ID Platin (€199/Mo) | ✅ |
| `PERPLEXITY_API_KEY` | Perplexity API Key (pplx-...) | ✅ für OPTIMUS |
| `NEXT_PUBLIC_APP_URL` | Produktions-URL | ✅ |

---

## 🏗 Architektur

```
src/
├── app/
│   ├── page.tsx              # Homepage (Creator OS Landing)
│   ├── creatorseal/          # CreatorSeal Hero Journey
│   ├── reviewradar/          # ReviewRadar Hero Landing
│   ├── churnrescue/          # ChurnRescue Hero Landing
│   ├── dealflow/             # DealFlow Brand-Matching
│   ├── waitlistkit/          # WaitlistKit Viral Builder
│   ├── contentforge/         # ContentForge KI-Generator
│   ├── optimus/              # OPTIMUS KI-Agent (Perplexity)
│   ├── perplexity/           # Perplexity Partnership
│   ├── pages-report/         # Perplexity Pages Report Generator
│   ├── hub/                  # Creator Hub (Dashboard)
│   ├── store/                # RealSync Store (Coin Redemption)
│   ├── coins/                # Coins Dashboard
│   ├── onboarding/           # Onboarding Flows
│   ├── apps/                 # 16 App Dashboards
│   │   ├── creatorseal/
│   │   ├── reviewradar/
│   │   ├── adengine/
│   │   ├── analyticspr/
│   │   ├── contentforge/
│   │   ├── trendradar/
│   │   └── ... (10 weitere)
│   ├── api/                  # API Routes
│   │   ├── optimus/          # OPTIMUS + Model Council + Spaces
│   │   ├── creatorseal/      # Trust-Score + Promo-Plan
│   │   ├── dealflow/         # Brand-Matching
│   │   ├── pages/            # Report Generator
│   │   └── stripe/           # Webhooks
│   ├── launch/               # Production Launch Checklist
│   ├── creator-kit/          # Creator Outreach Materials
│   └── about/                # Über uns / Investor Page
├── components/
│   ├── OptimusButton.tsx     # Floating KI-Agent Button
│   └── MobileNav.tsx         # Mobile Bottom Navigation
└── lib/
    ├── plans.ts              # Paket-Definitionen + Perplexity Modelle
    └── supabase/             # Supabase Client
```

---

## 📦 Pakete & Preise

| Paket | Preis | Features |
|-------|-------|---------|
| Gratis | €0,00/Mo | Creator-Profil, QR-Code, Basis-Badge |
| Bronze | €19,00/Mo | Alle 16 Apps, 50 KI-Anfragen, 3 Plattformen |
| Silber | €49,00/Mo | Blockchain, Bulk-Modus, 5 Plattformen |
| Gold | €99,00/Mo | Automation, C2PA, Priority Support |
| Platin | €199,00/Mo | White-Label, API-Zugang, Dedicated Manager |
| Diamant | €499,00/Mo | Enterprise, Unbegrenzt, SLA |

---

## 🤖 OPTIMUS × Perplexity AI

OPTIMUS ist der KI-Agent des Creator OS — powered by Perplexity Sonar API:

| Modell | Kosten/Anfrage | Coins | Einsatz |
|--------|---------------|-------|---------|
| `sonar` | ~$0,006 | 5 | Schnelle Tasks |
| `sonar-pro` | ~$0,027 | 15 | Präzise Analysen |
| `sonar-deep-research` | ~$0,40 | 50 | Komplexe Reports |
| Model Council | 3 parallele Calls | 35 | Multi-Perspektive |

---

## 🗄 Supabase Schema

Das vollständige Datenbankschema liegt unter:
```
supabase/migrations/001_initial_schema.sql
```

Enthält: `profiles`, `subscriptions`, `coins_transactions`, `referrals`, `optimus_spaces`, `c2pa_certificates`, `reviews`, `content_items`

---

## 🚀 Deployment

```bash
# Production Deploy via GitHub → Vercel (automatisch)
git push origin main

# Manueller Deploy-Check
vercel --prod
```

**CI/CD:** GitHub Push → Vercel Build → Auto-Deploy Production

**Setup-Wizard:** `/launch` — interaktive Checkliste für Supabase, Stripe, Perplexity, Domain

---

## 🌐 Ökosystem & Sub-Projekte

| Repo | Beschreibung | Status |
|------|-------------|--------|
| [realsync-platform](https://github.com/realsyncdynamics-spec/realsync-platform) | **Dieses Repo** — Haupt-Plattform | 🔥 Aktiv |
| [RealSyncOptimusAgent](https://github.com/realsyncdynamics-spec/RealSyncOptimusAgent) | OPTIMUS Screen-Agent | Aktiv |
| [realsync-dynamics](https://github.com/realsyncdynamics-spec/realsync-dynamics) | Zentral-Plattform (Legacy) | Archiv |
| [realsync-ads](https://github.com/realsyncdynamics-spec/realsync-ads) | AI Ad-Generator | Aktiv |
| [digital-optimus](https://github.com/realsyncdynamics-spec/digital-optimus) | Screen-Agent | Aktiv |

---

## 📊 Roadmap

- [x] 16 App-Dashboards
- [x] OPTIMUS KI-Agent (Perplexity)
- [x] Model Council (3 parallele Modelle)
- [x] Perplexity Spaces
- [x] CreatorSeal Hero Journey
- [x] RealSyncCoins Ökosystem
- [x] B2B QR-Referral System
- [ ] Supabase Auth + OAuth (in Arbeit)
- [ ] Stripe Subscriptions live
- [ ] PERPLEXITY_API_KEY produktiv
- [ ] `realsyncdynamics.de` vollständig migriert
- [ ] Perplexity Computer Integration (Q3 2026)
- [ ] Perplexity Connectors (Q4 2026)

---

## 🤝 Perplexity Partnership

RealSync Dynamics ist **API Partner** von Perplexity AI. Ziel: Technology Partner Status + Publishers Program für Creator-Content als zitierfähige Quellen.

Details: [realsynccreator.realsyncdynamics.de/perplexity](https://realsynccreator.realsyncdynamics.de/perplexity)

---

## 📍 Über uns

**RealSync Dynamics** · Gegründet 2025 · Neuhaus am Rennweg, Bayern, Deutschland

Erste Creator-Plattform im DACH-Markt die C2PA 2.3, Blockchain-Verifikation und Perplexity AI in einem Ökosystem verbindet.

---

*© 2026 RealSync Dynamics · DSGVO-konform · Server 🇩🇪*
