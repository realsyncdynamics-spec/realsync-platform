'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PLAN_ORDER, PLANS, PlanId, FEATURE_MATRIX, ALL_PLANS_LIST, formatLimit } from '@/lib/plans';

function Check({on,color}:{on:boolean;color:string}) {
  return on
    ? <span style={{color}} className="font-black text-base">✓</span>
    : <span className="text-gray-700">✗</span>;
}

function PricingContent() {
  const searchParams = useSearchParams();
  const app = searchParams.get('app') || 'platform';
  const highlight = searchParams.get('highlight') as PlanId | null;
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly');
  const [activePlan, setActivePlan] = useState<PlanId>(highlight || 'silber');

  const PLAN_FEATURES: Record<PlanId, {title:string;items:string[]}[]> = {
    gratis: [
      {title:'Creator-Profil',    items:['Öffentliche Creator-Seite','QR-Code + Barcode','Basis-Verification Badge','realsyncdynamics.de/creator/du']},
      {title:'Limits',            items:['20 Reviews/Monat anzeigen','100 Waitlist-Signups','0 KI-Antworten','Keine Tools']},
    ],
    bronze: [
      {title:'Alle Tools freigeschaltet', items:['KI-Antworten (50/Mo)','Plattform-Sync (3 Plattformen)','Alert-Einstellungen','Export (3/Mo)','Smart Retry (10/Mo)','Embed-Widget']},
      {title:'Verifikation',      items:['Unsichtbares Wasserzeichen','Bronze Creator Badge']},
      {title:'Social Media',      items:['3 Plattformen verbinden','Feed-Anzeige','Follower-Stats']},
      {title:'Workflows',         items:['3 aktive Workflows']},
    ],
    silber: [
      {title:'Alle Bronze Features +',items:['KI-Antworten (500/Mo)','Bulk-Antworten & Bulk-Retry','KI-Trend-Analyse & Sentiment','Milestone-Konfiguration']},
      {title:'Verifikation+',     items:['Polygon Blockchain Zeitstempel','Silber Creator Badge']},
      {title:'Social Media',      items:['5 Plattformen verbinden']},
      {title:'Workflows',         items:['10 aktive Workflows','Erweiterte Automation']},
      {title:'Profil',            items:['Custom Design & Themes','Prioritäts-Support']},
    ],
    gold: [
      {title:'Alle Silber Features +',items:['KI-Antworten (2.000/Mo)','Automation & Auto-Workflows','Launch Sequence (WaitlistKit)','Churn Prediction KI (14 Tage früher)','Auto-Posting auf alle Plattformen']},
      {title:'Verifikation+',     items:['C2PA 2.3 Standard (EU AI Act)','Gold Creator Badge']},
      {title:'Social Media',      items:['Alle 6 Plattformen','Auto-Posting aktiviert']},
      {title:'Workflows',         items:['Unbegrenzte Workflows','Custom Webhooks']},
      {title:'Website',           items:['Eigene Creator-Website','Team bis 5 Mitglieder']},
    ],
    platin: [
      {title:'Alle Gold Features +',items:['KI-Antworten (10.000/Mo)','Unbegrenzte API-Aufrufe','White-Label Plattform','Custom Domain (dein-name.de)','Social Media Webhooks']},
      {title:'Verifikation+',     items:['Polygon NFT-Badge','Platin Creator Badge']},
      {title:'Team',              items:['25 Mitglieder','Slack-Support','SLA 99.9%']},
    ],
    diamant: [
      {title:'Alles aus Platin +', items:['Unbegrenzte KI-Aktionen','Dedicated Account Manager','Custom KI-Training','On-Premise Option','Custom App (iOS/Android)']},
      {title:'Enterprise',        items:['Unbegrenzte Nutzer','SLA 99.99%','Rechtliche Absicherung','Custom Entwicklung']},
    ],
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* HEADER */}
      <div className="border-b border-gray-800 px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-base text-cyan-400">Pakete & Preise</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full p-1">
          <button onClick={()=>setBilling('monthly')}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={billing==='monthly'?{background:'white',color:'black'}:{color:'#6B7280'}}>Monatlich</button>
          <button onClick={()=>setBilling('yearly')}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={billing==='yearly'?{background:'white',color:'black'}:{color:'#6B7280'}}>
            Jährlich <span className="ml-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center py-12 px-5">
        <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">// 6 Pakete · Gratis bis Enterprise</div>
        <h1 className="text-4xl font-black mb-3">
          Gratis starten. <span style={{background:'linear-gradient(90deg,#00D4FF,#C9A84C)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Skalieren wenn bereit.</span>
        </h1>
        <p className="text-gray-400 text-sm">Tools ab Bronze · KI-Analytics ab Silber · Automation ab Gold · Kein Vertrag · Jederzeit kündbar</p>
      </div>

      {/* PLAN CARDS */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-12">
          {ALL_PLANS_LIST.map(p=>{
            const price = billing==='monthly'?p.price.monthly:p.price.yearly;
            const isActive = activePlan===p.id;
            const isHighlight = highlight===p.id;
            return (
              <div key={p.id} onClick={()=>setActivePlan(p.id)}
                className="rounded-2xl border cursor-pointer transition-all hover:translate-y-[-4px]"
                style={{
                  borderColor: isActive||isHighlight ? p.color : '#1F2937',
                  background: isActive ? `linear-gradient(160deg,${p.color}12,#0B0F18)` : '#0B0F18',
                  boxShadow: isActive ? `0 0 30px ${p.color}22` : 'none',
                  position:'relative',
                }}>
                {isHighlight && !isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{background:p.color,color:'#000'}}>EMPFOHLEN</div>
                )}
                <div className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-1" style={{animation:isActive?'none':'none'}}>{p.emoji}</div>
                    <div className="font-black text-sm" style={{color:p.color}}>{p.name}</div>
                    <div className="mt-2">
                      {price===0
                        ?<div className="text-2xl font-black">Gratis</div>
                        :<><span className="text-2xl font-black">€{price}</span><span className="text-gray-500 text-xs">/Mo</span></>}
                      {billing==='yearly'&&price>0&&<div className="text-green-400 text-xs mt-0.5">-20%</div>}
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="bg-black/30 rounded-lg p-2.5 mb-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">KI-Antworten</span>
                      <span className="font-bold" style={{color:p.color}}>{formatLimit(p.limits.aiReplies)}/Mo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Workflows</span>
                      <span className="font-bold text-white">{formatLimit(p.limits.workflows)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Plattformen</span>
                      <span className="font-bold text-white">{p.limits.platforms===0?'—':p.limits.platforms}/6</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Tools</span>
                      <span className="font-bold" style={{color:p.features.dashboardTools?'#00C853':'#EF4444'}}>
                        {p.features.dashboardTools?'✓ Alle':'🔒 Keine'}
                      </span>
                    </div>
                  </div>

                  {/* Feature Flags */}
                  <div className="space-y-1 mb-4">
                    {[
                      ['Dashboard Tools', p.features.dashboardTools],
                      ['Wasserzeichen', p.features.watermark],
                      ['Blockchain', p.features.blockchainTimestamp],
                      ['C2PA 2.3', p.features.c2pa],
                      ['Bulk-Aktionen', p.features.bulkActions],
                      ['Automation', p.features.automation],
                      ['Custom Domain', p.features.customDomain],
                      ['White-Label', p.features.whiteLabel],
                    ].map(([l,on])=>(
                      <div key={l as string} className="flex items-center gap-1.5 text-xs">
                        <span style={{color:on?'#00C853':'#374151'}}>{on?'✓':'✗'}</span>
                        <span style={{color:on?'#9CA3AF':'#374151'}}>{l as string}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={price===0?'/register':`/checkout?plan=${p.id}&billing=${billing}&app=${app}`}
                    className="block text-center py-2 rounded-lg text-xs font-black transition-all hover:opacity-90"
                    style={{background:isActive?p.color:'transparent',border:`1px solid ${p.color}`,color:isActive?'#000':p.color}}>
                    {price===0?'Kostenlos starten':isActive?'Jetzt auswählen →':`${p.name} wählen`}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL VIEW für ausgewählten Plan */}
        {activePlan && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gray-900 border rounded-2xl overflow-hidden"
              style={{borderColor:PLANS[activePlan].color+'40'}}>
              <div className="px-6 py-5 border-b" style={{borderColor:PLANS[activePlan].color+'20',background:PLANS[activePlan].color+'08'}}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{PLANS[activePlan].emoji}</span>
                  <div>
                    <div className="font-black text-xl" style={{color:PLANS[activePlan].color}}>{PLANS[activePlan].name}</div>
                    <div className="text-sm text-gray-400">{PLANS[activePlan].tagline}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-black text-2xl">
                      {PLANS[activePlan].price.monthly===0?'Gratis':`€${billing==='monthly'?PLANS[activePlan].price.monthly:PLANS[activePlan].price.yearly}/Mo`}
                    </div>
                    {billing==='yearly'&&PLANS[activePlan].price.monthly>0&&(
                      <div className="text-xs text-green-400">-20% jährlich · €{PLANS[activePlan].price.yearly*12}/Jahr</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {(PLAN_FEATURES[activePlan]||[]).map(section=>(
                  <div key={section.title}>
                    <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{color:PLANS[activePlan].color}}>// {section.title}</div>
                    <div className="space-y-1.5">
                      {section.items.map(item=>(
                        <div key={item} className="flex items-center gap-2 text-sm">
                          <span style={{color:PLANS[activePlan].color}} className="text-xs">▸</span>
                          <span className="text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEATURE MATRIX */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center font-black text-lg mb-6 text-gray-300">Vollständiger Feature-Vergleich</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
            <table className="w-full" style={{minWidth:700}}>
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-xs font-mono text-gray-500 font-normal">Feature</th>
                  {ALL_PLANS_LIST.map(p=>(
                    <th key={p.id} className="p-4 text-center font-black text-xs" style={{color:p.color}}>{p.emoji} {p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* KI Limits */}
                <tr className="border-b border-gray-800 bg-gray-800/20">
                  <td colSpan={7} className="px-4 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">— Limits</td>
                </tr>
                {([
                  ['KI-Antworten/Mo','aiReplies'],
                  ['Workflows aktiv','workflows'],
                  ['Plattformen','platforms'],
                  ['Retries/Mo','churnRetries'],
                  ['Signups','waitlistSignups'],
                ] as [string, keyof typeof PLANS.gratis.limits][]).map(([label, key])=>(
                  <tr key={label} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                    <td className="p-3 text-sm text-gray-400 pl-4">{label}</td>
                    {ALL_PLANS_LIST.map(p=>(
                      <td key={p.id} className="p-3 text-center text-xs font-bold font-mono" style={{color:p.color}}>
                        {formatLimit(p.limits[key])}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Feature Flags */}
                <tr className="border-b border-gray-800 bg-gray-800/20">
                  <td colSpan={7} className="px-4 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">— Features</td>
                </tr>
                {FEATURE_MATRIX.map(({feature,label})=>(
                  <tr key={label} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                    <td className="p-3 text-sm text-gray-400 pl-4">{label}</td>
                    {ALL_PLANS_LIST.map(p=>(
                      <td key={p.id} className="p-3 text-center">
                        <Check on={p.features[feature]} color={p.color}/>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          {['🔒 DSGVO-konform','🇩🇪 Server in Deutschland','↩ Jederzeit kündbar','💬 Kein Vertrag','⚡ Sofort aktiv','🛡 EU AI Act ready'].map(t=>(
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage(){
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Lädt…</div>}>
      <PricingContent/>
    </Suspense>
  );
}
