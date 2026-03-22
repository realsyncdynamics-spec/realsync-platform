import { NextRequest, NextResponse } from 'next/server';

const SYS = `Du bist OPTIMUS — Creator-Stratege im RealSync OS. Erstelle einen konkreten 7-Tage-Promo-Plan.
Nutze aktuelle Trends (2026, DACH). Format: Tag-für-Tag mit Plattform, Aktion, Ergebnis. Deutsch. Max 280 Wörter.`;

export async function POST(request: NextRequest) {
  const { handle, score, niche, platforms, trustFactors } = await request.json();
  const weak = (trustFactors||[]).filter((f:any)=>f.score<80).map((f:any)=>f.label).join(', ') || 'Engagement-Ratio';

  const prompt = `Creator: ${handle||'@creator'} · Score: ${score||85}/100 · Nische: ${niche||'Tech'} · Plattformen: ${(platforms||['YouTube','TikTok']).join(', ')}
Schwächen: ${weak}
→ Erstelle 7-Tage-Promo-Plan: je Tag Plattform + Aktion + erwartetes Ergebnis + Coins-Potenzial`;

  const KEY = process.env.PERPLEXITY_API_KEY;
  if (!KEY) return NextResponse.json({ plan: demo(handle, score), coinCost:25, mode:'demo' });

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method:'POST', headers:{'Authorization':`Bearer ${KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify({ model:'sonar-pro', messages:[{role:'system',content:SYS},{role:'user',content:prompt}],
      max_tokens:700, temperature:0.7, return_citations:true, search_recency_filter:'week' }),
  });
  const d = await res.json();
  return NextResponse.json({ plan:d.choices?.[0]?.message?.content||'Fehler', citations:d.citations?.slice(0,3)||[], coinCost:25, mode:'live' });
}

function demo(handle:string, score:number) {
  return `## 🚀 7-Tage-Promo-Plan · ${handle||'@creator'} · Score ${score||85}

**Mo · TikTok** — Hook: "KI-Creator-Tools 2026" (Trend +142%)
▸ 15-Sek-Video + Link in Bio → Erwartet: 8K–15K Views, 3–5 Referrals

**Di · YouTube** — Short: "Content in 30 Sek verifiziert"
▸ Demo-Video Trust-Score + C2PA-Badge → +12 Signups

**Mi · Instagram** — Reel + B2B-QR-Code Story
▸ "Scann → 1 Monat gratis" → 5–8 Referrals = +475–760 Coins

**Do · LinkedIn** — Post: "Creator Economy DACH 2026"
▸ Trust-Score als Social Proof → 2–3 Brand-Anfragen

**Fr · YouTube** — Tutorial: "Deepfake-Schutz in 2 Min"
▸ SEO-Keyword hoher Nachfrage → 1.500 Views

**Sa · OPTIMUS** — Reviews beantworten + Engagement-Ratio
▸ ReviewRadar Bulk → Trust-Score +5 Punkte

**So · Analytics** — Wochenrückblick + nächste Woche planen
▸ AnalyticsPro → OPTIMUS → Promo-Plan optimieren`;
}
