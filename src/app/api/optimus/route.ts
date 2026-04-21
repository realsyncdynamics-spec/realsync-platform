import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logAiInteraction, type AiFeature } from '@/lib/ai/audit';

// ═══════════════════════════════════════════════════════════════
//  OPTIMUS — AI AGENT (Perplexity-powered)
//  Cross-app orchestrator für das gesamte RealSync Ökosystem
//
//  Jeder Call wird für EU AI Act Art. 12 in public.ai_interactions
//  protokolliert. Writes via Service-Role in src/lib/ai/audit.ts.
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

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const userAgent = request.headers.get('user-agent') ?? null;

  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id ?? null;
  } catch {
    // Anonymous call — leave userId null.
  }

  let body: {
    message?: string;
    model?: string;
    context?: Array<{ role: string; content: string }>;
    appContext?: string | null;
    disclosureAcknowledged?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const {
    message,
    model = 'sonar',
    context = [],
    appContext = null,
    disclosureAcknowledged = false,
  } = body;
  const feature: AiFeature = appContext === 'ReviewRadar' ? 'reviewradar' : 'optimus';

  if (!message) {
    await logAiInteraction({
      userId, feature, provider: 'none', model: String(model),
      status: 'blocked', errorMessage: 'missing_message',
      latencyMs: Date.now() - startedAt, ip, userAgent,
      disclosureAcknowledged,
    });
    return NextResponse.json({ error: 'Nachricht fehlt' }, { status: 400 });
  }

  const PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY;

  // Demo mode — kein API-Key.
  if (!PERPLEXITY_KEY) {
    const demo = generateDemoResponse(message, appContext);
    await logAiInteraction({
      userId, feature, provider: 'demo', model: 'demo',
      requestText: message, responseText: demo.response,
      tokensIn: 0, tokensOut: 0, coinCost: 0,
      latencyMs: Date.now() - startedAt, status: 'success',
      ip, userAgent, disclosureAcknowledged,
    });
    return NextResponse.json(demo);
  }

  const chosenModel =
    model === 'deep' ? 'sonar-deep-research' : model === 'fast' ? 'sonar' : 'sonar-pro';
  const coinCost = model === 'deep' ? 50 : model === 'fast' ? 5 : 15;

  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT + (appContext ? `\n\nAktueller App-Kontext: ${appContext}` : ''),
    },
    ...context.slice(-6),
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PERPLEXITY_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: chosenModel,
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
      await logAiInteraction({
        userId, feature, provider: 'perplexity', model: chosenModel,
        requestText: message, coinCost,
        latencyMs: Date.now() - startedAt, status: 'error',
        errorMessage: `perplexity_${response.status}: ${err.slice(0, 200)}`,
        ip, userAgent, disclosureAcknowledged,
      });
      return NextResponse.json({ error: `Perplexity: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Keine Antwort';
    const citations = data.citations || [];
    const detectedApps = detectApps(message + ' ' + content);
    const tokensIn = data.usage?.prompt_tokens ?? null;
    const tokensOut = data.usage?.completion_tokens ?? null;

    await logAiInteraction({
      userId, feature, provider: 'perplexity', model: chosenModel,
      requestText: message, responseText: content,
      tokensIn, tokensOut, coinCost,
      latencyMs: Date.now() - startedAt, status: 'success',
      ip, userAgent, disclosureAcknowledged,
    });

    return NextResponse.json({
      response: content,
      citations,
      detectedApps,
      coinCost,
      model,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    await logAiInteraction({
      userId, feature, provider: 'perplexity', model: chosenModel,
      requestText: message, coinCost,
      latencyMs: Date.now() - startedAt, status: 'error',
      errorMessage, ip, userAgent, disclosureAcknowledged,
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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

  return found.slice(0, 3);
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
    response = `## 📡 Trend-Analyse (Demo)\n\n⚠️ *Demo-Modus — kein PERPLEXITY_API_KEY konfiguriert. Echte Echtzeit-Trends nicht verfügbar.*\n\n**Beispiel-Trends (nicht aktuell):**\n\n1. AI-Content Tools\n2. Creator Economy\n3. Deepfake Detection\n\n*Für echte Trend-Analyse: PERPLEXITY_API_KEY in den Einstellungen hinterlegen.*`;
    detectedApps = [
      { app: 'TrendRadar', route: '/apps/trendradar/dashboard', reason: 'Live Trends' },
      { app: 'ContentForge', route: '/apps/contentforge/dashboard', reason: 'Trend-Content' },
      { app: 'AdEngine', route: '/apps/adengine/dashboard', reason: 'Trend-Ad' },
    ];
  } else {
    response = `## 🤖 OPTIMUS — Bereit\n\nIch bin dein KI-Agent für das gesamte RealSync Ökosystem. Ich habe Zugriff auf alle 16 Apps und kann app-übergreifend für dich arbeiten.\n\n**Was ich gerade tun kann:**\n- 📺 KI-Ads für YouTube/TikTok/Instagram erstellen\n- ⭐ Review-Antworten auf Google/Trustpilot generieren  \n- 📡 Virale Trends in deiner Nische erkennen\n- ✍️ Content-Skripte und Hooks schreiben\n- 💳 Failed Payments automatisch recovern\n- 📊 Cross-Platform Analytics auswerten\n- 🛍 Coins optimieren und Store-Artikel empfehlen\n\n**Beispiel-Befehle:**\n> "Erstell mir eine YouTube-Ad für mein Tech-Review"\n> "Antworte auf meine negativen Google Reviews"\n> "Was sind die viralen Trends diese Woche?"\n> "Optimiere meinen Content-Kalender"\n\n*Powered by Perplexity AI · Echtzeit-Web-Zugriff*`;
    detectedApps = [];
  }

  const demoHeader = `> ⚠️ **Demo-Modus** — PERPLEXITY_API_KEY nicht konfiguriert. Diese Antwort ist kein echtes KI-Ergebnis.\n\n`;
  return {
    response: demoHeader + response,
    detectedApps,
    coinCost: 0,
    model: 'demo',
    demo: true,
    citations: [],
  };
}

export async function GET() {
  const hasKey = !!process.env.PERPLEXITY_API_KEY;
  return Response.json({
    status: hasKey ? 'online' : 'demo',
    configured: hasKey,
    models: hasKey ? ['sonar', 'sonar-pro', 'sonar-deep-research'] : [],
    message: hasKey ? 'OPTIMUS ist aktiv.' : 'PERPLEXITY_API_KEY fehlt — OPTIMUS läuft im Demo-Modus.',
    pricing: {
      sonar:                  { coins: 5,  usd_per_req: 0.006 },
      'sonar-pro':            { coins: 15, usd_per_req: 0.027 },
      'sonar-deep-research':  { coins: 50, usd_per_req: 0.40  },
    },
    docs: 'https://docs.perplexity.ai',
  });
}
