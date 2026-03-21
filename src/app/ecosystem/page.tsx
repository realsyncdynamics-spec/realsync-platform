'use client';
import { useState } from 'react';

const APP_COLORS: Record<string, string> = {
  creatorseal: '#06b6d4', adengine: '#f97316', trendradar: '#a855f7', contentforge: '#22c55e',
  fanconnect: '#ec4899', mediavault: '#3b82f6', rightsguard: '#ef4444', schedulemaster: '#eab308',
  monetizehub: '#14b8a6', collabspace: '#8b5cf6', analyticsplus: '#6366f1', brandkit: '#f43f5e', gate: '#84cc16'
};
const APP_NAMES: Record<string, string> = {
  creatorseal: 'CreatorSeal', adengine: 'AdEngine', trendradar: 'TrendRadar', contentforge: 'ContentForge',
  fanconnect: 'FanConnect', mediavault: 'MediaVault', rightsguard: 'RightsGuard', schedulemaster: 'ScheduleMaster',
  monetizehub: 'MonetizeHub', collabspace: 'CollabSpace', analyticsplus: 'Analytics+', brandkit: 'BrandKit', gate: 'Gate'
};

const ROUTES = [
  { s: 'creatorseal', t: 'mediavault', d: 'Verifizierte Inhalte archivieren', auto: true },
  { s: 'creatorseal', t: 'rightsguard', d: 'C2PA-Zertifikate fuer Rechteschutz', auto: true },
  { s: 'trendradar', t: 'contentforge', d: 'Trending Topics als Vorlagen', auto: true },
  { s: 'trendradar', t: 'adengine', d: 'Trend-Daten fuer Werbung', auto: true },
  { s: 'contentforge', t: 'schedulemaster', d: 'Inhalte direkt planen', auto: true },
  { s: 'contentforge', t: 'creatorseal', d: 'Zur C2PA-Verifizierung senden', auto: false },
  { s: 'schedulemaster', t: 'analyticsplus', d: 'Posting-Performance analysieren', auto: true },
  { s: 'analyticsplus', t: 'trendradar', d: 'Performance fuer Trends', auto: true },
  { s: 'analyticsplus', t: 'adengine', d: 'Analytics fuer Ads', auto: true },
  { s: 'adengine', t: 'monetizehub', d: 'Werbeeinnahmen tracken', auto: true },
  { s: 'fanconnect', t: 'analyticsplus', d: 'Fan-Engagement analysieren', auto: true },
  { s: 'monetizehub', t: 'analyticsplus', d: 'Einnahmen analysieren', auto: true },
  { s: 'brandkit', t: 'contentforge', d: 'Brand-Assets nutzen', auto: true },
  { s: 'brandkit', t: 'adengine', d: 'Brand-Assets fuer Ads', auto: true },
  { s: 'rightsguard', t: 'monetizehub', d: 'Lizenzeinnahmen tracken', auto: true },
  { s: 'gate', t: 'creatorseal', d: 'Gate-Inhalte verifizieren', auto: false },
  { s: 'collabspace', t: 'contentforge', d: 'Kollaborations-Ergebnisse nutzen', auto: false },
];

const WORKFLOWS = [
  { id: 'w1', name: 'Auto-Verifizierung & Publishing', desc: 'Content -> C2PA -> Wasserzeichen -> Planen -> Veroeffentlichen', steps: ['ContentForge', 'CreatorSeal', 'MediaVault', 'ScheduleMaster'], active: true, runs: 147 },
  { id: 'w2', name: 'Trend-zu-Content Pipeline', desc: 'Trend erkannt -> Template generieren -> Kampagne erstellen', steps: ['TrendRadar', 'ContentForge', 'AdEngine'], active: true, runs: 89 },
  { id: 'w3', name: 'Vollstaendiger Content-Schutz', desc: 'Upload -> C2PA + Wasserzeichen + Blockchain + Barcode + Rechte', steps: ['MediaVault', 'CreatorSeal', 'CreatorSeal', 'CreatorSeal', 'RightsGuard'], active: true, runs: 312 },
  { id: 'w4', name: 'Monetarisierungs-Pipeline', desc: 'Analytics -> Ads optimieren -> Einnahmen tracken -> Zielgruppen', steps: ['Analytics+', 'AdEngine', 'MonetizeHub', 'FanConnect'], active: false, runs: 56 },
  { id: 'w5', name: 'Kollaborations-Workflow', desc: 'Projekt -> Brand-Assets -> Workspace -> Verifizierung', steps: ['CollabSpace', 'BrandKit', 'ContentForge', 'CreatorSeal'], active: true, runs: 23 },
];

