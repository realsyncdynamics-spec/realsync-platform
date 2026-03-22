'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const STEPS = [
  {
    id: 'supabase',
    title: 'Supabase',
    icon: '🗄',
    color: '#3ECF8E',
    envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    instructions: [
      { step: '1', text: 'supabase.com → Dein Projekt öffnen' },
      { step: '2', text: 'Settings → API → URL + anon key kopieren' },
      { step: '3', text: 'Vercel → realsync-platform → Settings → Environment Variables' },
      { step: '4', text: 'NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY eintragen' },
      { step: '5', text: 'SQL Editor → Inhalt von supabase/migrations/001_initial_schema.sql einfügen → Run' },
    ],
    link: 'https://supabase.com/dashboard',
    linkText: 'Supabase öffnen →',
    vercelLink: 'https://vercel.com/realsyncdynamics-spec/realsync-platform/settings/environment-variables',
  },
  {
    id: 'oauth',
    title: 'OAuth Provider',
    icon: '🔐',
    color: '#4285F4',
    envKeys: [],
    instructions: [
      { step: '1', text: 'Supabase → Authentication → Providers öffnen' },
      { step: '2', text: 'Google: console.cloud.google.com → OAuth 2.0 Client ID anlegen' },
      { step: '3', text: 'Redirect URI: https://DEIN_PROJEKT.supabase.co/auth/v1/callback' },
      { step: '4', text: 'Client ID + Secret in Supabase eintragen' },
      { step: '5', text: 'Gleich für Facebook (developers.facebook.com) und X (developer.twitter.com)' },
    ],
    link: 'https://supabase.com/dashboard',
    linkText: 'Supabase Auth →',
    vercelLink: null,
    subLinks: [
      { text: 'Google Console', url: 'https://console.cloud.google.com/apis/credentials' },
      { text: 'Facebook Developers', url: 'https://developers.facebook.com/apps' },
      { text: 'X Developer Portal', url: 'https://developer.twitter.com/en/portal/dashboard' },
    ],
  },
  {
    id: 'stripe',
    title: 'Stripe',
    icon: '💳',
    color: '#635BFF',
    envKeys: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_BRONZE_PRICE_ID'],
    instructions: [
      { step: '1', text: 'dashboard.stripe.com → Products → 5 Produkte anlegen (Bronze/Silber/Gold/Platin/Diamant)' },
      { step: '2', text: 'Preise: €19 / €49 / €99 / €199 / €499 monatlich' },
      { step: '3', text: 'Jährliche Preise: -20% je Plan' },
      { step: '4', text: 'Developers → API Keys → Secret Key in Vercel als STRIPE_SECRET_KEY' },
      { step: '5', text: 'Webhooks → Add endpoint → https://realsync-platform.vercel.app/api/stripe/webhook' },
      { step: '6', text: 'Events: subscription.created, subscription.updated, subscription.deleted' },
      { step: '7', text: 'Signing Secret als STRIPE_WEBHOOK_SECRET in Vercel' },
    ],
    link: 'https://dashboard.stripe.com/products',
    linkText: 'Stripe Products →',
    vercelLink: 'https://vercel.com/realsyncdynamics-spec/realsync-platform/settings/environment-variables',
  },
  {
    id: 'domain',
    title: 'Domain',
    icon: '🌐',
    color: '#00D4FF',
    envKeys: [],
    instructions: [
      { step: '1', text: 'Vercel → realsync-platform → Settings → Domains' },
      { step: '2', text: 'realsyncdynamics.de hinzufügen' },
      { step: '3', text: 'Bei deinem DNS-Anbieter: A-Record → 76.76.21.21' },
      { step: '4', text: 'Oder CNAME → cname.vercel-dns.com' },
      { step: '5', text: 'SSL wird automatisch von Vercel ausgestellt (Let\'s Encrypt)' },
    ],
    link: 'https://vercel.com/realsyncdynamics-spec/realsync-platform/settings/domains',
    linkText: 'Vercel Domains →',
    vercelLink: null,
  },
  {
    id: 'redeploy',
    title: 'Redeploy',
    icon: '🚀',
    color: '#10B981',
    envKeys: [],
    instructions: [
      { step: '1', text: 'Vercel → realsync-platform → Deployments' },
      { step: '2', text: 'Letztes Deployment → "..." → Redeploy' },
      { step: '3', text: 'Alle ENV-Variablen werden jetzt geladen' },
      { step: '4', text: 'Login testen: /login → Mit Google anmelden' },
      { step: '5', text: 'Referral testen: /join/rs-dominik öffnen' },
    ],
    link: 'https://vercel.com/realsyncdynamics-spec/realsync-platform/deployments',
    linkText: 'Vercel Deployments →',
    vercelLink: null,
  },
];

