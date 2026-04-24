# Launch-Runbook · Starter €9,90 → 1000 User

Operativer Leitfaden für den Weg vom gemergten PR #7 bis zum ersten Tausend bezahlter Starter-User.

> **Haftungsausschluss:** Die AGB-Textvorschläge in § 4 sind ein Entwurf von einem Software-Agenten, kein anwaltlicher Rat. Vor Live-Schaltung durch einen Anwalt prüfen lassen.

---

## 1. Kritischer Pfad bis zur ersten €9,90

| # | Schritt | Zeit | Abhängigkeit |
|---|---|---|---|
| 1 | PR #7 mergen | 15 min | Code-Review |
| 2 | Supabase: Migration 002 anwenden | 10 min | PR gemergt |
| 3 | Stripe: Starter-Produkt + One-time Price €9,90 anlegen | 10 min | – |
| 4 | Vercel Env-Vars setzen | 10 min | Stripe Price-ID |
| 5 | Stripe-Webhook-Endpoint konfigurieren | 10 min | Vercel-Deploy läuft |
| 6 | E2E-Test im Stripe Test-Mode | 30 min | Schritte 2-5 |
| 7 | AGB-Klauseln ergänzen (siehe § 4 in diesem Runbook) | 0-1 Tag | Anwaltsprüfung |
| 8 | Live-Switch: `sk_live_*` + Live-Webhook | 20 min | AGB final |
| 9 | Launch-Post mit UTM | 1-2 h | Live ist grün |
| 10 | **Erste bezahlte Transaktion** | +1-7 Tage | Reichweite |

---

## 2. Pre-flight

### 2.1 Supabase-Migration

```bash
cd realsync-platform
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/002_starter_and_referrals.sql
```

Verifikation (gegen Staging zuerst):

```sql
-- sollte alle neuen Spalten zeigen
\d creatorseal.profiles

-- neue Tabellen
\d creatorseal.referrals
\d creatorseal.lifecycle_sends

-- RLS muss aktiv sein
select tablename, rowsecurity
from pg_tables
where schemaname = 'creatorseal'
  and tablename in ('profiles','subscriptions','referrals','lifecycle_sends');
-- rowsecurity sollte für alle vier 't' sein
```

### 2.2 Stripe: Produkt + Price anlegen

Stripe Dashboard → Products → **Add product**

- Name: `Starter — 3 Monate alles drin`
- Description: `Einmalzahlung. 90 Tage Vollzugriff. Kein Abo.`
- Price:
  - **One time** (nicht Recurring)
  - 9,90 EUR
  - Lookup key: `starter_9_90_3m` (muss exakt so heißen — Migration 002 erwartet das)
- Speichern → Price-ID (`price_1Q...`) kopieren.

### 2.3 Vercel Env-Vars

Dashboard → Project `realsync-platform` → Settings → Environment Variables. Für **Production** *und* **Preview** setzen:

| Variable | Wert |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://realsyncdynamics.de` |
| `NEXT_PUBLIC_SUPABASE_URL` | aus Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | aus Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | aus Supabase → Settings → API · **geheim** |
| `STRIPE_SECRET_KEY` | Test-Mode: `sk_test_*` · Live: `sk_live_*` |
| `STRIPE_WEBHOOK_SECRET` | aus Schritt 2.4 |
| `STRIPE_STARTER_PRICE_ID` | aus Schritt 2.2 |
| `CRON_SECRET` | zufällig: `openssl rand -hex 32` |
| `ADMIN_EMAILS` | `dominik@realsyncdynamics.de` (Komma-Liste für mehrere) |
| `RESEND_API_KEY` | optional, erst wenn Lifecycle-Mails live sollen |
| `RESEND_FROM` | optional, default `noreply@realsyncdynamics.de` |
| `STARTER_NOTIFY_WEBHOOK_URL` | optional, Slack/Discord-Ping bei jedem Kauf |

### 2.4 Stripe-Webhook-Endpoint

Stripe Dashboard → Developers → Webhooks → **Add endpoint**

- URL: `https://realsyncdynamics.de/api/stripe/webhook`
- Events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Signing secret (`whsec_*`) kopieren → `STRIPE_WEBHOOK_SECRET` in Vercel setzen → **Redeploy** erzwingen.

---

## 3. E2E-Test im Stripe Test-Mode

**Ziel:** Ein Testkauf läuft komplett durch, Dashboard zeigt aktivierten Starter, Webhook-Ledger ist sauber.

### 3.1 Vorbereitung

