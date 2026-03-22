'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PLANS, PlanId } from '@/lib/plans';

const CREATOR = {
  name: 'Dominik Steiner',
  username: 'dominik_steiner',
  plan: 'gold' as PlanId,
  avatar: '🎬',
  trustScore: 98.2,
  code: 'RS-2026-D5T8K1',
  joinDate: 'März 2026',
};

const APPS = [
  {
    id:'creatorseal', name:'CreatorSeal', icon:'🛡', color:'#C9A84C',
    desc:'Verifikation, QR-Code, Creator-Profil',
    href:'/apps/creatorseal/dashboard',
    stats:[{v:'142',l:'Verifiziert'},{v:'98.2',l:'Trust Score'},{v:'5/6',l:'Verify Level'}],
    status:'live', badge:'Flagship',
  },
  {
    id:'reviewradar', name:'ReviewRadar', icon:'⭐', color:'#3B82F6',
    desc:'Review-Management & KI-Antworten',
    href:'/apps/reviewradar/dashboard',
    stats:[{v:'6',l:'Reviews'},{v:'3.3★',l:'Ø Rating'},{v:'4',l:'Offen'}],
    status:'live', badge:null,
  },
  {
    id:'churnrescue', name:'ChurnRescue', icon:'💳', color:'#EF4444',
    desc:'Failed Payments & Win-Back',
    href:'/apps/churnrescue/dashboard',
    stats:[{v:'€328',l:'Gerettet'},{v:'72%',l:'Recovery'},{v:'3',l:'Offen'}],
    status:'live', badge:null,
  },
  {
    id:'waitlistkit', name:'WaitlistKit', icon:'🚀', color:'#8B5CF6',
    desc:'Viral Waitlist & Referral System',
    href:'/apps/waitlistkit/dashboard',
    stats:[{v:'847',l:'Signups'},{v:'+23',l:'Heute'},{v:'68%',l:'Via Referral'}],
    status:'live', badge:null,
  },
  {
    id:'adengine', name:'AdEngine', icon:'📺', color:'#FF6888',
    desc:'KI-Werbung für 7 Kanäle',
    href:'/',
    stats:[{v:'7',l:'Kanäle'},{v:'KI',l:'Generation'},{v:'DACH',l:'First'}],
    status:'beta', badge:null,
  },
  {
    id:'datacore', name:'DataCore', icon:'📊', color:'#00F0FF',
    desc:'Analytics & BI Dashboard',
    href:'/',
    stats:[{v:'∞',l:'KPIs'},{v:'Live',l:'Echtzeit'},{v:'API',l:'Export'}],
    status:'live', badge:null,
  },
  {
    id:'socialhub', name:'SocialHub', icon:'📱', color:'#80FFC0',
    desc:'Social Media Manager',
    href:'/',
    stats:[{v:'6',l:'Plattformen'},{v:'E2E',l:'Encrypted'},{v:'EU',l:'Server'}],
    status:'live', badge:null,
  },
  {
    id:'optimus', name:'Optimus KI', icon:'🤖', color:'#60D0FF',
    desc:'9 KI-Modelle · Perplexity-First',
    href:'/',
    stats:[{v:'9',l:'Modelle'},{v:'Perp.',l:'Primary'},{v:'€0',l:'Kosten'}],
    status:'live', badge:null,
  },
];

const RECENT_ACTIVITY = [
  { icon:'⭐', app:'ReviewRadar', text:'Neue 1★ Review von Peter W.', time:'vor 8h', color:'#EF4444', urgent:true },
  { icon:'💳', app:'ChurnRescue', text:'StartupHub GmbH — €99 Retry geplant', time:'vor 2h', color:'#3B82F6', urgent:false },
  { icon:'🚀', app:'WaitlistKit', text:'max@startup.de — +12 neue Referrals', time:'vor 5 Min', color:'#8B5CF6', urgent:false },
  { icon:'🛡', app:'CreatorSeal', text:'Neuer Content verifiziert · SHA-256 OK', time:'vor 1 Min', color:'#C9A84C', urgent:false },
  { icon:'🚀', app:'WaitlistKit', text:'Signup #848 — via Twitter', time:'vor 3 Min', color:'#8B5CF6', urgent:false },
];

