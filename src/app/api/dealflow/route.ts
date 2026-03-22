import { NextRequest, NextResponse } from 'next/server';

const BRANDS = [
  { id:'b1', name:'TechGear Pro',    niche:'Tech',     budget:'€500–2.000',  fit:94, logo:'⚡', color:'#00D4FF', type:'Affiliate',   desc:'Tech-Produkte für Creator' },
  { id:'b2', name:'CreatorFuel',     niche:'Lifestyle', budget:'€200–800',   fit:88, logo:'🔋', color:'#10B981', type:'Sponsored',   desc:'Energie-Drinks für Creator' },
  { id:'b3', name:'DesignKit Studio',niche:'Design',   budget:'€300–1.200',  fit:85, logo:'🎨', color:'#8B5CF6', type:'Brand Deal',  desc:'Design-Tools & Templates' },
  { id:'b4', name:'CloudHost DE',    niche:'Tech',     budget:'€400–1.500',  fit:91, logo:'☁️', color:'#3B82F6', type:'Affiliate',   desc:'DACH Hosting Partner' },
  { id:'b5', name:'LearnNow',        niche:'Education',budget:'€150–600',    fit:79, logo:'📚', color:'#F59E0B', type:'Sponsored',   desc:'Online-Kurse & Zertifikate' },
  { id:'b6', name:'GreenBrand DE',   niche:'Lifestyle', budget:'€250–900',   fit:83, logo:'🌱', color:'#10B981', type:'Brand Deal',  desc:'Nachhaltige Produkte' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const score = parseInt(searchParams.get('score') || '84');
  const niche = searchParams.get('niche') || 'Tech';

  // Filter and sort by fit
  const matches = BRANDS
    .filter(b => b.fit >= Math.max(score - 20, 60))
    .sort((a, b) => b.fit - a.fit);

  return NextResponse.json({ brands: matches, totalMatches: matches.length, score });
}

export async function POST(request: NextRequest) {
  const { handle, score, niche } = await request.json();

  const KEY = process.env.PERPLEXITY_API_KEY;

  const prompt = `Creator-Profil: ${handle || '@creator'} · Trust-Score: ${score || 84}/100 · Nische: ${niche || 'Tech'}
  
Empfehle 5 konkrete Brand-Deal-Möglichkeiten für diesen Creator im DACH-Markt 2026.
Format: Name · Typ (Affiliate/Sponsored/Brand Deal) · Budget-Range · Warum es passt
Sprache: Deutsch. Max 200 Wörter.`;

  if (!KEY) {
    return NextResponse.json({
      recommendations: `## 🎯 Brand-Matches für ${handle || '@creator'} · Score ${score || 84}

**1. TechGear Pro** · Affiliate · €500–2.000/Mo
▸ Tech-Nische passt perfekt · 94% Fit-Score · Hohe Konversionsrate

**2. CloudHost DE** · Affiliate · €400–1.500/Mo  
▸ Creator-Tool-Empfehlungen · DACH-Markt · 91% Fit-Score

**3. CreatorFuel** · Sponsored · €200–800/Mo
▸ Lifestyle-Fit · junge Zielgruppe · 88% Fit-Score

**4. DesignKit Studio** · Brand Deal · €300–1.200/Mo
▸ Content-Creation-Tools · direkter Creator-Bezug · 85% Fit

**5. GreenBrand DE** · Brand Deal · €250–900/Mo
▸ Nachhaltigkeits-Trend 2026 · Authentizitäts-Faktor · 83% Fit

**Gesamt-Potenzial: €1.650–6.400/Monat** bei allen 5 aktiven Deals`,
      coinCost: 20,
      mode: 'demo',
    });
  }

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: 'Du bist ein Creator-Economy-Experte für den DACH-Markt. Empfehle passende Brand Deals basierend auf dem Creator-Profil.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500, temperature: 0.7,
    }),
  });
  const d = await res.json();
  return NextResponse.json({ recommendations: d.choices?.[0]?.message?.content || '', coinCost: 20, mode: 'live' });
}
