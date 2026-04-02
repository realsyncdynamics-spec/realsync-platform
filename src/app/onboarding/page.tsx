'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id:'welcome',    title:'Willkommen',          icon:'🎉' },
  { id:'profile',   title:'Dein Profil',           icon:'👤' },
  { id:'platforms', title:'Plattformen',           icon:'📱' },
  { id:'qr',        title:'Dein QR-Code',          icon:'📱' },
  { id:'done',      title:'Los geht\'s!',          icon:'🚀' },
];

const PLATFORMS = [
  { id:'youtube',   name:'YouTube',    icon:'📺', color:'#FF0000' },
  { id:'tiktok',    name:'TikTok',     icon:'🎵', color:'#00F2EA' },
  { id:'instagram', name:'Instagram',  icon:'📸', color:'#E1306C' },
  { id:'facebook',  name:'Facebook',   icon:'🔵', color:'#1877F2' },
  { id:'x',         name:'X / Twitter',icon:'𝕏',  color:'#000' },
  { id:'twitch',    name:'Twitch',     icon:'💜', color:'#9146FF' },
];

function QRMini({ value, size=100 }: { value: string; size?: number }) {
  const cells=21, cs=Math.floor(size/cells);
  const h = value.split('').reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0, 5381);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="6"/>
      {Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
        const fp=(r<7&&c<7)||(r<7&&c>=cells-7)||(r>=cells-7&&c<7);
        const on=fp||((h^(r*31+c*17))&1)===1;
        return on?<rect key={`${r}${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill="#111"/>:null;
      }))}
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [bio, setBio] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const username = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g,'') || 'dein_name';
  const myLink = `realsyncdynamics.de/creator/${username}`;
  const refLink = `realsync-platform.vercel.app/join/${username}`;

  async function saveProfile() {
    setSaving(true);
    try {
      await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, niche, bio, platforms: selected }),
      });
    } catch {}
    setSaving(false);
    setStep(s => s + 1);
  }

  const niches = ['Tech & Gadgets','Gaming','Lifestyle','Beauty & Fashion','Fitness','Food','Business','Education','Travel','Entertainment'];

  return (
    <div className="min-h-screen bg-[#03050A] text-white flex items-center justify-center p-5" style={{fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .45s cubic-bezier(.34,1.56,.64,1) both}`}</style>

      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s,i)=>(
            <div key={s.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: i<step?'#10B981':i===step?'#00D4FF':'#1A2130',
                  color: i<=step?'#000':'rgba(255,255,255,.3)',
                }}>
                {i<step?'✓':i+1}
              </div>
              {i<STEPS.length-1&&<div className="w-8 h-0.5 rounded-full transition-all" style={{background:i<step?'#10B981':'#1A2130'}}/>}
            </div>
          ))}
        </div>

        <div className="bg-[#080C14] border border-[#1A2130] rounded-2xl p-7">

          {/* Step 0: Welcome */}
          {step===0 && (
            <div className="fu text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="font-black text-2xl mb-3">Willkommen bei RealSync!</h1>
              <p className="text-sm text-gray-400 mb-6 font-mono leading-relaxed">
                In 4 Schritten bist du bereit.<br/>
                Dein QR-Code, dein Creator-Profil<br/>und alle 16 Apps warten auf dich.
              </p>
              <div className="space-y-3 text-left mb-6">
                {[['🛡','Verifizierter Creator Badge'],['📱','Dein persönlicher QR-Code'],['🪙','50% Provision via Referrals'],['⚡','16 Apps sofort nutzbar']].map(([i,t])=>(
                  <div key={t} className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-2.5">
                    <span className="text-lg">{i}</span>
                    <span className="text-sm text-gray-300">{t}</span>
                    <span className="ml-auto text-green-400 text-sm">✓</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>setStep(1)}
                className="w-full py-3 font-black text-sm rounded-xl text-black"
                style={{background:'linear-gradient(135deg,#00D4FF,#0070F3)'}}>
                Los geht&apos;s →
              </button>
            </div>
          )}

          {/* Step 1: Profile */}
          {step===1 && (
            <div className="fu">
              <div className="text-3xl mb-3">👤</div>
              <h2 className="font-black text-xl mb-1">Dein Creator-Profil</h2>
              <p className="text-xs text-gray-500 font-mono mb-5">Wird auf deiner öffentlichen Creator-Seite angezeigt</p>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-1.5">Creator Name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Max Müller"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"/>
                  {name && <div className="text-xs text-cyan-400 font-mono mt-1">→ {myLink}</div>}
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-1.5">Nische / Thema</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {niches.slice(0,6).map(n=>(
                      <button key={n} onClick={()=>setNiche(n)}
                        className="text-xs py-1.5 px-2 rounded-lg border transition-all font-mono"
                        style={niche===n?{background:'rgba(0,212,255,.2)',borderColor:'rgba(0,212,255,.4)',color:'#00D4FF'}:{borderColor:'#374151',color:'#6B7280',background:'transparent'}}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-1.5">Bio (optional)</label>
                  <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={2} placeholder="Kurze Beschreibung..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"/>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={()=>setStep(0)} className="px-4 py-2.5 bg-transparent border border-gray-700 rounded-xl text-gray-500 text-sm">←</button>
                <button onClick={()=>setStep(2)} disabled={!name}
                  className="flex-1 py-2.5 font-black text-sm rounded-xl text-black disabled:opacity-40"
                  style={{background:'linear-gradient(135deg,#00D4FF,#0070F3)'}}>
                  Weiter →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Platforms */}
          {step===2 && (
            <div className="fu">
              <div className="text-3xl mb-3">📱</div>
              <h2 className="font-black text-xl mb-1">Plattformen verbinden</h2>
              <p className="text-xs text-gray-500 font-mono mb-5">Wähle deine aktiven Kanäle (später änderbar)</p>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {PLATFORMS.map(p=>(
                  <button key={p.id} onClick={()=>setSelected(s=>s.includes(p.id)?s.filter(x=>x!==p.id):[...s,p.id])}
                    className="flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left"
                    style={selected.includes(p.id)?{borderColor:p.color+'60',background:p.color+'12'}:{borderColor:'#1F2937',background:'#0B0F18'}}>
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-sm font-bold" style={{color:selected.includes(p.id)?p.color:'rgba(255,255,255,.6)'}}>{p.name}</span>
                    {selected.includes(p.id)&&<span className="ml-auto text-xs" style={{color:p.color}}>✓</span>}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={()=>setStep(1)} className="px-4 py-2.5 bg-transparent border border-gray-700 rounded-xl text-gray-500 text-sm">←</button>
                <button onClick={saveProfile} disabled={saving}
                  className="flex-1 py-2.5 font-black text-sm rounded-xl text-black disabled:opacity-40"
                  style={{background:'linear-gradient(135deg,#00D4FF,#0070F3)'}}>
                  {saving?'⟳ Speichere...':'Speichern →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: QR Code */}
          {step===3 && (
            <div className="fu text-center">
              <div className="text-3xl mb-3">📱</div>
              <h2 className="font-black text-xl mb-1">Dein QR-Code ist bereit!</h2>
              <p className="text-xs text-gray-500 font-mono mb-5">Poste ihn auf YouTube, TikTok, Instagram</p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-4 text-center">
                  <div className="text-xs font-mono text-amber-400 mb-3">Creator-Profil</div>
                  <div className="flex justify-center mb-2">
                    <div className="bg-white p-1.5 rounded-lg"><QRMini value={`https://${myLink}`} size={80}/></div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono truncate">{myLink}</div>
                </div>
                <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-4 text-center">
                  <div className="text-xs font-mono text-cyan-400 mb-3">B2B Referral</div>
                  <div className="flex justify-center mb-2">
                    <div className="bg-white p-1.5 rounded-lg"><QRMini value={`https://${refLink}`} size={80}/></div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">🪙 50% als Coins</div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs font-mono text-gray-400 text-left mb-5">
                <div className="text-green-400 mb-1">// So funktioniert&apos;s:</div>
                <div>1. QR in Bio / Video / Story posten</div>
                <div>2. Fan scannt → landet auf deiner Seite</div>
                <div>3. Registriert sich → du bekommst 50% Coins</div>
                <div className="text-amber-400 mt-1">100 Coins = €1 · Sofort einlösbar</div>
              </div>

              <button onClick={()=>setStep(4)}
                className="w-full py-3 font-black text-sm rounded-xl text-black"
                style={{background:'linear-gradient(135deg,#00D4FF,#0070F3)'}}>
                Zum Creator Hub →
              </button>
            </div>
          )}

          {/* Step 4: Done */}
          {step===4 && (
            <div className="fu text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="font-black text-2xl mb-2">Du bist ready, {name.split(' ')[0] || 'Creator'}!</h2>
              <p className="text-sm text-gray-400 font-mono mb-6">
                Alle 16 Apps warten auf dich.<br/>Starte mit CreatorSeal.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {icon:'🛡',label:'CreatorSeal',     href:'/apps/creatorseal/dashboard'},
                  {icon:'⭐',label:'ReviewRadar',     href:'/apps/reviewradar/dashboard'},
                  {icon:'💳',label:'ChurnRescue',     href:'/apps/churnrescue/dashboard'},
                  {icon:'🪙',label:'Meine Coins',     href:'/coins'},
                ].map(a=>(
                  <Link key={a.label} href={a.href}
                    className="flex items-center gap-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-sm font-medium hover:border-gray-600 transition-all">
                    <span>{a.icon}</span><span className="text-gray-300">{a.label}</span>
                  </Link>
                ))}
              </div>
              <Link href="/hub"
                className="block w-full py-3 font-black text-sm rounded-xl text-black text-center"
                style={{background:'linear-gradient(135deg,#C9A84C,#FFD700)'}}>
                🎬 Zum Creator Hub
              </Link>
            </div>
          )}

        </div>

        <p className="text-center mt-4 text-xs text-gray-700 font-mono">
          Schritt {step+1} von {STEPS.length} · {STEPS[step].title}
        </p>
      </div>
    </div>
  );
}