export default function HubPage() {
  const plan = PLANS[CREATOR.plan];
  const [notifOpen, setNotifOpen] = useState(false);

  const totalFollowers = '61.4K';

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .4s cubic-bezier(.34,1.56,.64,1) both}.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}.d7{animation-delay:.35s}.d8{animation-delay:.4s}`}</style>

      {/* ── TOP NAV ── */}
      <nav style={{ background:'rgba(3,5,10,.97)', borderBottom:'1px solid #0F1520', padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(20px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:7, textDecoration:'none' }}>
            <div style={{ width:13, height:13, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}>
              <div style={{ position:'absolute', inset:2.5, background:'#C9A84C' }}/>
            </div>
            <span style={{ fontWeight:800, fontSize:13, color:'#E4E6EF' }}>RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span></span>
          </Link>
          <span style={{ color:'#1A2130', fontSize:13 }}>|</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.08em' }}>Creator Hub</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Live indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'#0B0F18', border:'1px solid #1A2130', borderRadius:20, padding:'4px 10px' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#00FF88', animation:'pulse 1.2s ease infinite' }}/>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)' }}>Live</span>
          </div>

          {/* Notifications */}
          <button onClick={()=>setNotifOpen(p=>!p)} style={{ position:'relative', background:'#0B0F18', border:'1px solid #1A2130', borderRadius:8, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:14 }}>
            🔔
            <span style={{ position:'absolute', top:5, right:5, width:7, height:7, background:'#EF4444', borderRadius:'50%', border:'1.5px solid #03050A' }}/>
          </button>

          {/* Plan badge */}
          <Link href="/pricing" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:8, border:`1px solid ${plan.color}40`, background:plan.color+'12', fontFamily:"'DM Mono',monospace", fontSize:10, color:plan.color, letterSpacing:'.06em', fontWeight:700 }}>
            {plan.emoji} {plan.name}
          </Link>

          {/* Avatar */}
          <Link href="/apps/creatorseal/dashboard" style={{ textDecoration:'none', width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, border:`1.5px solid ${plan.color}60`, background:plan.color+'18' }}>
            {CREATOR.avatar}
          </Link>

          {/* Logout */}
          <Link href="/login" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.1em', color:'rgba(255,255,255,.2)', textDecoration:'none', padding:'5px 10px', border:'1px solid #1A2130', borderRadius:6 }}>
            Logout
          </Link>
        </div>
      </nav>

      {/* Notification dropdown */}
      {notifOpen&&(
        <div style={{ position:'fixed', top:58, right:16, width:320, background:'#080C14', border:'1px solid #1A2130', borderRadius:12, zIndex:200, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,.5)' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #1A2130', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:'.12em', textTransform:'uppercase' }}>Benachrichtigungen</span>
            <button onClick={()=>setNotifOpen(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.25)', cursor:'pointer', fontSize:12 }}>✕</button>
          </div>
          {RECENT_ACTIVITY.map((a,i)=>(
            <div key={i} style={{ padding:'10px 16px', borderBottom:'1px solid #0D1117', display:'flex', gap:10, alignItems:'flex-start', background:a.urgent?'rgba(239,68,68,.04)':'transparent' }}>
              <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:'rgba(255,255,255,.5)', marginBottom:2 }}>{a.app}</div>
                <div style={{ fontSize:12, color:'#E4E6EF', lineHeight:1.4 }}>{a.text}</div>
              </div>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)', flexShrink:0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 20px' }}>

        {/* ── CREATOR HEADER ── */}
        <div className="fu" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28, background:'#080C14', border:`1px solid ${plan.color}30`, borderRadius:16, padding:'20px 24px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, right:0, width:300, height:'100%', background:`radial-gradient(ellipse at right, ${plan.color}08, transparent)`, pointerEvents:'none' }}/>
          <div style={{ width:52, height:52, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, border:`2px solid ${plan.color}60`, background:plan.color+'15', flexShrink:0 }}>
            {CREATOR.avatar}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
              <span style={{ fontWeight:800, fontSize:20 }}>{CREATOR.name}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'2px 8px', background:plan.color+'20', border:`1px solid ${plan.color}50`, color:plan.color, borderRadius:4, letterSpacing:'.08em' }}>{plan.emoji} {plan.name.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)' }}>@{CREATOR.username} · Trust Score: <span style={{ color:'#00C853' }}>{CREATOR.trustScore}</span> · Code: <span style={{ color:'rgba(255,255,255,.5)' }}>{CREATOR.code}</span></div>
          </div>
          <div style={{ display:'flex', gap:16, flexShrink:0 }}>
            {[{v:totalFollowers,l:'Follower'},{v:'7',l:'Apps aktiv'},{v:'98.2',l:'Trust'}].map(s=>(
              <div key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontWeight:800, fontSize:20, color:plan.color }}>{s.v}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)' }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <Link href="/apps/creatorseal/dashboard" style={{ textDecoration:'none', padding:'8px 14px', borderRadius:8, background:'#0B0F18', border:'1px solid #1A2130', color:'rgba(255,255,255,.5)', fontFamily:"'DM Mono',monospace", fontSize:10, transition:'all .15s' }}>
              🛡 Mein Profil
            </Link>
            <Link href="/pricing" style={{ textDecoration:'none', padding:'8px 14px', borderRadius:8, background:plan.color, color:'#000', fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:700 }}>
              Upgrade
            </Link>
          </div>
        </div>

        {/* ── KPI STRIP ── */}
        <div className="fu d1" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
          {[
            {v:'€2.816',l:'MRR (alle Apps)',c:'#00C853',s:'↑ +12% vs. Vormonat'},
            {v:'847',l:'Waitlist Signups',c:'#8B5CF6',s:'+23 heute · viral'},
            {v:'€328',l:'Revenue gerettet',c:'#3B82F6',s:'ChurnRescue · diese Woche'},
            {v:'4',l:'Offene Reviews',c:'#EF4444',s:'KI-Antwort bereit'},
          ].map(s=>(
            <div key={s.l} style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${s.c}, transparent)` }}/>
              <div style={{ fontWeight:800, fontSize:24, color:s.c, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.35)', margin:'4px 0 3px', letterSpacing:'.08em', textTransform:'uppercase' }}>{s.l}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.25)' }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* ── APP GRID ── */}
        <div className="fu d2" style={{ marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.15em', textTransform:'uppercase' }}>// Meine Apps</div>
            <Link href="/" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(0,212,255,.5)', textDecoration:'none' }}>Alle 16 Apps ansehen →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {APPS.map((app, i) => (
              <Link key={app.id} href={app.href} style={{ textDecoration:'none' }}
                className={`fu d${i+2}`}>
                <div style={{ background:'#080C14', border:`1px solid ${app.color}25`, borderRadius:12, padding:'16px', transition:'all .2s', cursor:'pointer', height:'100%' }}
                  onMouseEnter={e=>{ const t=e.currentTarget; t.style.borderColor=app.color+'50'; t.style.background=app.color+'08'; t.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e=>{ const t=e.currentTarget; t.style.borderColor=app.color+'25'; t.style.background='#080C14'; t.style.transform='translateY(0)'; }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:20 }}>{app.icon}</span>
                      <span style={{ fontWeight:800, fontSize:13, color:app.color }}>{app.name}</span>
                    </div>
                    <div style={{ display:'flex', gap:4 }}>
                      {app.badge&&<span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, padding:'1px 5px', background:app.color+'20', border:`1px solid ${app.color}40`, color:app.color, borderRadius:3 }}>{app.badge}</span>}
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, padding:'1px 5px', background: app.status==='live'?'#10B98115':'#FFD70015', border:`1px solid ${app.status==='live'?'#10B98130':'#FFD70030'}`, color: app.status==='live'?'#10B981':'#FFD700', borderRadius:3 }}>
                        {app.status==='live'?'LIVE':'BETA'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', marginBottom:12, lineHeight:1.4 }}>{app.desc}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4 }}>
                    {app.stats.map(s=>(
                      <div key={s.l} style={{ textAlign:'center', background:'rgba(0,0,0,.3)', borderRadius:6, padding:'5px 3px' }}>
                        <div style={{ fontWeight:800, fontSize:13, color:app.color }}>{s.v}</div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.06em' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="fu d4" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16 }}>

          {/* Recent Activity */}
          <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid #1A2130', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.12em', textTransform:'uppercase' }}>// Live Aktivität</span>
              <Link href="/workflows" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(0,212,255,.5)', textDecoration:'none' }}>⚡ Workflows →</Link>
            </div>
            {RECENT_ACTIVITY.map((a,i)=>(
              <div key={i} style={{ padding:'10px 16px', borderBottom:'1px solid #0D1117', display:'flex', gap:10, alignItems:'center', background: a.urgent?'rgba(239,68,68,.03)':'transparent' }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{a.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:a.color, padding:'1px 5px', background:a.color+'15', borderRadius:3 }}>{a.app}</span>
                    {a.urgent&&<span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'#EF4444', padding:'1px 5px', background:'rgba(239,68,68,.15)', borderRadius:3 }}>DRINGEND</span>}
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.text}</div>
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)', flexShrink:0 }}>{a.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid #1A2130' }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.12em', textTransform:'uppercase' }}>// Quick Actions</span>
            </div>
            <div style={{ padding:12, display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { icon:'🤖', label:'KI-Antwort generieren', sub:'ReviewRadar · 4 offen', color:'#3B82F6', href:'/apps/reviewradar/dashboard' },
                { icon:'💳', label:'Failed Payments retrien', sub:'ChurnRescue · €297 gefährdet', color:'#EF4444', href:'/apps/churnrescue/dashboard' },
                { icon:'🚀', label:'Launch Sequence starten', sub:'WaitlistKit · 847 bereit', color:'#8B5CF6', href:'/apps/waitlistkit/dashboard' },
                { icon:'🛡', label:'Content verifizieren', sub:'CreatorSeal · QR + Blockchain', color:'#C9A84C', href:'/apps/creatorseal/dashboard' },
                { icon:'⚡', label:'Workflow Hub', sub:'12 Workflows · 3 aktiv', color:'#00D4FF', href:'/workflows' },
                { icon:'💎', label:'Plan upgraden', sub:'Gold → Platin · +11 Features', color:'#FFD700', href:'/pricing' },
              ].map(a=>(
                <Link key={a.label} href={a.href} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10, padding:'10px 11px', background:'#0B0F18', border:'1px solid #1A2130', borderRadius:8, transition:'all .15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=a.color+'40';e.currentTarget.style.background=a.color+'08';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#1A2130';e.currentTarget.style.background='#0B0F18';}}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{a.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.75)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.label}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.25)' }}>{a.sub}</div>
                  </div>
                  <span style={{ color:a.color, opacity:.6, fontSize:12, flexShrink:0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
