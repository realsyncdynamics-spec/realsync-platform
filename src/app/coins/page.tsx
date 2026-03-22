'use client';
import { useState } from 'react';
import Link from 'next/link';

const TRANSACTIONS = [
  { type:'earn',  desc:'Max Müller buchte Bronze',        coins:950,  date:'heute 14:32',   ref:'RS-2026-MMU8K' },
  { type:'earn',  desc:'Lisa Weber buchte Silber',         coins:2450, date:'gestern 09:15', ref:'RS-2026-LWE3K' },
  { type:'spend', desc:'1 Monat Silber eingelöst',         coins:-2400,date:'vor 3 Tagen',   ref:'REDEEM-240322' },
  { type:'earn',  desc:'Tom Schmidt buchte Bronze',        coins:950,  date:'vor 5 Tagen',   ref:'RS-2026-TSC9K' },
  { type:'earn',  desc:'Anna Tech — Referral-Bonus',       coins:475,  date:'vor 7 Tagen',   ref:'RS-2026-ATE1K' },
];

const REDEEM_OPTIONS = [
  { coins:1900, label:'1 Monat Bronze',  value:'€19', popular:false, planId:'bronze' },
  { coins:4900, label:'1 Monat Silber',  value:'€49', popular:true,  planId:'silber' },
  { coins:9900, label:'1 Monat Gold',    value:'€99', popular:false, planId:'gold'   },
  { coins:500,  label:'€5 Rabatt-Code',  value:'€5',  popular:false, planId:'code'   },
];

