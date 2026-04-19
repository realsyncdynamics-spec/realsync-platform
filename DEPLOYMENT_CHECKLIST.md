# 🚀 Deployment Checklist - 4 Schritte

## ✅ Schritt 1: Lokal testen (pnpm dev)

### Vorbereitung
```bash
# 1. Environment Variables konfigurieren
cp .env.example .env.local

# 2. Füge deine Keys ein (in .env.local):
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - PERPLEXITY_API_KEY
# - CRON_SECRET (generiere mit: openssl rand -base64 32)
```

### Dev Server starten
```bash
pnpm install
pnpm dev
```

### Testen
- Homepage: http://localhost:3000
- Agent Dashboard: http://localhost:3000/agents
- API: http://localhost:3000/api/agents

**✅ Erfolgskriterium**: Alle Seiten laden ohne Fehler

---

## ✅ Schritt 2: Production Deploy (vercel --prod)

### Option A: Automatisches Script
```bash
./scripts/deploy-production.sh
```

### Option B: Manuell
```bash
# 1. Vercel CLI installieren (falls nicht vorhanden)
npm i -g vercel

# 2. Login
vercel login

# 3. Projekt verknüpfen
vercel link

# 4. Environment Variables setzen
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add PERPLEXITY_API_KEY
vercel env add CRON_SECRET
vercel env add STRIPE_SECRET_KEY
# ... alle anderen aus .env.example

# 5. Production Deploy
vercel --prod
```

### Verifizieren
```bash
# Nach Deploy (warte 30 Sekunden)
curl -I https://your-project.vercel.app
```

**✅ Erfolgskriterium**: Status 200, Seite ist live

---

## ✅ Schritt 3: Supabase Pro Upgrade

### Via Dashboard
1. Gehe zu https://app.supabase.com
2. Wähle dein Projekt
3. **Settings** → **Billing**
4. Klicke **Upgrade to Pro** (~$25/Monat)
5. Zahlungsdetails eingeben
6. Upgrade bestätigen

### Connection Pooling aktivieren
1. **Database** → **Connection Pooling**
2. Enable **Transaction Mode**
3. Kopiere die neue Pooled Connection URL
4. Update in Vercel:
   ```bash
   vercel env add DATABASE_URL production
   # Füge pooled URL ein: postgresql://...?pgbouncer=true
   ```

### Performance Indexes erstellen
```bash
# Verbinde mit Supabase SQL Editor
# Führe aus: supabase/migrations/002_agent_tables.sql

# Zusätzliche Performance-Indexes:
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agents_status_tasks 
  ON agents(status, tasks_completed DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agent_tasks_priority 
  ON agent_tasks(priority DESC, status, created_at DESC);
```

### Backups verifizieren
1. **Database** → **Backups**
2. Prüfe dass **Daily Backups** enabled sind
3. Teste Restore:
   - Download neuestes Backup
   - Erstelle Test-Projekt
   - Restore dort

**✅ Erfolgskriterium**: 
- Pro Plan aktiv
- Connection Pooling enabled
- Backups laufen täglich
- Performance-Indexes erstellt

---

## ✅ Schritt 4: Load Testing (k6)

### k6 installieren
```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6

# Windows
choco install k6
```

### Test-Dateien erstellen
```bash
mkdir -p tests

# Smoke Test
cat > tests/smoke-test.js << 'EOTEST'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
};

const BASE_URL = __ENV.BASE_URL || 'https://your-project.vercel.app';

export default function () {
  const res = http.get(BASE_URL);
  check(res, { 
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
  sleep(1);
}
EOTEST
```

### Tests ausführen
```bash
# 1. Smoke Test (Baseline)
BASE_URL=https://your-project.vercel.app k6 run tests/smoke-test.js

# 2. Load Test (siehe docs/LOAD_TESTING.md für weitere Tests)
k6 run tests/load-test.js

# 3. Ergebnisse analysieren
# Prüfe:
# - http_req_duration p95 < 2000ms
# - http_req_failed < 1%
# - Alle Checks passed
```

### Monitoring während Tests
1. **Vercel Dashboard**:
   - https://vercel.com/dashboard
   - Analytics → Performance
   - Prüfe Response Times & Error Rates

2. **Supabase Dashboard**:
   - https://app.supabase.com
   - Database → Logs
   - Prüfe Query Performance & Connections

**✅ Erfolgskriterium**:
- Smoke Test: 100% success rate
- Load Test: p95 < 2s, < 1% errors
- System stabil unter Last

---

## 📊 Finale Checkliste

- [ ] **Schritt 1**: Lokal getestet, /agents Dashboard funktioniert
- [ ] **Schritt 2**: Production deployed, URL erreichbar
- [ ] **Schritt 3**: Supabase Pro aktiv, Connection Pooling enabled
- [ ] **Schritt 4**: Load Tests bestanden, Performance OK

### Post-Deployment
- [ ] Monitoring Alerts konfiguriert
- [ ] Erste Cron Jobs erfolgreich (check logs nach 5-10 Min)
- [ ] Error Tracking setup (optional: Sentry)
- [ ] Dokumentation für Team geteilt

---

## 🆘 Troubleshooting

### Problem: Build fails
```bash
# Lösung: Dependencies neu installieren
rm -rf node_modules .next
pnpm install
pnpm build
```

### Problem: Database connection fails
```bash
# Lösung: Prüfe Connection String
echo $NEXT_PUBLIC_SUPABASE_URL
# Sollte nicht leer sein

# Test Connection:
curl -I $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

### Problem: Vercel deploy stuck
```bash
# Lösung: Force new deployment
vercel --prod --force
```

### Problem: Load test fails
```bash
# Lösung: Prüfe Rate Limiting
# Middleware erlaubt 100 req/min
# Bei Tests: Temporär erhöhen oder ausschalten
```

---

**Letzte Aktualisierung**: 2026-04-19  
**Status**: Production Ready  
**Nächster Schritt**: Schritt 1 starten! 🚀
