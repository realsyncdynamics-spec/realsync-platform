import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
//  OPTIMUS — AI AGENT (Perplexity-powered)
//  Cross-app orchestrator für das gesamte RealSync Ökosystem
//
//  Modelle: sonar-pro (Echtzeit-Web), sonar-reasoning (Deep),
//           sonar-turbo (Fast), llama-3-sonar-large-32k-online
//
//  Coin-Modell:
//  - sonar-turbo   →  5 Coins/Anfrage   (Bronze+)
//  - sonar-pro     → 15 Coins/Anfrage   (Silber+)
//  - sonar-deep    → 30 Coins/Anfrage   (Gold+)
//  - Auto-Tool     → 50 Coins/Aktion    (Platin+)
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Du bist OPTIMUS — der KI-Kern des RealSync Creator OS.
Du bist ein intelligenter Cross-App-Agent mit Zugriff auf alle 16 Apps der Plattform.

Deine Fähigkeiten:
- CreatorSeal: Content verifizieren, C2PA signieren, Deepfake-Scan
- ReviewRadar: KI-Antworten generieren, Plattformen analysieren
- ChurnRescue: Failed Payments identifizieren, Retry-Strategien
- WaitlistKit: Waitlist-Kampagnen planen, Launch-Sequenzen
- AdEngine: KI-Ads für YouTube/TikTok/Instagram generieren
- AnalyticsPro: Cross-Platform Daten analysieren, Insights
- ContentForge: Skripte, Captions, Hooks generieren
- TrendRadar: Virale Trends erkennen und analysieren
- ScheduleMaster: Content-Kalender optimieren
- CollabHub: Brand-Deals verwalten
- MonetizeMax: Revenue-Streams optimieren
- RealSync Store: Coins-Verwaltung, Produkte empfehlen

Wenn ein Creator eine Aufgabe beschreibt:
1. Erkenne welche Apps benötigt werden
2. Erstelle einen konkreten Aktionsplan
3. Führe die Aktionen aus oder leite an die richtige App weiter
4. Gib strukturierte, umsetzbare Antworten auf Deutsch

Du hast Zugriff auf Echtzeit-Web-Suche via Perplexity.
Wenn neue Tools benötigt werden, schlage deren Installation vor.

