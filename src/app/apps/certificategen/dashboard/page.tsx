'use client';
import { useState } from 'react';
import Link from 'next/link';

function QRMini({value,size=80}:{value:string;size?:number}) {
  const cells=21,cs=Math.floor(size/cells);
  const h=value.split('').reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,5381);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="3"/>
      {Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
        const fp=(r<7&&c<7)||(r<7&&c>=cells-7)||(r>=cells-7&&c<7);
        const on=fp||((h^(r*31+c*17))&1)===1;
        return on?<rect key={`${r}${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill="#111"/>:null;
      }))}
    </svg>
  );
}

const CERTS = [
  {id:1, name:'Content Creator Award',    recipient:'Max Müller',     code:'CERT-2026-MM8K', date:'15.03.2026', status:'issued',  verified:true},
  {id:2, name:'Verified Creator Badge',   recipient:'Lisa Weber',     code:'CERT-2026-LW3K', date:'10.03.2026', status:'issued',  verified:true},
  {id:3, name:'Brand Partnership',        recipient:'Tom Schmidt',    code:'CERT-2026-TS1K', date:'08.03.2026', status:'draft',   verified:false},
  {id:4, name:'Excellence Certificate',   recipient:'Anna Bauer',     code:'CERT-2026-AB5K', date:'01.03.2026', status:'expired', verified:false},
];

export default function CertGenDashboard() {
  const [selected, setSelected] = useState<number|null>(1);
  const [name, setName] = useState('Max Müller');
  const [certType, setCertType] = useState('Creator Award');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  function generate() {
    setGenerating(true);
    setTimeout(()=>{setGenerating(false);setGenerated(true);},1800);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-yellow-950/30 border-b border-yellow-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-yellow-400">🏆 CertificateGen</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-yellow-500 text-black rounded-full">Upgrade</Link>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[{v:'4',l:'Zertifikate',c:'#FBBF24'},{v:'2',l:'Aktiv + verifiziert',c:'#10B981'},{v:'Polygon',l:'Blockchain',c:'#8B5CF6'},{v:'PDF+QR',l:'Export-Formate',c:'#00D4FF'}].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-8 grid md:grid-cols-2 gap-4">
        {/* Generator */}
        <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-5">
          <div className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-4">// Neues Zertifikat</div>
          <div className="space-y-3 mb-4">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Empfänger Name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"/>
            <select value={certType} onChange={e=>setCertType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500">
              {['Creator Award','Verified Creator Badge','Brand Partnership','Excellence Certificate','Completion Certificate'].map(t=>(
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <button onClick={generate} disabled={generating}
            className="w-full py-2.5 bg-yellow-500 text-black font-black text-sm rounded-lg hover:bg-yellow-400 disabled:opacity-50">
            {generating?'⟳ Generiere PDF + QR...':'🏆 Zertifikat erstellen'}
          </button>
          {generated && (
            <div className="mt-4 bg-gray-800 border border-yellow-500/20 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-3">
                <QRMini value={`CERT-2026-${name.replace(/\s/g,'').toUpperCase().slice(0,4)}K`} size={80}/>
              </div>
              <div className="text-sm font-bold text-yellow-400 mb-1">{certType}</div>
              <div className="text-xs text-gray-400 font-mono mb-2">{name} · {new Date().toLocaleDateString('de')}</div>
              <div className="flex gap-2 justify-center">
                <button className="text-xs px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full">📥 PDF</button>
                <button className="text-xs px-3 py-1.5 bg-gray-700 border border-gray-600 text-gray-400 rounded-full">⛓ Blockchain</button>
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Alle Zertifikate</span>
          </div>
          {CERTS.map(c=>(
            <div key={c.id} className="px-5 py-3 border-b border-gray-800 last:border-0 flex items-center gap-3 cursor-pointer hover:bg-gray-800/50"
              onClick={()=>setSelected(selected===c.id?null:c.id)}>
              <div style={{width:32,height:32,background:'rgba(251,191,36,.12)',border:'1px solid rgba(251,191,36,.25)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🏆</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{c.name}</div>
                <div className="text-xs text-gray-500 font-mono">{c.recipient} · {c.date}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${c.status==='issued'?'bg-green-500/20 text-green-400 border-green-500/30':c.status==='draft'?'bg-gray-800 text-gray-500 border-gray-700':'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                {c.status}
              </span>
              {c.verified && <span className="text-xs text-yellow-400">✓ Blockchain</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
