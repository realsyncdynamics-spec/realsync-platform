// ============================================================
//  REALSYNC STORE — COMING SOON
//  Creator kann RealSyncCoins hier einlösen
//  Wird als eigene App (iOS + Android) released
//
//  KONZEPT:
//  - Creator sammelt Coins via B2B-Referrals (50% vom 1. Paket)
//  - 100 RealSyncCoins = €1 Guthaben
//  - Einlösbar für: Pakete, digitale Güter, Merch, Services
//  - Eigene App: RealSync Store (iOS/Android)
//
//  WORKFLOW (korrekt):
//  Creator postet QR-Code → Jemand scannt → registriert sich
//  → kauft Paket (z.B. Bronze €19 = 1900 Coins)
//  → Creator bekommt 50% = 950 Coins = €9,50 gutgeschrieben
//  → Creator löst Coins im Store ein
// ============================================================

'use client';
import Link from 'next/link';

const COMING_SOON_PRODUCTS = [
  { icon:'📦', name:'RealSync Pakete',     desc:'Bronze · Silber · Gold · Platin',     coins:'1.900 - 49.900', category:'Abos' },
  { icon:'👕', name:'Creator Merch',       desc:'T-Shirts · Hoodies · Caps',           coins:'ab 2.500',       category:'Merch' },
  { icon:'🎓', name:'Creator Masterclass', desc:'Exklusive Video-Kurse',               coins:'ab 5.000',       category:'Digital' },
  { icon:'🔧', name:'Setup Service',       desc:'1:1 Onboarding mit RealSync Team',    coins:'10.000',         category:'Service' },
  { icon:'🏆', name:'Creator Badge NFT',   desc:'Polygon NFT — Verified Creator',      coins:'25.000',         category:'NFT' },
  { icon:'📱', name:'Priority Feature',    desc:'Dein Wunsch-Feature wird gebaut',     coins:'50.000',         category:'Premium' },
];

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div style={{ background:'rgba(3,5,10,.97)', borderBottom:'1px solid #0F1520', padding:'0 20px', height:50, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/hub" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', textDecoration:'none' }}>← Hub</Link>
          <span style={{ color:'#1A2130' }}>|</span>
          <span style={{ fontWeight:800, fontSize:14, color:'#C9A84C' }}>🛍 RealSync Store</span>
        </div>
        <Link href="/coins" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', textDecoration:'none', padding:'4px 12px', border:'1px solid rgba(201,168,76,.3)', borderRadius:20 }}>
          🪙 Meine Coins
        </Link>
      </div>

      {/* Hero */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'60px 20px 40px', textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🛍</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', letterSpacing:'.25em', textTransform:'uppercase', marginBottom:12 }}>
          // Coming Soon · iOS + Android App
        </div>
        <h1 style={{ fontWeight:900, fontSize:32, lineHeight:1.2, marginBottom:12 }}>
          RealSync Store
        </h1>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'rgba(255,255,255,.4)', maxWidth:480, margin:'0 auto 32px', lineHeight:1.8 }}>
          Löse deine <span style={{ color:'#C9A84C' }}>RealSyncCoins</span> ein.<br/>
          Pakete · Merch · Kurse · Services · NFTs
        </p>

        {/* Coin Flow Explanation */}
        <div style={{ background:'rgba(201,168,76,.06)', border:'1px solid rgba(201,168,76,.2)', borderRadius:16, padding:'24px', marginBottom:40, textAlign:'left' }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:16 }}>// So verdienst du Coins</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              ['1', '📱', 'Du teilst deinen B2B-QR-Code auf YouTube / TikTok / Instagram'],
              ['2', '👆', 'Jemand scannt oder klickt → landet auf deiner Join-Seite'],
              ['3', '🎁', 'Neue Person registriert sich → bekommt 1 Monat Bronze GRATIS'],
              ['4', '💳', 'Neue Person kauft ein Paket (z.B. Bronze = €19)'],
              ['5', '🪙', 'Du bekommst automatisch 50% = 950 Coins = €9,50 gutgeschrieben'],
              ['6', '🛍', 'Coins im Store einlösen: Pakete, Merch, Kurse und mehr'],
            ].map(([n,i,t]) => (
              <div key={n} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(201,168,76,.2)', border:'1px solid rgba(201,168,76,.4)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', flexShrink:0, marginTop:1 }}>{n}</div>
                <span style={{ fontSize:18, flexShrink:0 }}>{i}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,.65)', lineHeight:1.5 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, padding:'12px 16px', background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.2)', borderRadius:10, fontFamily:"'DM Mono',monospace", fontSize:11, color:'#10B981' }}>
            💡 100 RealSyncCoins = €1 · Sofort gutgeschrieben · Nie verfallen
          </div>
        </div>

        {/* Products Preview */}
        <div style={{ textAlign:'left', marginBottom:40 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:16 }}>// Vorschau Store-Artikel</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
            {COMING_SOON_PRODUCTS.map(p => (
              <div key={p.name} style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, padding:'16px', opacity:.7, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:8, right:8, fontFamily:"'DM Mono',monospace", fontSize:8, padding:'2px 6px', background:'rgba(107,114,128,.2)', border:'1px solid #374151', color:'#6B7280', borderRadius:4 }}>
                  BALD
                </div>
                <div style={{ fontSize:24, marginBottom:8 }}>{p.icon}</div>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{p.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', marginBottom:8 }}>{p.desc}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#C9A84C', fontWeight:700 }}>🪙 {p.coins} Coins</div>
              </div>
            ))}
          </div>
        </div>

        {/* App Waitlist */}
        <div style={{ background:'linear-gradient(135deg, rgba(201,168,76,.1), rgba(0,212,255,.06))', border:'1px solid rgba(201,168,76,.25)', borderRadius:16, padding:'28px' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📱</div>
          <h2 style={{ fontWeight:800, fontSize:20, marginBottom:6 }}>RealSync Store App</h2>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:'rgba(255,255,255,.4)', marginBottom:20 }}>
            Native iOS + Android App · Coins verwalten · Einkaufen · Push-Benachrichtigungen
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/apps/waitlistkit/dashboard"
              style={{ padding:'10px 24px', background:'#C9A84C', borderRadius:10, color:'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, textDecoration:'none' }}>
              🚀 Launch-Waitlist beitreten
            </Link>
            <Link href="/coins"
              style={{ padding:'10px 20px', background:'transparent', border:'1px solid rgba(201,168,76,.35)', borderRadius:10, color:'#C9A84C', fontFamily:"'DM Mono',monospace", fontSize:11, textDecoration:'none' }}>
              🪙 Meine Coins ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