export default function CoinsPage() {
  const [balance] = useState(4825);
  const [redeemed, setRedeemed] = useState<string|null>(null);
  const [showRedeem, setShowRedeem] = useState(false);

  function redeem(option: typeof REDEEM_OPTIONS[0]) {
    if(balance < option.coins) return;
    setRedeemed(option.label);
    setShowRedeem(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');@keyframes coinSpin{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}.coin{animation:coinSpin 3s linear infinite;display:inline-block}`}</style>

      {/* Header */}
      <div style={{ background:'rgba(3,5,10,.97)', borderBottom:'1px solid #0F1520', padding:'0 20px', height:50, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/hub" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', textDecoration:'none' }}>← Hub</Link>
          <span style={{ color:'#1A2130' }}>|</span>
          <span style={{ fontWeight:800, fontSize:14, color:'#C9A84C' }}>🪙 RealSyncCoins</span>
        </div>
        <Link href="/hub" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)', textDecoration:'none', padding:'4px 10px', border:'1px solid #1A2130', borderRadius:6 }}>← Hub</Link>
      </div>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'32px 20px' }}>

        {/* Balance Card */}
        <div style={{ background:'linear-gradient(135deg, rgba(201,168,76,.15), rgba(0,212,255,.08))', border:'1px solid rgba(201,168,76,.3)', borderRadius:20, padding:'32px', textAlign:'center', marginBottom:28, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(201,168,76,.08), transparent 60%)', pointerEvents:'none' }}/>
          <div style={{ fontSize:52, marginBottom:8 }} className="coin">🪙</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:8 }}>Dein Guthaben</div>
          <div style={{ fontWeight:900, fontSize:56, color:'#C9A84C', lineHeight:1, marginBottom:4 }}>{balance.toLocaleString('de')}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'rgba(255,255,255,.5)' }}>
            RealSyncCoins · entspricht <strong style={{ color:'#C9A84C' }}>€{(balance/100).toFixed(2)}</strong>
          </div>
          <div style={{ marginTop:20, display:'flex', justifyContent:'center', gap:12 }}>
            <button onClick={()=>setShowRedeem(true)}
              style={{ padding:'12px 28px', background:'#C9A84C', border:'none', borderRadius:10, color:'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, cursor:'pointer', letterSpacing:'.04em' }}>
              Coins einlösen →
            </button>
            <Link href={`/join/rs-dominik`}
              style={{ padding:'12px 28px', background:'transparent', border:'1px solid rgba(201,168,76,.4)', borderRadius:10, color:'#C9A84C', fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:'.06em', textDecoration:'none', display:'flex', alignItems:'center' }}>
              + Coins verdienen
            </Link>
          </div>
        </div>

        {/* Success Banner */}
        {redeemed && (
          <div style={{ background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.3)', borderRadius:12, padding:'16px 20px', marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
            <span style={{ fontSize:24 }}>✅</span>
            <div>
              <div style={{ fontWeight:800, color:'#10B981' }}>{redeemed} erfolgreich eingelöst!</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2 }}>Dein Plan wird in wenigen Sekunden aktualisiert.</div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:14, padding:'20px', marginBottom:20 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>// Wie verdiene ich Coins?</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { icon:'🔗', title:'Link teilen', desc:'Teile deinen persönlichen Referral-Link auf YouTube, TikTok, Instagram…', coins:'50% des ersten Pakets' },
              { icon:'📱', title:'QR scannen lassen', desc:'Jemand scannt deinen B2B-QR-Code und registriert sich', coins:'50% als Coins' },
              { icon:'🎁', title:'Neuer User: Bronze gratis', desc:'Wer über deinen Link kommt bekommt 1 Monat Bronze gratis', coins:'Du: 950 Coins' },
            ].map(s=>(
              <div key={s.title} style={{ background:'rgba(201,168,76,.05)', border:'1px solid rgba(201,168,76,.15)', borderRadius:10, padding:'14px' }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontWeight:700, fontSize:13, color:'#C9A84C', marginBottom:4 }}>{s.title}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', lineHeight:1.5, marginBottom:8 }}>{s.desc}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', fontWeight:700 }}>→ {s.coins}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', textAlign:'center' }}>
            <strong style={{ color:'#C9A84C' }}>100 Coins = €1</strong> · Sofort gutgeschrieben · Sofort einlösbar
          </div>
        </div>

        {/* Transaction History */}
        <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:14, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #1A2130' }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.15em', textTransform:'uppercase' }}>// Coin-Verlauf</span>
          </div>
          <div>
            {TRANSACTIONS.map((t,i)=>(
              <div key={i} style={{ padding:'12px 20px', borderBottom:'1px solid #0D1117', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, background: t.type==='earn'?'rgba(16,185,129,.1)':'rgba(239,68,68,.1)', border:`1px solid ${t.type==='earn'?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)'}` }}>
                  {t.type==='earn'?'🪙':'💸'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.75)' }}>{t.desc}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)', marginTop:2 }}>{t.ref} · {t.date}</div>
                </div>
                <div style={{ fontWeight:800, fontSize:15, color: t.type==='earn'?'#10B981':'#EF4444', flexShrink:0, fontFamily:"'DM Mono',monospace" }}>
                  {t.coins>0?'+':''}{t.coins.toLocaleString('de')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Redeem Modal */}
      {showRedeem && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20 }} onClick={()=>setShowRedeem(false)}>
          <div style={{ background:'#080C14', border:'1px solid rgba(201,168,76,.3)', borderRadius:18, padding:'28px', maxWidth:420, width:'100%' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>🪙 Coins einlösen</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:20 }}>
              Guthaben: <strong style={{ color:'#C9A84C' }}>{balance.toLocaleString('de')} Coins</strong>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {REDEEM_OPTIONS.map(opt=>{
                const canAfford = balance >= opt.coins;
                return (
                  <button key={opt.planId} onClick={()=>canAfford&&redeem(opt)} disabled={!canAfford}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background: canAfford?'rgba(201,168,76,.08)':'rgba(255,255,255,.02)', border:`1.5px solid ${canAfford?'rgba(201,168,76,.35)':'#1A2130'}`, borderRadius:10, cursor: canAfford?'pointer':'not-allowed', opacity: canAfford?1:.4, width:'100%', textAlign:'left', transition:'all .15s' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <span style={{ fontWeight:700, fontSize:14, color: canAfford?'#C9A84C':'rgba(255,255,255,.3)' }}>{opt.label}</span>
                        {opt.popular&&<span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, padding:'1px 6px', background:'rgba(0,212,255,.2)', border:'1px solid rgba(0,212,255,.3)', color:'#00D4FF', borderRadius:4 }}>BELIEBT</span>}
                      </div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', marginTop:2 }}>{opt.coins.toLocaleString('de')} Coins · Wert {opt.value}</div>
                    </div>
                    <span style={{ color: canAfford?'#C9A84C':'rgba(255,255,255,.2)', fontSize:14 }}>→</span>
                  </button>
                );
              })}
            </div>
            <button onClick={()=>setShowRedeem(false)} style={{ width:'100%', marginTop:14, padding:'10px', background:'transparent', border:'1px solid #1A2130', borderRadius:8, color:'rgba(255,255,255,.3)', fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer' }}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}