- Vercel env `STRIPE_SECRET_KEY` auf **`sk_test_*`** setzen (und Deploy abwarten).
- Stripe Dashboard → **View test data** aktivieren.
- Einen Test-Produkt-Price mit Lookup-Key `starter_9_90_3m` auch im Test-Mode anlegen. Price-ID in Vercel als `STRIPE_STARTER_PRICE_ID` (kurz überschreiben).
- Stripe CLI (optional, für lokales Webhook-Forwarding): `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

### 3.2 Durchlauf

1. Inkognito-Fenster → `/starter?utm_source=test&utm_campaign=e2e`.
2. `Jetzt für €9,90 starten` → Redirect zu `/login?next=%2Fstarter` (falls nicht eingeloggt).
3. Mit Google einloggen → zurück auf `/starter` → CTA erneut klicken.
4. Stripe Checkout öffnet. Testkarte:
   - Kartennummer: `4242 4242 4242 4242`
   - Ablauf: `12 / 34` (beliebiges Future-Datum)
   - CVC: `123`
   - Name: beliebig, PLZ: `10115`
5. **Pay** → Redirect zu `/dashboard?starter=success&session_id=cs_test_*`.
6. Grüner Banner "Zahlung bestätigt".
7. Stat-Card **Plan** zeigt `STARTER` nach Hard-Reload.

### 3.3 Verifikation in Supabase

```sql
-- Profile-Update muss da sein, ca. 90 Tage Laufzeit
select user_id, plan_code, starter_access_until
from creatorseal.profiles
where email = 'deine-test-email@gmail.com';

-- Webhook-Ledger: genau 1 Row für checkout.session.completed, kein processing_error
select stripe_event_id, event_type, payload_summary, processed_at, processing_error
from creatorseal.webhook_events
order by created_at desc
limit 5;

-- UTMs müssen in payload_summary auftauchen
-- erwartet: {"utm_source":"test","utm_campaign":"e2e",...}
```

### 3.4 Idempotenz-Check

Stripe Dashboard → Webhooks → den Event finden → **Resend**. Zweiter Insert in `webhook_events` darf *nicht* passieren; Route muss mit `{"ok":true,"already_processed":true}` antworten.

### 3.5 Referral-Flow testen

1. User A macht Testkauf wie oben. Referral-Code kopieren aus `/dashboard` (oder `select referral_code from creatorseal.profiles where email=...`).
2. User B (zweite Test-Mail) besucht `/r/<A.code>` → Cookie `rs_ref` gesetzt → `/starter?ref=...` → Kauf.
3. `select * from creatorseal.referrals where referrer_id = '<A.id>'` → 1 Row, `paid_at` gesetzt, `rewarded_at` NULL.
4. Mit User C und D wiederholen. Nach dem dritten Kauf:
   - `referrals.rewarded_at` ist bei allen drei gesetzt.
   - `profiles.starter_access_until` von User A um **30 Tage** nach hinten geschoben.
   - `profiles.referral_bonus_days` = 30.

### 3.6 Admin-Dashboard

`/admin` → Top-Leaderboard zeigt User A mit `count=3`, `Bonus-Tage=+30d`. Metriken stimmen, keine Webhook-Errors in den letzten 24h.

### 3.7 Cron manuell testen

```bash
curl -H "authorization: Bearer $CRON_SECRET" \
  "https://realsyncdynamics.de/api/cron/lifecycle"
# → {"ok":true,"sent":{"d_minus_30":0,"d_minus_5":0,"expired":0}}

