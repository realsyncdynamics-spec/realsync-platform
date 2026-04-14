'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PLANS, PlanId } from '@/lib/plans';

const APPS = [
  {
    id:'creatorseal', name:'CreatorSeal', icon:'🛡', color:'#C9A84C',
    desc:'Verifikation, QR-Code, Creator-Profil',
    href:'/apps/creatorseal/dashboard',
    stats:[{v:'—',l:'Verifiziert'},{v:'—',l:'Trust Score'},{v:'—',l:'Verify Level'}],
    status:'live', badge:'Flagship',
  },
  {
    id:'reviewradar', name:'ReviewRadar', icon:'⭐', color:'#3B82F6',
    desc:'Review-Management & KI-Antworten',
    href:'/apps/reviewradar/dashboard',
    stats:[{v:'—',l:'Reviews'},{v:'—',l:'Ø Rating'},{v:'—',l:'Offen'}],
    status:'live', badge:null,
  },
  {
    id:'churnrescue', name:'ChurnRescue', icon:'💳', color:'#EF4444',
    desc:'Failed Payments & Win-Back',
    href:'/apps/churnrescue/dashboard',
    stats:[{v:'—',l:'Gerettet'},{v:'—',l:'Recovery'},{v:'—',l:'Offen'}],
    status:'live', badge:null,
  },
  {
    id:'waitlistkit', name:'WaitlistKit', icon:'🚀', color:'#8B5CF6',
    desc:'Viral Waitlist & Referral System',
    href:'/apps/waitlistkit/dashboard',
    stats:[{v:'—',l:'Signups'},{v:'—',l:'Heute'},{v:'—',l:'Via Referral'}],
    status:'live', badge:null,
  },
  {
    id:'adengine', name:'AdEngine', icon:'📺', color:'#FF6888',
    desc:'KI-Werbung für 7 Kanäle',
    href:'/apps/adengine/dashboard',
    stats:[{v:'7',l:'Kanäle'},{v:'KI',l:'Generation'},{v:'DACH',l:'First'}],
    status:'beta', badge:'Beta',
  },
  {
    id:'datacore', name:'DataCore', icon:'📊', color:'#00F0FF',
    desc:'Analytics & BI Dashboard',
    href:'/apps/analyticspro/dashboard',
    stats:[{v:'—',l:'KPIs'},{v:'—',l:'Echtzeit'},{v:'API',l:'Export'}],
    status:'coming-soon', badge:'Bald',
  },
  {
    id:'socialhub', name:'SocialHub', icon:'📱', color:'#80FFC0',
    desc:'Social Media Manager',
    href:'/dashboard/social-accounts',
    stats:[{v:'—',l:'Plattformen'},{v:'—',l:'Encrypted'},{v:'EU',l:'Server'}],
    status:'coming-soon', badge:'Bald',
  },
  {
    id:'optimus', name:'Optimus KI', icon:'🤖', color:'#60D0FF',
    desc:'9 KI-Modelle · Perplexity-First',
    href:'/optimus',
    stats:[{v:'Beta',l:'Modelle'},{v:'Perp.',l:'Primary'},{v:'—',l:'Kosten'}],
    status:'beta', badge:'Beta',
  },
];

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_id: PlanId;
  trust_score: number | null;
  coin_balance: number;
  creator_code: string | null;
  verify_level: number | null;
}

