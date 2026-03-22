'use client';
import { useState } from 'react';
import Link from 'next/link';

const BALANCE  = 3750;
const EARNED   = 5200;
const SPENT    = 1450;

const TRANSACTIONS = [
  {id:1, type:'earn',  amount:+950,  desc:'B2B Referral: @max_creator kaufte Bronze',    date:'heute 14:23',  plan:'bronze'},
  {id:2, type:'earn',  amount:+2450, desc:'B2B Referral: @lisa_startup kaufte Silber',   date:'gestern 09:11',plan:'silber'},
  {id:3, type:'spend', amount:-1900, desc:'Bronze Paket eingelöst (Store)',               date:'20.03. 16:45', plan:null},
  {id:4, type:'earn',  amount:+475,  desc:'B2B Referral: @tom_design kaufte Bronze',     date:'18.03. 11:22', plan:'bronze'},
  {id:5, type:'bonus', amount:+190,  desc:'Willkommensbonus — 1 Monat Bronze gratis',    date:'15.03. 08:00', plan:null},
  {id:6, type:'earn',  amount:+1135, desc:'B2B Referral: @sarah_k kaufte Silber',        date:'12.03. 17:55', plan:'silber'},
];

const TYPE_META: Record<string,{icon:string;c:string;bg:string}> = {
  earn:  {icon:'↑',c:'#10B981',bg:'rgba(16,185,129,.12)'},
  spend: {icon:'↓',c:'#EF4444',bg:'rgba(239,68,68,.12)'},
  bonus: {icon:'🎁',c:'#C9A84C',bg:'rgba(201,168,76,.12)'},
};

// How much more to earn next reward
const NEXT_REWARD = 4900; // Silber
const progress = Math.min((BALANCE / NEXT_REWARD) * 100, 100);

export default function CoinsPage() {
  const [showHow, setShowHow] = useState(false);

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',padding:'0 20px',height:50,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/hub" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>← Hub</Link>
          <span style={{color:'#1A2130'}}>|</span>
          <span style={{fontWeight:800,fontSize:14,color:'#C9A84C'}}>🪙 RealSyncCoins</span>
        </div>
        <Link href="/store" style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'5px 14px',background:'rgba(201,168,76,.15)',border:'1px solid rgba(201,168,76,.35)',borderRadius:8,color:'#C9A84C',textDecoration:'none',fontWeight:700}}>
          🛍 Store →
        </Link>
      </div>

      <div style={{maxWidth:700,margin:'0 auto',padding:'28px 20px'}}>

        {/* Balance Hero */}
        <div style={{background:'#080C14',border:'1px solid rgba(201,168,76,.25)',borderRadius:20,padding:'28px',textAlign:'center',marginBottom:20,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#C9A84C,#FFD700,#C9A84C)'}}/>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(201,168,76,.6)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:10}}>// Dein Guthaben</div>
          <div style={{fontWeight:900,fontSize:48,color:'#C9A84C',lineHeight:1,marginBottom:4}}>{BALANCE.toLocaleString('de')}</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:20}}>RealSyncCoins · ≈ €{(BALANCE/100).toFixed(2)}</div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            {[{v:`+${EARNED.toLocaleString('de')}`,l:'Verdient gesamt',c:'#10B981'},{v:`-${SPENT.toLocaleString('de')}`,l:'Ausgegeben',c:'#EF4444'}].map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,.03)',border:'1px solid #1A2130',borderRadius:10,padding:'10px'}}>
                <div style={{fontWeight:800,fontSize:18,color:s.c}}>{s.v}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Progress to next reward */}
          <div style={{background:'rgba(255,255,255,.03)',border:'1px solid #1A2130',borderRadius:10,padding:'12px 16px',textAlign:'left'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)'}}>Nächstes Ziel: 🥈 Silber</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#C9A84C'}}>{BALANCE}/{NEXT_REWARD}</span>
            </div>
            <div style={{height:6,background:'#1A2130',borderRadius:3,overflow:'hidden'}}>
              <div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,#C9A84C,#FFD700)',width:`${progress}%`,transition:'width .5s'}}/>
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',marginTop:5}}>
              Noch {(NEXT_REWARD-BALANCE).toLocaleString('de')} Coins bis Silber Paket
            </div>
          </div>
        </div>

        {/* How to earn */}
        <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:14,marginBottom:16,overflow:'hidden'}}>
          <button onClick={()=>setShowHow(!showHow)}
            style={{width:'100%',padding:'14px 20px',background:'transparent',border:'none',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.5)'}}>💡 Wie verdiene ich Coins?</span>
            <span style={{color:'rgba(255,255,255,.3)',fontSize:14}}>{showHow?'▲':'▼'}</span>
          </button>
          {showHow && (
            <div style={{padding:'0 20px 16px',borderTop:'1px solid #1A2130'}}>
              {[
                ['📱','B2B-QR-Code teilen','50% des ersten Pakets automatisch gutgeschrieben'],
                ['🎁','Referral-Link in Bio','realsync-platform.vercel.app/join/rs-dominik'],
                ['🏆','Milestones erreichen','Bonus-Coins für aktive Nutzung'],
                ['🛍','Im Store einlösen','Pakete · Merch · Kurse · Services'],
              ].map(([i,t,d])=>(
                <div key={t} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:'1px solid #1A2130'}}>
                  <span style={{fontSize:16,flexShrink:0}}>{i}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>{t}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',marginTop:1}}>{d}</div>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <Link href="/join/rs-dominik" style={{flex:1,padding:'9px',background:'rgba(201,168,76,.15)',border:'1px solid rgba(201,168,76,.35)',borderRadius:8,color:'#C9A84C',fontFamily:"'DM Mono',monospace",fontSize:10,textDecoration:'none',textAlign:'center',fontWeight:700}}>
                  📱 Mein QR-Code
                </Link>
                <Link href="/store" style={{flex:1,padding:'9px',background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.25)',borderRadius:8,color:'#00D4FF',fontFamily:"'DM Mono',monospace",fontSize:10,textDecoration:'none',textAlign:'center',fontWeight:700}}>
                  🛍 Coins einlösen
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:14,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #1A2130',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',letterSpacing:'.15em',textTransform:'uppercase'}}>// Transaktionen</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.2)'}}>{TRANSACTIONS.length} Einträge</span>
          </div>
          {TRANSACTIONS.map(tx => {
            const meta = TYPE_META[tx.type];
            return (
              <div key={tx.id} style={{padding:'12px 20px',borderBottom:'1px solid #0F1520',display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:tx.type==='bonus'?14:12,fontWeight:700,background:meta.bg,color:meta.c,flexShrink:0}}>
                  {meta.icon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.8)',lineHeight:1.3}}>{tx.desc}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',marginTop:2}}>{tx.date}</div>
                </div>
                <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,color:meta.c,flexShrink:0}}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('de')}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