export default function EcosystemPage() {
  const [tab, setTab] = useState<'overview'|'routes'|'workflows'|'transfers'>('overview');
  const [filter, setFilter] = useState('');

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 p-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">RealSync</a>
        <div className="flex gap-4"><a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a><a href="/automations" className="text-gray-400 hover:text-white">Automations</a><a href="/pricing" className="text-gray-400 hover:text-white">Pakete</a></div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm mb-4">Oekosystem-Datenbus</div>
          <h1 className="text-4xl font-bold mb-2">Ecosystem <span className="text-yellow-500">Data Hub</span></h1>
          <p className="text-gray-400">Nahtloser Datentransfer zwischen allen 13 Apps - barrierefrei und automatisiert</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{l:'Aktive Routen',v:'17',c:'text-green-400'},{l:'Auto-Sync',v:'13',c:'text-cyan-400'},{l:'Workflows',v:'5',c:'text-purple-400'},{l:'Transfers heute',v:'1.247',c:'text-yellow-400'}].map((s,i)=>(
            <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800"><div className={`text-2xl font-bold ${s.c}`}>{s.v}</div><div className="text-gray-500 text-sm">{s.l}</div></div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview','routes','workflows','transfers'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab===t?'bg-yellow-500 text-black':'bg-gray-900 text-gray-400 hover:text-white'}`}>
              {t==='overview'?'Uebersicht':t==='routes'?'Datenrouten':t==='workflows'?'Workflows':'Live-Transfers'}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold mb-4">App-Verbindungen im Oekosystem</h2>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {Object.entries(APP_NAMES).map(([id, name]) => (
                  <div key={id} className="text-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition cursor-pointer">
                    <div className="w-10 h-10 mx-auto rounded-lg mb-2 flex items-center justify-center text-lg font-bold" style={{backgroundColor: APP_COLORS[id]+'30', color: APP_COLORS[id]}}>{name[0]}</div>
                    <div className="text-xs font-medium truncate">{name}</div>
                    <div className="text-xs text-gray-500">{ROUTES.filter(r=>r.s===id||r.t===id).length} Routen</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-bold mb-3">Ecosystem Health</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400 font-bold">Healthy</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Uptime</span><span>99.97%</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Avg Latenz</span><span>45ms</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">P99 Latenz</span><span>120ms</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Transfers/Monat</span><span className="text-yellow-400">34.521</span></div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-bold mb-3">Top Datenrouten</h3>
                <div className="space-y-2">
                  {ROUTES.filter(r=>r.auto).slice(0,5).map((r,i)=>(
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span style={{color:APP_COLORS[r.s]}}>{APP_NAMES[r.s]}</span>
                      <span className="text-gray-600">-&gt;</span>
                      <span style={{color:APP_COLORS[r.t]}}>{APP_NAMES[r.t]}</span>
                      <span className="text-green-400 ml-auto text-xs">Auto</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'routes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Alle Datenrouten ({ROUTES.length})</h2>
              <input placeholder="Route suchen..." value={filter} onChange={e=>setFilter(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"/>
            </div>
            <div className="space-y-3">
              {ROUTES.filter(r=>!filter||r.d.toLowerCase().includes(filter.toLowerCase())||APP_NAMES[r.s].toLowerCase().includes(filter.toLowerCase())).map((r,i)=>(
                <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="px-3 py-1 rounded-lg text-sm font-bold" style={{backgroundColor:APP_COLORS[r.s]+'20',color:APP_COLORS[r.s]}}>{APP_NAMES[r.s]}</div>
                    <span className="text-yellow-500 text-lg">&rarr;</span>
                    <div className="px-3 py-1 rounded-lg text-sm font-bold" style={{backgroundColor:APP_COLORS[r.t]+'20',color:APP_COLORS[r.t]}}>{APP_NAMES[r.t]}</div>
                  </div>
                  <div className="flex-1 text-gray-400 text-sm">{r.d}</div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${r.auto?'bg-green-500/20 text-green-400':'bg-gray-700 text-gray-400'}`}>{r.auto?'Auto-Sync':'Manuell'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'workflows' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Automatisierte Workflows</h2>
            <div className="space-y-4">
              {WORKFLOWS.map(w=>(
                <div key={w.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <div><h3 className="font-bold text-lg">{w.name}</h3><p className="text-gray-400 text-sm">{w.desc}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm">{w.runs}x ausgefuehrt</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${w.active?'bg-green-500/20 text-green-400':'bg-gray-700 text-gray-400'}`}>{w.active?'Aktiv':'Pausiert'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {w.steps.map((s,i)=>{
                      const appId = Object.entries(APP_NAMES).find(([,n])=>n===s)?.[0]||'';
                      return (<div key={i} className="flex items-center gap-2">
                        <div className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap" style={{backgroundColor:(APP_COLORS[appId]||'#666')+'20',color:APP_COLORS[appId]||'#999',border:`1px solid ${APP_COLORS[appId]||'#666'}40`}}>{s}</div>
                        {i<w.steps.length-1 && <span className="text-yellow-500">&rarr;</span>}
                      </div>);
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'transfers' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Live Datentransfers</h2>
            <div className="space-y-2">
              {[{from:'ContentForge',to:'CreatorSeal',type:'C2PA Verify',time:'vor 2s',status:'ok'},
                {from:'TrendRadar',to:'AdEngine',type:'Trend Data',time:'vor 5s',status:'ok'},
                {from:'ScheduleMaster',to:'Analytics+',type:'Post Stats',time:'vor 8s',status:'ok'},
                {from:'CreatorSeal',to:'MediaVault',type:'Certificate',time:'vor 12s',status:'ok'},
                {from:'BrandKit',to:'ContentForge',type:'Brand Assets',time:'vor 15s',status:'ok'},
                {from:'Analytics+',to:'AdEngine',type:'Performance',time:'vor 18s',status:'ok'},
                {from:'FanConnect',to:'Analytics+',type:'Engagement',time:'vor 23s',status:'ok'},
                {from:'AdEngine',to:'MonetizeHub',type:'Revenue',time:'vor 30s',status:'ok'},
                {from:'RightsGuard',to:'MonetizeHub',type:'License Fee',time:'vor 35s',status:'ok'},
                {from:'CreatorSeal',to:'RightsGuard',type:'Rights Cert',time:'vor 41s',status:'ok'},
              ].map((t,i)=>{
                const fromId = Object.entries(APP_NAMES).find(([,n])=>n===t.from)?.[0]||'';
                const toId = Object.entries(APP_NAMES).find(([,n])=>n===t.to)?.[0]||'';
                return (
                  <div key={i} className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                    <span className="font-medium text-sm" style={{color:APP_COLORS[fromId]}}>{t.from}</span>
                    <span className="text-yellow-500">&rarr;</span>
                    <span className="font-medium text-sm" style={{color:APP_COLORS[toId]}}>{t.to}</span>
                    <span className="text-gray-500 text-xs px-2 py-0.5 bg-gray-800 rounded">{t.type}</span>
                    <span className="ml-auto text-gray-600 text-xs">{t.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
