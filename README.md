# RealSync Platform v2

**Production-ready, stabil, ehrlich.**

Next.js 15 App Router • Supabase SSR • Stripe • TypeScript strict.

## Was funktioniert (alles server-rendered, kein "Lädt…")

- ✅ `/` — Landing Page mit ehrlichem Beta-Messaging
- ✅ `/login` — Magic-Link-Login via Supabase OTP (funktioniert auch ohne JS)
- ✅ `/auth/callback` — Session-Austausch nach Magic-Link-Klick
- ✅ `/dashboard` — Auth-geschützt, zeigt Plan + Verifikations-Count
- ✅ `/impressum`, `/datenschutz`, `/agb` — vollständig, mit echten Daten
- ✅ `/api/health` — Echt, prüft DB + Stripe, gibt JSON zurück
- ✅ `/api/stripe/webhook` — Mit Signatur-Prüfung und Idempotenz
- ✅ `/api/billing/portal` — Redirect zu Stripe Customer Portal
- ✅ Middleware schützt `/dashboard` und refreshed Supabase-Session

## Lokal starten

```bash
cp .env.example .env.local
# Fülle .env.local mit echten Werten aus
npm install
npm run dev
# → http://localhost:3000
```

## Deploy auf Vercel

### 1. Neues Vercel-Projekt anlegen

```bash
# Voraussetzung: Vercel CLI
npm i -g vercel
vercel login
vercel link   # existing project verknüpfen, oder neu erstellen
```

Alternative via Vercel Dashboard → Import → GitHub Repo.

### 2. Environment Variables setzen

Im Vercel-Projekt unter **Settings → Environment Variables** hinzufügen (alle als Production + Preview):

| Key | Wert |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://realsyncdynamics.de` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ebljyceifhnlzhjfyxup.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_BqKKWFM8zcb8R5NXifVgjA_pIYunrhB` |
| `SUPABASE_SERVICE_ROLE_KEY` | Aus Supabase Dashboard → Settings → API → service_role |
| `STRIPE_SECRET_KEY` | Aus Stripe Dashboard → API keys → sk_live_… |
| `STRIPE_WEBHOOK_SECRET` | Erst nach Webhook-Erstellung (siehe Schritt 4) |
| `STRIPE_BILLING_PORTAL_URL` | Aus Stripe Dashboard → Settings → Billing → Portal |
| `ADMIN_EMAILS` | `dominik@realsyncdynamics.de` |

### 3. Domain verbinden

Vercel → Settings → Domains → `realsyncdynamics.de` hinzufügen.

Beim Domain-Provider folgenden Record anlegen:

- **Type:** A
- **Host:** `@`
- **Value:** `76.76.21.21`

Oder via CNAME für `www`:

- **Type:** CNAME
- **Host:** `www`
- **Value:** `cname.vercel-dns.com`

### 4. Stripe-Webhook einrichten

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://realsyncdynamics.de/api/stripe/webhook`
3. Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Signing secret kopieren → Vercel ENV `STRIPE_WEBHOOK_SECRET` setzen
5. Vercel: Redeploy

### 5. Supabase Auth konfigurieren

1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL:** `https://realsyncdynamics.de`
3. **Redirect URLs:** füge hinzu:
   - `https://realsyncdynamics.de/auth/callback`
   - `https://*.vercel.app/auth/callback` (für Preview Deployments)

### 6. Smoke-Test

```bash
curl https://realsyncdynamics.de/api/health
# → {"ok": true, "checks": {"db": {...}, "stripe": {...}}}
```

Testen:
1. `/` → Landing lädt < 1s
2. `/login` → E-Mail eingeben → Magic Link kommt
3. Link klicken → Landing auf `/dashboard`
4. `/dashboard` zeigt "Plan: GRATIS" und "0 / 3"
5. `/impressum` → alle Felder ausgefüllt
6. Stripe Dashboard → Webhook → Send test webhook → HTTP 200

## Architektur

```
app/
├── page.tsx                 Homepage (SSR, ehrlich)
├── login/page.tsx           Magic-Link-Form (Server Action)
├── dashboard/page.tsx       Auth-geschützt, zeigt Usage
├── auth/
│   ├── callback/route.ts    OAuth-Callback
│   └── signout/route.ts     Logout
├── api/
│   ├── health/route.ts      /api/health
│   ├── stripe/webhook/      Stripe-Events verarbeiten
│   └── billing/portal/      Redirect zu Stripe Portal
├── impressum/page.tsx       Vollständiges Impressum
├── datenschutz/page.tsx     DSGVO-konform
└── agb/page.tsx             SaaS-AGB für DE

lib/supabase/
├── client.ts                Browser-Client
└── server.ts                SSR + Service-Role-Client

components/
├── Nav.tsx                  User-aware Navigation
└── Footer.tsx               Footer mit Legal-Links

middleware.ts                Session-Refresh + /dashboard protection
```

## Unterschiede zu v1

| v1 (realsync-platform) | v2 (diese Version) |
|---|---|
| Client-side rendering → "Lädt…" | Server-side rendering |
| `/dashboard` crashte mit HTTP 500 | Resilient, gracefully handled |
| Kein `/api/health` | Echter Health-Check |
| Fake Stats (4.900+ Creator) | Ehrlich, "Beta" |
| Impressum mit Platzhaltern | Vollständig, abmahn-sicher |
| 16 Apps versprochen | 3 Live, 2 Beta, 1 Roadmap — ehrlich |
| Trust-Score-Button disabled | Klarer Funnel zu `/login` |

## Support

Fragen? `kontakt@realsyncdynamics.de`