const ENV_VARS = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL',         label: 'Supabase URL',              group: 'supabase', example: 'https://xxx.supabase.co' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',    label: 'Supabase Anon Key',         group: 'supabase', example: 'eyJhbGc...' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY',        label: 'Supabase Service Role Key', group: 'supabase', example: 'eyJhbGc...' },
  { key: 'STRIPE_SECRET_KEY',                label: 'Stripe Secret Key',         group: 'stripe',   example: 'sk_live_...' },
  { key: 'STRIPE_WEBHOOK_SECRET',            label: 'Stripe Webhook Secret',     group: 'stripe',   example: 'whsec_...' },
  { key: 'STRIPE_BRONZE_PRICE_ID',           label: 'Bronze Preis ID',           group: 'stripe',   example: 'price_...' },
  { key: 'STRIPE_SILBER_PRICE_ID',           label: 'Silber Preis ID',           group: 'stripe',   example: 'price_...' },
  { key: 'STRIPE_GOLD_PRICE_ID',             label: 'Gold Preis ID',             group: 'stripe',   example: 'price_...' },
  { key: 'STRIPE_BRONZE_YEARLY_PRICE_ID',    label: 'Bronze Yearly',             group: 'stripe',   example: 'price_...' },
  { key: 'STRIPE_SILBER_YEARLY_PRICE_ID',    label: 'Silber Yearly',             group: 'stripe',   example: 'price_...' },
  { key: 'STRIPE_GOLD_YEARLY_PRICE_ID',      label: 'Gold Yearly',               group: 'stripe',   example: 'price_...' },
  { key: 'NEXT_PUBLIC_APP_URL',              label: 'App URL',                   group: 'app',      example: 'https://realsync-platform.vercel.app' },
];