export default function HubPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    // createClient() is called inside useEffect so it never runs during server prerender
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login?next=/hub');
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('id,username,full_name,avatar_url,plan_id,trust_score,coin_balance,creator_code,verify_level')
        .eq('id', user.id)
        .single();
      setProfile(data as Profile | null);
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- router is stable

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#03050A', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', letterSpacing:'.12em' }}>Lädt…</div>
      </div>
    );
  }

  // Profile should always exist after auth, but handle gracefully
  const planId: PlanId = (profile?.plan_id as PlanId) || 'gratis';
  const plan = PLANS[planId];
  const displayName = profile?.full_name || profile?.username || 'Creator';
  const username = profile?.username || '';
  const trustScore = profile?.trust_score ?? null;
  const coinBalance = profile?.coin_balance ?? 0;
  const creatorCode = profile?.creator_code || '—';
  const verifyLevel = profile?.verify_level ?? 1;

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
          {/* Notifications */}
          <button onClick={()=>setNotifOpen(p=>!p)} style={{ position:'relative', background:'#0B0F18', border:'1px solid #1A2130', borderRadius:8, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:14 }}>
            🔔
          </button>

          {/* Plan badge */}
          <Link href="/dashboard/billing" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:8, border:`1px solid ${plan.color}40`, background:plan.color+'12', fontFamily:"'DM Mono',monospace", fontSize:10, color:plan.color, letterSpacing:'.06em', fontWeight:700 }}>
            {plan.emoji} {plan.name}
          </Link>

          {/* Avatar */}
          <Link href="/apps/creatorseal/dashboard" style={{ textDecoration:'none', width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, border:`1.5px solid ${plan.color}60`, background:plan.color+'18' }}>
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={displayName} style={{ width:'100%', height:'100%', borderRadius:6, objectFit:'cover' }}/>
            ) : '🎬'}
          </Link>

          {/* Logout */}
          <button onClick={handleSignOut} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.1em', color:'rgba(255,255,255,.2)', background:'none', border:'1px solid #1A2130', borderRadius:6, padding:'5px 10px', cursor:'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Notification dropdown placeholder */}
      {notifOpen&&(
        <div style={{ position:'fixed', top:58, right:16, width:300, background:'#080C14', border:'1px solid #1A2130', borderRadius:12, zIndex:200, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,.5)' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #1A2130', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:'.12em', textTransform:'uppercase' }}>Benachrichtigungen</span>
            <button onClick={()=>setNotifOpen(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.25)', cursor:'pointer', fontSize:12 }}>✕</button>
          </div>
          <div style={{ padding:'24px 16px', textAlign:'center' }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.25)' }}>Keine neuen Benachrichtigungen</div>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 20px' }}>

        {/* ── CREATOR HEADER ── */}
        <div className="fu" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28, background:'#080C14', border:`1px solid ${plan.color}30`, borderRadius:16, padding:'20px 24px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, right:0, width:300, height:'100%', background:`radial-gradient(ellipse at right, ${plan.color}08, transparent)`, pointerEvents:'none' }}/>
          <div style={{ width:52, height:52, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, border:`2px solid ${plan.color}60`, background:plan.color+'15', flexShrink:0 }}>
            🎬
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
              <span style={{ fontWeight:800, fontSize:20 }}>{displayName}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'2px 8px', background:plan.color+'20', border:`1px solid ${plan.color}50`, color:plan.color, borderRadius:4, letterSpacing:'.08em' }}>{plan.emoji} {plan.name.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)' }}>
              @{username}
              {trustScore !== null && <> · Trust Score: <span style={{ color:'#00C853' }}>{trustScore.toFixed(1)}</span></>}
              {creatorCode !== '—' && <> · <span style={{ color:'rgba(255,255,255,.5)' }}>{creatorCode}</span></>}
            </div>
          </div>
          <div style={{ display:'flex', gap:16, flexShrink:0 }}>
            {[
              { v: trustScore !== null ? trustScore.toFixed(1) : '—', l:'Trust Score' },
              { v: `Lv.${verifyLevel}`, l:'Verify Level' },
              { v: coinBalance.toLocaleString('de-DE'), l:'Coins' },
            ].map(s=>(
              <div key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontWeight:800, fontSize:20, color:plan.color }}>{s.v}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)' }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <Link href="/apps/creatorseal/dashboard" style={{ textDecoration:'none', padding:'8px 14px', borderRadius:8, background:'#0B0F18', border:'1px solid #1A2130', color:'rgba(255,255,255,.5)', fontFamily:"'DM Mono',monospace", fontSize:10 }}>
              🛡 Mein Profil
            </Link>
            <Link href="/dashboard/billing" style={{ textDecoration:'none', padding:'8px 14px', borderRadius:8, background:plan.color, color:'#000', fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:700 }}>
              Upgrade
            </Link>
          </div>
        </div>

        {/* ── APP GRID ── */}
        <div className="fu d2" style={{ marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.15em', textTransform:'uppercase' }}>// Meine Apps</div>
            <Link href="/" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(0,212,255,.5)', textDecoration:'none' }}>Alle Apps ansehen →</Link>
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
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, padding:'1px 5px', background: app.status==='live'?'#10B98115':app.status==='beta'?'#FFD70015':'rgba(255,255,255,.04)', border:`1px solid ${app.status==='live'?'#10B98130':app.status==='beta'?'#FFD70030':'rgba(255,255,255,.1)'}`, color: app.status==='live'?'#10B981':app.status==='beta'?'#FFD700':'rgba(255,255,255,.3)', borderRadius:3 }}>
                        {app.status==='live'?'LIVE':app.status==='beta'?'BETA':'BALD'}
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

          {/* Plan info */}
          <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid #1A2130' }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.12em', textTransform:'uppercase' }}>// Dein Plan</span>
            </div>
            <div style={{ padding:'20px 24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <span style={{ fontSize:32 }}>{plan.emoji}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:18, color:plan.color }}>{plan.name}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', marginTop:2 }}>{plan.tagline}</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                {[
                  { l:'KI-Antworten/Mo', v: plan.limits.aiReplies === -1 ? '∞' : String(plan.limits.aiReplies) },
                  { l:'Plattformen', v: plan.limits.platforms === -1 ? '∞' : String(plan.limits.platforms) },
                  { l:'Workflows', v: plan.limits.workflows === -1 ? '∞' : String(plan.limits.workflows) },
                  { l:'Verify Level', v: String(plan.verifyLevel) },
                ].map(s=>(
                  <div key={s.l} style={{ background:'#0B0F18', borderRadius:8, padding:'10px 12px', border:'1px solid #1A2130' }}>
                    <div style={{ fontWeight:800, fontSize:16, color:plan.color }}>{s.v}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.25)', marginTop:2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {planId !== 'diamant' && (
                <Link href="/dashboard/billing" style={{ textDecoration:'none', display:'block', textAlign:'center', padding:'10px', borderRadius:8, background:plan.color, color:'#000', fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:700 }}>
                  Plan upgraden →
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid #1A2130' }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.12em', textTransform:'uppercase' }}>// Quick Actions</span>
            </div>
            <div style={{ padding:12, display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { icon:'🛡', label:'Content verifizieren', sub:'CreatorSeal · QR + C2PA', color:'#C9A84C', href:'/apps/creatorseal/dashboard' },
                { icon:'⭐', label:'Reviews verwalten', sub:'ReviewRadar · KI-Antworten', color:'#3B82F6', href:'/apps/reviewradar/dashboard' },
                { icon:'💳', label:'Failed Payments', sub:'ChurnRescue · Win-Back', color:'#EF4444', href:'/apps/churnrescue/dashboard' },
                { icon:'🚀', label:'Waitlist starten', sub:'WaitlistKit · Viral Referral', color:'#8B5CF6', href:'/apps/waitlistkit/dashboard' },
                { icon:'⚙️', label:'Einstellungen', sub:'Profil · Passwort · Plan', color:'#6B7280', href:'/dashboard/settings' },
                { icon:'💰', label:'Abonnement', sub:'Billing · Upgrade', color:plan.color, href:'/dashboard/billing' },
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
