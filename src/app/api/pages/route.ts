import { NextRequest, NextResponse } from 'next/server';

// PERPLEXITY PAGES — Auto-generierte Creator-Reports
// Feature: Aus OPTIMUS-Gesprächen strukturierte, zitierbare Reports
// Perplexity Pages Feature (in Vorbereitung für Integration)

const REPORT_TYPES = {
  monthly:   { name:'Monatsbericht',      sections:['Executive Summary','Wichtigste Metriken','Top-Content','Verbesserungen','Nächste Schritte'] },
  strategy:  { name:'Strategie-Report',   sections:['Marktanalyse','Creator-Positionierung','Wachstumsstrategie','KPIs','Aktionsplan'] },
  trends:    { name:'Trend-Report',       sections:['Virale Trends','Plattform-Insights','Content-Empfehlungen','Timing-Analyse','Quick Wins'] },
  launch:    { name:'Launch-Plan',        sections:['Executive Summary','Zielgruppe','Content-Strategie','Kanal-Plan','Zeitplan','Erfolgsmetriken'] },
};

export async function POST(request: NextRequest) {
  const { topic, reportType = 'monthly', context = '' } = await request.json();
  if (!topic) return NextResponse.json({ error: 'Thema fehlt' }, { status: 400 });

  const KEY = process.env.PERPLEXITY_API_KEY;
  const type = REPORT_TYPES[reportType as keyof typeof REPORT_TYPES] || REPORT_TYPES.monthly;

  const prompt = `Erstelle einen professionellen ${type.name} für einen Creator im DACH-Raum zum Thema: "${topic}".
${context ? `Kontext: ${context}` : ''}

Struktur des Reports:
${type.sections.map((s,i)=>`${i+1}. ${s}`).join('\n')}

Anforderungen:
- Deutsch, professionell, konkret
- Echte Daten und Benchmarks wo verfügbar (mit Citations)
- Umsetzbare Empfehlungen für Creator
- Jede Sektion: 2-4 Sätze + 3 konkrete Punkte
- Abschluss: 3 sofortige Quick Wins`;

  if (!KEY) {
    return NextResponse.json({ report: generateDemoReport(topic, type), coinCost: 75, mode: 'demo' });
  }

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: 'Du bist ein professioneller Creator-Economy-Analyst. Schreibe strukturierte, zitierbare Reports auf Deutsch.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
      return_citations: true,
    }),
  });

  const data = await res.json();
  return NextResponse.json({
    report: data.choices?.[0]?.message?.content || 'Fehler',
    citations: data.citations || [],
    coinCost: 75,
    mode: 'live',
    title: `${type.name}: ${topic}`,
    generatedAt: new Date().toISOString(),
  });
}

function generateDemoReport(topic: string, type: any) {
  return `# ${type.name}: ${topic}

## 1. Executive Summary
Der Creator-Markt im DACH-Raum wächst 2026 um ~34% YoY. Für "${topic}" bestehen signifikante Chancen in den Bereichen Short-Form Video, KI-gestützte Produktion und B2B-Kooperationen.

▸ Marktgröße Creator Economy DACH: ~€2,4 Mrd (2026)
▸ Durchschnittliche Creator-Einnahmen: €2.400/Monat
▸ KI-Tool-Adoption: 78% der Top-Creator nutzen KI-Tools

## 2. Analyse
Die Daten zeigen, dass Creator mit verifiziertem Content (C2PA) eine um 34% höhere Engagement-Rate erzielen. Deepfake-Schutz wird zunehmend zur Grundvoraussetzung.

▸ Verifikationsrate steigt: +142% QoQ
▸ Brand-Deal-Wert steigt 28% bei verifizierten Creatorn
▸ Ø QR-Code-Scan-Rate: 2,1% (hochwertig vs. 0,3% Standard)

## 3. Empfehlungen
Basierend auf aktuellen Marktdaten und Creator-Economy-Trends ergeben sich folgende Prioritäten:

▸ Sofort: C2PA-Verifikation aktivieren → Trust-Score +40%
▸ Diese Woche: B2B-QR in alle Social-Bios einfügen
▸ Diesen Monat: OPTIMUS für Content-Strategie nutzen

## 4. Quick Wins
1. **QR-Code in YouTube-Bio** → Durchschnittlich 3 neue Referrals/Woche
2. **ReviewRadar aktivieren** → Alle negativen Bewertungen in <3h beantwortet
3. **OPTIMUS Trend-Alert** → Viral-Themen 48h früher erkennen`;
}
