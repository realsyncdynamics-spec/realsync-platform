import { NextRequest, NextResponse } from 'next/server';

const PERSPECTIVES = [
  { id:'strategist', name:'Stratege',      icon:'🎯', color:'#00D4FF', model:'sonar-pro',
    role:'Fokus auf strategische Wachstumsmöglichkeiten, Marktpositionierung und langfristige Vision. Sei präzise und datengetrieben. Max 120 Wörter.' },
  { id:'creator',    name:'Creator Expert', icon:'🎬', color:'#C9A84C', model:'sonar',
    role:'Fokus auf Creator-Economy, Content-Strategie und Audience-Building. Praktische, sofort umsetzbare Empfehlungen. Max 120 Wörter.' },
  { id:'analyst',    name:'Data Analyst',   icon:'📊', color:'#10B981', model:'sonar',
    role:'Fokus auf Metriken, KPIs und messbare Ergebnisse. Zahlen-basierte Analyse mit konkreten Benchmarks. Max 120 Wörter.' },
];

const BASE = 'Du bist OPTIMUS — KI-Agent des RealSync Creator OS. Antworte präzise auf Deutsch. Strukturiert, direkt, umsetzbar.';

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  if (!message) return NextResponse.json({ error: 'Nachricht fehlt' }, { status: 400 });

  const KEY = process.env.PERPLEXITY_API_KEY;

  if (!KEY) {
    return NextResponse.json({ council: demoCouncil(message), coinCost: 35, mode:'demo' });
  }

  const results = await Promise.allSettled(
    PERSPECTIVES.map(async p => {
      const res = await fetch('https://api.perplexity.ai/chat/completions', {
        method:'POST',
        headers:{ 'Authorization':`Bearer ${KEY}`, 'Content-Type':'application/json' },
        body: JSON.stringify({
          model: p.model,
          messages:[
            { role:'system', content:`${BASE}\nDeine Rolle: ${p.role}` },
            { role:'user', content: message },
          ],
          max_tokens:400, temperature:0.8, return_citations:true,
        }),
      });
      const d = await res.json();
      return { perspective:p, content:d.choices?.[0]?.message?.content||'', citations:d.citations?.slice(0,2)||[] };
    })
  );

  return NextResponse.json({
    council: results.map((r,i)=>({
      perspective: PERSPECTIVES[i],
      content: r.status==='fulfilled' ? r.value.content : 'Fehler',
      citations: r.status==='fulfilled' ? r.value.citations : [],
    })),
    coinCost: 35,
    mode: 'live',
  });
}

function demoCouncil(msg: string) {
  return [
    { perspective:PERSPECTIVES[0], citations:[],
      content:`**Strategische Analyse:**\n\n▸ **USP**: C2PA-Verifikation + Blockchain als Alleinstellungsmerkmal\n▸ **Wachstum**: B2B-QR als viraler Loop — 1 Creator bringt Ø 3 neue\n▸ **Monetarisierung**: Coins-Ökosystem schafft hohen Lock-in\n\nEmpfehlung: 100 Verified Creator als Showcase → horizontale Expansion DACH.` },
    { perspective:PERSPECTIVES[1], citations:[],
      content:`**Creator-Perspektive:**\n\nCreator brauchen Quick Wins:\n▸ QR-Code in 60 Sekunden live\n▸ "Jemand scannte deinen Code" Push-Notification\n▸ Sichtbarer Coins-Counter als Gamification\n\nBester Hook: "Mein Content ist jetzt offiziell verifiziert — und ich verdiene dabei Geld."` },
    { perspective:PERSPECTIVES[2], citations:[],
      content:`**Data-Analyse:**\n\nCreator Economy Benchmarks 2026:\n▸ Ø CAC via Referral: < €0,50\n▸ QR-Scan-to-Signup Rate: ~2-3%\n▸ Bronze→Gold Upgrade: 12% in 60 Tagen\n\nZiel-Szenario: 500 Creator × €19 = €9.500 MRR. Bei 10% Gold: +€4.000. Break-even bei ~280 zahlenden Creatorn.` },
  ];
}