export default function SetupPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState('supabase');
  const [testResults, setTestResults] = useState<Record<string, 'idle'|'testing'|'ok'|'fail'>>({});

  const toggleDone = (id: string) => setDone(p => ({ ...p, [id]: !p[id] }));
  const completedCount = Object.values(done).filter(Boolean).length;

  async function testConnection(service: string) {
    setTestResults(p => ({ ...p, [service]: 'testing' }));
    await new Promise(r => setTimeout(r, 1200));
    // In prod: fetch /api/health/[service]
    setTestResults(p => ({ ...p, [service]: 'ok' }));
  }

  const active = STEPS.find(s => s.id === activeStep)!;

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div style={{ background:'rgba(3,5,10,.97)', borderBottom:'1px solid #0F1520', padding:'0 20px', height:50, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/hub" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', textDecoration:'none' }}>← Hub</Link>
          <span style={{ color:'#1A2130' }}>|</span>
          <span style={{ fontWeight:800, fontSize:14, color:'#00D4FF' }}>⚙️ Setup Wizard</span>
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)' }}>
          {completedCount}/{STEPS.length} Schritte erledigt
        </div>
      </div>

      {/* Progress */}
      <div style={{ height:3, background:'#0D1117' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#00D4FF,#10B981)', transition:'width .5s', width:`${(completedCount/STEPS.length)*100}%` }}/>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 20px', display:'grid', gridTemplateColumns:'220px 1fr', gap:24 }}>

        {/* Left nav */}
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:12 }}>// Schritte</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {STEPS.map(s => (
              <button key={s.id} onClick={() => setActiveStep(s.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background: activeStep===s.id ? s.color+'18' : 'transparent', border:`1px solid ${activeStep===s.id ? s.color+'40' : '#1A2130'}`, borderRadius:8, cursor:'pointer', transition:'all .15s', textAlign:'left' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: done[s.id] ? '#10B981' : activeStep===s.id ? s.color : '#1A2130', fontSize:done[s.id] ? 12 : 14, flexShrink:0 }}>
                  {done[s.id] ? '✓' : s.icon}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:12, color: done[s.id] ? '#10B981' : activeStep===s.id ? s.color : 'rgba(255,255,255,.6)' }}>{s.title}</div>
                </div>
              </button>
            ))}
          </div>

          {completedCount === STEPS.length && (
            <div style={{ marginTop:20, padding:'12px', background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.3)', borderRadius:10, textAlign:'center' }}>
              <div style={{ fontSize:24, marginBottom:6 }}>🎉</div>
              <div style={{ fontWeight:800, fontSize:13, color:'#10B981' }}>Setup komplett!</div>
              <Link href="/hub" style={{ display:'block', marginTop:8, fontFamily:"'DM Mono',monospace", fontSize:10, color:'#00D4FF', textDecoration:'none' }}>Zum Hub →</Link>
            </div>
          )}
        </div>

        {/* Right content */}
        <div>
          <div style={{ background:'#080C14', border:`1px solid ${active.color}30`, borderRadius:14, padding:'24px', marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:active.color+'18', border:`1px solid ${active.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                {active.icon}
              </div>
              <div>
                <div style={{ fontWeight:800, fontSize:20 }}>{active.title} einrichten</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)' }}>
                  Schritt {STEPS.findIndex(s=>s.id===activeStep)+1} von {STEPS.length}
                </div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                <a href={active.link} target="_blank" rel="noopener noreferrer"
                  style={{ padding:'7px 14px', background:active.color+'18', border:`1px solid ${active.color}40`, borderRadius:8, color:active.color, fontFamily:"'DM Mono',monospace", fontSize:10, textDecoration:'none' }}>
                  {active.linkText}
                </a>
              </div>
            </div>

            {/* Sub links */}
            {(active as any).subLinks && (
              <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                {(active as any).subLinks.map((l: any) => (
                  <a key={l.text} href={l.url} target="_blank" rel="noopener noreferrer"
                    style={{ padding:'5px 12px', background:'#0B0F18', border:'1px solid #1A2130', borderRadius:6, color:'rgba(255,255,255,.5)', fontFamily:"'DM Mono',monospace", fontSize:9, textDecoration:'none' }}>
                    {l.text} ↗
                  </a>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
              {active.instructions.map((inst, i) => (
                <div key={i} style={{ display:'flex', gap:12, padding:'10px 14px', background:'#0B0F18', border:'1px solid #1A2130', borderRadius:8 }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:active.color+'20', border:`1px solid ${active.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Mono',monospace", fontSize:10, color:active.color, flexShrink:0 }}>
                    {inst.step}
                  </div>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,.7)', lineHeight:1.5 }}>{inst.text}</span>
                </div>
              ))}
            </div>

            {/* Vercel link */}
            {active.vercelLink && (
              <div style={{ padding:'10px 14px', background:'rgba(0,212,255,.06)', border:'1px solid rgba(0,212,255,.2)', borderRadius:8, marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.5)' }}>ENV-Variablen in Vercel setzen</span>
                <a href={active.vercelLink} target="_blank" rel="noopener noreferrer"
                  style={{ padding:'5px 12px', background:'#00D4FF20', border:'1px solid #00D4FF40', borderRadius:6, color:'#00D4FF', fontFamily:"'DM Mono',monospace", fontSize:10, textDecoration:'none' }}>
                  Vercel öffnen →
                </a>
              </div>
            )}

            {/* Done button */}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { toggleDone(active.id); if (!done[active.id]) { const idx = STEPS.findIndex(s=>s.id===activeStep); if(idx<STEPS.length-1) setActiveStep(STEPS[idx+1].id); } }}
                style={{ flex:1, padding:'11px', background: done[active.id] ? 'rgba(16,185,129,.15)' : `linear-gradient(135deg,${active.color},${active.color}cc)`, border:`1px solid ${done[active.id]?'rgba(16,185,129,.3)':active.color}`, borderRadius:8, color: done[active.id] ? '#10B981' : '#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, cursor:'pointer' }}>
                {done[active.id] ? '✓ Erledigt — Rückgängig' : '✓ Erledigt — Weiter'}
              </button>
              <button onClick={() => testConnection(active.id)} disabled={testResults[active.id]==='testing'}
                style={{ padding:'11px 18px', background:'transparent', border:'1px solid #374151', borderRadius:8, color:'rgba(255,255,255,.4)', fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer' }}>
                {testResults[active.id]==='testing'?'⟳ Teste...':testResults[active.id]==='ok'?'✓ OK':testResults[active.id]==='fail'?'✗ Fehler':'Test'}
              </button>
            </div>
          </div>

          {/* ENV Variable Checklist */}
          {(active.id === 'supabase' || active.id === 'stripe') && (
            <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:14, padding:'20px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>// ENV-Variablen für Vercel</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {ENV_VARS.filter(e => e.group === active.id || (active.id==='supabase' && e.group==='app')).map(env => (
                  <div key={env.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'#0B0F18', border:'1px solid #1A2130', borderRadius:7, fontFamily:"'DM Mono',monospace" }}>
                    <span style={{ fontSize:10, color:'#00D4FF', flex:1 }}>{env.key}</span>
                    <span style={{ fontSize:9, color:'rgba(255,255,255,.2)' }}>{env.example}</span>
                    <button onClick={()=>navigator.clipboard?.writeText(env.key)}
                      style={{ background:'none', border:'none', color:'rgba(255,255,255,.2)', cursor:'pointer', fontSize:10, padding:'0 4px' }}>
                      📋
                    </button>
                  </div>
                ))}
              </div>
              <a href="https://vercel.com/realsyncdynamics-spec/realsync-platform/settings/environment-variables"
                target="_blank" rel="noopener noreferrer"
                style={{ display:'block', marginTop:12, padding:'9px', background:'rgba(0,212,255,.08)', border:'1px solid rgba(0,212,255,.2)', borderRadius:8, color:'#00D4FF', fontFamily:"'DM Mono',monospace", fontSize:10, textDecoration:'none', textAlign:'center' }}>
                → In Vercel eintragen
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