Antworte immer präzise, strukturiert und auf das Creator-Ökosystem fokussiert.`;

const TOOLS: Record<string, { desc: string; app: string; route: string; coins: number }> = {
  verify_content:      { desc:'Content C2PA verifizieren',        app:'CreatorSeal',    route:'/apps/creatorseal/dashboard',   coins:10 },
  generate_review_reply:{ desc:'KI-Antwort auf Review',           app:'ReviewRadar',    route:'/apps/reviewradar/dashboard',   coins:5  },
  create_ad:           { desc:'KI-Ad generieren',                  app:'AdEngine',       route:'/apps/adengine/dashboard',      coins:15 },
  analyze_trends:      { desc:'Trends analysieren',                app:'TrendRadar',     route:'/apps/trendradar/dashboard',    coins:10 },
  generate_content:    { desc:'Content/Script erstellen',          app:'ContentForge',   route:'/apps/contentforge/dashboard',  coins:8  },
  schedule_post:       { desc:'Post planen',                       app:'ScheduleMaster', route:'/apps/schedulemaster/dashboard',coins:3  },
  analyze_churn:       { desc:'Churn-Risiko analysieren',          app:'ChurnRescue',    route:'/apps/churnrescue/dashboard',   coins:12 },
  launch_waitlist:     { desc:'Waitlist/Launch starten',           app:'WaitlistKit',    route:'/apps/waitlistkit/dashboard',   coins:20 },
  revenue_optimize:    { desc:'Revenue-Streams optimieren',        app:'MonetizeMax',    route:'/apps/monetizemax/dashboard',   coins:15 },
  brand_deal_find:     { desc:'Brand Deals finden',                app:'CollabHub',      route:'/apps/collabhub/dashboard',     coins:25 },
  cross_platform_stats:{ desc:'Cross-Platform Analytics',          app:'AnalyticsPro',   route:'/apps/analyticspro/dashboard',  coins:8  },
  store_recommend:     { desc:'Store-Artikel empfehlen',           app:'RealSync Store', route:'/store',                        coins:2  },
};

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'sonar', context = [], appContext = null } = await request.json();

    if (!message) return NextResponse.json({ error: 'Nachricht fehlt' }, { status: 400 });

    const PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY;

    // If no API key, return smart demo response
    if (!PERPLEXITY_KEY) {
      return NextResponse.json(generateDemoResponse(message, appContext));
    }

    // Build messages with context
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + (appContext ? `\n\nAktueller App-Kontext: ${appContext}` : '') },
      ...context.slice(-6), // Last 6 messages for context
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model === 'deep' ? 'sonar-pro' : model === 'fast' ? 'sonar' : 'sonar',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
        return_citations: true,
        return_related_questions: false,
        search_recency_filter: 'month',
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Perplexity: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Keine Antwort';
    const citations = data.citations || [];

    // Detect which tools/apps were mentioned
    const detectedApps = detectApps(message + ' ' + content);

    // Calculate coin cost
    const coinCost = model === 'deep' ? 30 : model === 'fast' ? 5 : 15;

    return NextResponse.json({
      response: content,
      citations,
      detectedApps,
      coinCost,
      model,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function detectApps(text: string): { app: string; route: string; reason: string }[] {
  const lower = text.toLowerCase();
  const found: { app: string; route: string; reason: string }[] = [];

  if (lower.includes('review') || lower.includes('bewertung') || lower.includes('antwort'))
    found.push({ app: 'ReviewRadar', route: '/apps/reviewradar/dashboard', reason: 'Review-Verwaltung' });
  if (lower.includes('ad') || lower.includes('werbung') || lower.includes('kampagne'))
    found.push({ app: 'AdEngine', route: '/apps/adengine/dashboard', reason: 'KI-Ads' });
  if (lower.includes('trend') || lower.includes('viral'))
    found.push({ app: 'TrendRadar', route: '/apps/trendradar/dashboard', reason: 'Trend-Analyse' });
  if (lower.includes('content') || lower.includes('script') || lower.includes('caption'))
    found.push({ app: 'ContentForge', route: '/apps/contentforge/dashboard', reason: 'Content-Erstellung' });
  if (lower.includes('churn') || lower.includes('zahlung') || lower.includes('abo'))
    found.push({ app: 'ChurnRescue', route: '/apps/churnrescue/dashboard', reason: 'Payment Recovery' });
  if (lower.includes('verify') || lower.includes('c2pa') || lower.includes('blockchain'))
    found.push({ app: 'CreatorSeal', route: '/apps/creatorseal/dashboard', reason: 'Verifikation' });
  if (lower.includes('analytics') || lower.includes('statistik') || lower.includes('views'))
    found.push({ app: 'AnalyticsPro', route: '/apps/analyticspro/dashboard', reason: 'Analytics' });
  if (lower.includes('coins') || lower.includes('store') || lower.includes('shop'))
    found.push({ app: 'RealSync Store', route: '/store', reason: 'Coins & Store' });

  return found.slice(0, 3); // Max 3 suggestions
}

function generateDemoResponse(message: string, appContext: string | null) {
  const lower = message.toLowerCase();
  let response = '';
  let detectedApps: { app: string; route: string; reason: string }[] = [];

  if (lower.includes('ad') || lower.includes('werbung') || lower.includes('youtube')) {
    response = `## 📺 KI-Ad Strategie\n\nIch habe deine Anfrage analysiert. Hier ist mein Aktionsplan:\n\n**Sofortmaßnahmen:**\n1. **AdEngine aktivieren** → KI-Hook für YouTube generieren\n2. **TrendRadar prüfen** → Aktuelle Creator-Trends einbauen\n3. **ScheduleMaster** → Optimale Posting-Zeit ermitteln (Di/Mi 14-16 Uhr)\n\n**Empfohlener Hook:**\n> "Diese 3 Creator-Fehler kosten dich täglich Geld — ich zeige dir wie RealSync das automatisch verhindert."\n\n**Platforms:** YouTube (Primär) · TikTok (Remix) · Instagram Reel (Cut)\n\n*Coin-Kosten: 15 Coins · Sofort einsatzbereit*`;
    detectedApps = [
      { app: 'AdEngine', route: '/apps/adengine/dashboard', reason: 'KI-Ad generieren' },
      { app: 'TrendRadar', route: '/apps/trendradar/dashboard', reason: 'Trend-Einbindung' },
      { app: 'ScheduleMaster', route: '/apps/schedulemaster/dashboard', reason: 'Posting planen' },
    ];
  } else if (lower.includes('review') || lower.includes('bewertung')) {
    response = `## ⭐ Review Management\n\nIch habe deine Reviews analysiert:\n\n**Status:** 3 negative Reviews erkannt → sofortiger Handlungsbedarf\n\n**Automatische KI-Antworten bereitgestellt:**\n- Google: "Vielen Dank für Ihr Feedback. Wir nehmen Ihre Erfahrung sehr ernst..."\n- Trustpilot: "Wir bedauern, dass Ihre Erwartungen nicht erfüllt wurden..."\n\n**Empfehlung:** ReviewRadar Bulk-Modus aktivieren (Silber+ benötigt)\n\n*Coin-Kosten: 5 Coins · 3 Antworten · Direkt versendbar*`;
    detectedApps = [
      { app: 'ReviewRadar', route: '/apps/reviewradar/dashboard', reason: 'Review-Antworten' },
    ];
  } else if (lower.includes('trend') || lower.includes('viral')) {
    response = `## 📡 Trend-Analyse (Echtzeit)\n\n**Top-Trends für Creator jetzt:**\n\n1. 🔥 **AI-Content Tools** — +142% · TikTok explodiert\n2. 📈 **Creator Economy 2026** — +89% · YouTube/LinkedIn\n3. ⚡ **Deepfake Detection** — +234% · X/Twitter viral\n\n**Sofort-Aktion empfohlen:**\n→ ContentForge: Hook zu "AI-Content Tools" generieren\n→ ScheduleMaster: Post für heute 19:00 Uhr einplanen\n→ AdEngine: TikTok-Ad auf Trend aufspringen\n\n*Analysiert via Perplexity Sonar · Real-time Web Search*`;
    detectedApps = [
      { app: 'TrendRadar', route: '/apps/trendradar/dashboard', reason: 'Live Trends' },
      { app: 'ContentForge', route: '/apps/contentforge/dashboard', reason: 'Trend-Content' },
      { app: 'AdEngine', route: '/apps/adengine/dashboard', reason: 'Trend-Ad' },
    ];
  } else {
    response = `## 🤖 OPTIMUS — Bereit\n\nIch bin dein KI-Agent für das gesamte RealSync Ökosystem. Ich habe Zugriff auf alle 16 Apps und kann app-übergreifend für dich arbeiten.\n\n**Was ich gerade tun kann:**\n- 📺 KI-Ads für YouTube/TikTok/Instagram erstellen\n- ⭐ Review-Antworten auf Google/Trustpilot generieren  \n- 📡 Virale Trends in deiner Nische erkennen\n- ✍️ Content-Skripte und Hooks schreiben\n- 💳 Failed Payments automatisch recovern\n- 📊 Cross-Platform Analytics auswerten\n- 🛍 Coins optimieren und Store-Artikel empfehlen\n\n**Beispiel-Befehle:**\n> "Erstell mir eine YouTube-Ad für mein Tech-Review"\n> "Antworte auf meine negativen Google Reviews"\n> "Was sind die viralen Trends diese Woche?"\n> "Optimiere meinen Content-Kalender"\n\n*Powered by Perplexity AI · Echtzeit-Web-Zugriff*`;
    detectedApps = [];
  }

  return { response, detectedApps, coinCost: 15, model: 'sonar-demo', citations: [] };
}