# ohne Header
curl "https://realsyncdynamics.de/api/cron/lifecycle"
# → 401
```

---

## 4. AGB-Ergänzungen (Entwurf — anwaltliche Prüfung erforderlich)

### 4.1 Neuer Absatz in `§ 4 Preise und Zahlung`

> Zusätzlich zu laufenden Abonnements wird das Einmal-Paket **„Starter"** angeboten. Der Preis beträgt €9,90 (inkl. gesetzlicher Umsatzsteuer bzw. ohne Umsatzsteuerausweis nach § 19 UStG, sofern einschlägig). Mit Zahlungseingang erhält der Nutzer 90 Tage Zugriff auf den vollen Funktionsumfang. **Es findet keine automatische Verlängerung statt; nach Ablauf der 90 Tage endet der Zugriff ohne weitere Abbuchung.**

### 4.2 Neuer Paragraph nach § 4 — `§ 4a Referral-Bonus`

> Registrierte Nutzer erhalten einen persönlichen Referral-Link. Werben sie damit drei (3) andere Nutzer, die jeweils ein Starter-Paket abschließen und bezahlen, verlängert sich ihr eigener Starter-Zeitraum um dreißig (30) Tage. Der Bonus wird automatisiert nach Eingang der dritten qualifizierten Zahlung gewährt. **Eine Barauszahlung des Bonus ist ausgeschlossen.** Missbrauch (Self-Referrals, Fake-Accounts, Zahlungen ohne Leistungsabsicht) führt zum Verlust des Bonus und kann die Kündigung des Accounts zur Folge haben.

### 4.3 Ergänzung in `§ 5 Laufzeit und Kündigung`

> Das Starter-Paket hat eine feste Laufzeit von 90 Tagen. Eine Kündigung während dieser Laufzeit ist nicht erforderlich, da keine Verlängerung erfolgt.

### 4.4 Ergänzung in `§ 6 Widerrufsrecht (Verbraucher)`

> Beim Starter-Paket gilt § 356 Abs. 5 BGB: Mit ausdrücklicher Zustimmung des Verbrauchers zur sofortigen Bereitstellung digitaler Inhalte erlischt das Widerrufsrecht. Der Nutzer erteilt diese Zustimmung durch Anklicken des entsprechenden Kontrollkästchens im Checkout.

> **Umsetzungshinweis:** Stripe Checkout muss dafür mit `consent_collection = { terms_of_service: 'required' }` aufgerufen werden, und es braucht einen expliziten Zustimmungs-Checkbox-Text vor der Zahlung. In `app/api/billing/checkout/route.ts` beim `stripe.checkout.sessions.create`-Call ergänzen. Erst nach AGB-Review aktivieren.

---

## 5. Go-Live

1. AGB-Seite (`app/agb/page.tsx`) mit geprüftem Text aktualisieren und deployen.
2. Vercel env `STRIPE_SECRET_KEY` auf Live-Wert (`sk_live_*`) umstellen.
3. Live-Webhook-Endpoint in Stripe separat anlegen (Live-Mode, gleiche URL, gleiche Events, **neues** Signing Secret → Vercel `STRIPE_WEBHOOK_SECRET`).
4. Live-Version des Starter-Price mit Lookup-Key `starter_9_90_3m` anlegen → `STRIPE_STARTER_PRICE_ID` umstellen.
5. Vercel → Redeploy auf Production erzwingen.
6. Selbsttest mit **echter Karte**, eigene Zahlung → sofort im Stripe-Dashboard **Refund**. So prüfst du:
   - Webhook-Signaturen im Live-Mode funktionieren
   - Refund-Flow löst `charge.refunded` aus (aktuell nicht im Webhook — kein Blocker, aber gut zu wissen)
   - AGB-Checkbox erscheint
7. Grünes Licht → Launch-Post raus.

---

## 6. 1000-User-Scaling-Playbook

### 6.1 Funnel-Mathematik

Zielgröße: 1000 bezahlte Starter. Realistische Conversion-Annahmen (DACH, kalter Traffic):

| Stufe | Conversion | Absolute Zahl |
|---|---|---|
| Landing-Visit (`/` oder `/starter`) | 100 % | **40.000** |
| → Klick auf Starter-CTA | 10 % | 4.000 |
| → Login / bereits eingeloggt | 50 % | 2.000 |
| → Stripe Checkout gestartet | 70 % | 1.400 |
| → Zahlung abgeschlossen | 75 % | **1.050** |

**Merke:** Ohne 40k relevante Visits über 90 Tage keine 1000 Starter. Das ist der Engpass — nicht das Produkt.

Referral-Loop halbiert den benötigten bezahlten Traffic: wenn jede:r 4. Starter eine Einladung erfolgreich einlöst, bringen 800 Signups ≈ 200 Referral-Signups „gratis". Aggressiver wenn die Referral-Belohnung sichtbarer ist (auf /dashboard läuft das schon).

### 6.2 Akquisitions-Kanäle (Priorisierung nach Aufwand × Reichweite)

| Kanal | Aufwand | Erwartete Starter / Monat | Wann starten |
|---|---|---|---|
| **Owner-Network-Post** (LinkedIn / X) | niedrig | 20–150 | **Tag 1** |
| **TikTok / Reels** Creator-Case-Studies (3-4 Videos / Woche) | hoch | 50–500 | **Woche 2** |
| Newsletter-Swap (andere DACH-Creator-SaaS) | mittel | 30–100 | **Woche 3** |
| Product-Hunt Launch (DE) | hoch, einmalig | 100–400 Signups | **Woche 4** |
| DACH-Creator-Communities (Discord/Slack) | mittel | 20–80 / Post | **Woche 2** |
| LinkedIn-Ads auf `/starter` (€20 CPA-Cap) | kapitalintensiv | 5-20 × Tagesbudget | **nach erster Validierung** |
| Meta-Ads (Instagram/Facebook) | kapitalintensiv | 10-30 × Tagesbudget | **nach erster Validierung** |
| SEO / Content (C2PA, Deepfake, Verifikation) | langfristig | skaliert nach 3-6 Monaten | **ab Woche 1** (kontinuierlich) |

### 6.3 Launch-Woche (Tag 1–7)

- **Tag 1:** Owner-Post auf X + LinkedIn mit `/starter?utm_source=x_launch&utm_campaign=day1`. Hart: Preis, Laufzeit, „kein Abo, kein Haken", Link. Screenshot vom Dashboard als Beleg.
- **Tag 2:** Response auf jeden Kommentar. Erster Testimonial-Screenshot wenn erste Zahlung kam → reposten.
- **Tag 3:** Newsletter (wenn vorhanden), Mail an Beta-User mit 20 % Rabatt-Code (via Stripe Coupon).
- **Tag 4:** Instagram Reel „3 Monate für €9,90, das steckt drin" (30s).
- **Tag 5:** DM-Outreach an 10 DACH-Creator-Peers für Cross-Promo.
- **Tag 6:** Abschluss-Post mit Woche-1-Zahlen (Transparenz-Building).
- **Tag 7:** `/admin` auswerten, Conversion-Rate per UTM-Source vergleichen, Budget auf beste Quelle verlagern.

### 6.4 Retention / Ausbauphase

- **Tägliches Monitoring:** `/admin` jeden Morgen checken. Slack-Ping (`STARTER_NOTIFY_WEBHOOK_URL`) für Echtzeit-Feedback.
- **Lifecycle-Mails aktiv halten:** `RESEND_API_KEY` setzen, Cron läuft automatisch via `vercel.json`. D-30 / D-5 / D-0 Mails sind der günstigste Retention-Hebel.
- **Upgrade-Funnel:** wenn Starter ausläuft → Dashboard zeigt rote „Verlängern"-CTA. Bei 10 % Verlängerungsrate sind das 100 weitere €9,90 = €990 pro 1000 ausgelaufene Starter.
- **Silber/Gold parallel launchen:** sobald die ersten 200 Starter durch sind, Recurring-Price für Silber (€49/Mo) anlegen und Starter-Users beim Ablauf upgraden lassen. LTV 10x gegenüber Single-Starter.

### 6.5 Red Flags / Abort-Kriterien

- Conversion `/starter` → bezahlt unter **3 %**: Page ist das Problem, nicht der Traffic. Copy überarbeiten.
- Webhook-Errors (24h) > 0 in `/admin`: **sofort** in Vercel Logs schauen. Jeder Fehler = potenzielle fehlende Plan-Zuweisung = zahlender User ohne Zugriff = Chargeback-Risiko.
- Stripe-Refund-Rate > **5 %**: AGB / Erwartungsmanagement stimmt nicht. Pausieren und Copy prüfen.
- CAC > LTV (bei Ads): Budget sofort kappen.

### 6.6 Wenn 1000 erreicht sind

- Hobby-Plan auf Vercel upgraden (wenn nicht schon) — Regions, Pro-Features.
- `lib/rate-limit.ts` auf Upstash/Vercel KV umziehen (heute in-memory, bei Burst-Traffic leaky).
- Supabase auf Pro-Plan (connection pool, point-in-time-recovery).
- Zweiter Developer / VA für Support-Inbox.

---

## Anhang A — Stripe-Test-Karten

| Case | Karte | Erwartung |
|---|---|---|
| Erfolg | `4242 4242 4242 4242` | `payment_intent.succeeded` |
| Decline | `4000 0000 0000 9995` | `card_declined` |
| 3DS Required | `4000 0027 6000 3184` | 3DS-Challenge |
| Authentication fehlgeschlagen | `4000 0082 6000 3178` | `payment_intent.payment_failed` |
| SEPA (IBAN) | `DE89 3704 0044 0532 0130 00` | SEPA-Checkout |

Volle Liste: https://stripe.com/docs/testing

## Anhang B — Supabase Debug-Queries

```sql
-- Wie viele Starter laufen aktuell?
select count(*)
from creatorseal.profiles
where plan_code = 'starter'
  and starter_access_until > now();

-- Welche UTM-Sources konvertieren am besten?
select
  payload_summary->>'utm_source'   as source,
  payload_summary->>'utm_campaign' as campaign,
  count(*)                         as paid
from creatorseal.webhook_events
where event_type = 'checkout.session.completed'
  and payload_summary->>'plan_code' = 'starter'
group by 1, 2
order by paid desc;

-- Referrer-Ranking
select p.email, count(*) as paid_referrals
from creatorseal.referrals r
join creatorseal.profiles p on p.user_id = r.referrer_id
where r.paid_at is not null
group by p.email
order by paid_referrals desc
limit 20;

-- Gibt es Webhook-Errors der letzten 24h?
select stripe_event_id, event_type, processing_error, created_at
from creatorseal.webhook_events
where processing_error is not null
  and created_at > now() - interval '24 hours';
```
