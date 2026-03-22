'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const WORKFLOWS = [
  {
    id: 'rr-ai-reply',       app: 'ReviewRadar',   icon: '⭐', appColor: '#1877F2',
    name: 'KI-Auto-Antwort',
    desc: 'Neue 1-3★ Reviews → KI generiert professionelle Antwort → 1-Click posten',
    trigger: 'Neue Bewertung ≤ 3★',
    actions: ['KI analysiert Ton & Inhalt', 'Antwort in <3s generiert', 'Vorschau + 1-Click Post'],
    status: 'active', runs: 847, lastRun: 'vor 2 Min', category: 'KI',
  },
  {
    id: 'rr-alert',           app: 'ReviewRadar',   icon: '🔔', appColor: '#1877F2',
    name: 'Negativ-Review Alert',
    desc: 'Sofort-Benachrichtigung bei 1★ oder 2★ Reviews auf allen Plattformen',
    trigger: 'Review ≤ 2★ erscheint',
    actions: ['Push-Notification', 'E-Mail Alert', 'Slack-Nachricht'],
    status: 'active', runs: 234, lastRun: 'vor 1 Std', category: 'Alert',
  },
  {
    id: 'rr-sync',            app: 'ReviewRadar',   icon: '🔄', appColor: '#1877F2',
    name: 'Plattform-Sync',
    desc: 'Synchronisiert Reviews von Google, Trustpilot, ProvenExpert & Yelp stündlich',
    trigger: 'Jede Stunde',
    actions: ['Google API Pull', 'Trustpilot Sync', 'Rating aggregieren'],
    status: 'active', runs: 1204, lastRun: 'vor 12 Min', category: 'Sync',
  },
  {
    id: 'cr-retry',           app: 'ChurnRescue',   icon: '💳', appColor: '#EF4444',
    name: 'Smart Retry Engine',
    desc: 'Failed Payment → intelligentes Retry nach 24h/48h/72h mit Erfolgsrate 72%',
    trigger: 'Payment fehlgeschlagen',
    actions: ['Stripe Retry planen', 'E-Mail an Kunden', 'Win-Back nach 72h'],
    status: 'active', runs: 312, lastRun: 'vor 46 Min', category: 'Zahlung',
  },
  {
    id: 'cr-winback',         app: 'ChurnRescue',   icon: '💌', appColor: '#EF4444',
    name: 'Win-Back E-Mail',
    desc: 'Kunden mit abgelaufener Karte → personalisierte KI-E-Mail mit Rabattcode',
    trigger: 'Karte abgelaufen + 48h',
    actions: ['KI-E-Mail generieren', 'Rabattcode erstellen', 'Versand via Resend'],
    status: 'active', runs: 89, lastRun: 'vor 3 Std', category: 'KI',
  },
  {
    id: 'cr-predict',         app: 'ChurnRescue',   icon: '📈', appColor: '#EF4444',
    name: 'Churn Prediction',
    desc: 'KI erkennt Abwanderungsrisiko 14 Tage früher anhand Nutzungsmustern',
    trigger: 'Täglich 08:00 Uhr',
    actions: ['Nutzungsdaten analysieren', 'Risiko-Score berechnen', 'Account-Manager Alert'],
    status: 'paused', runs: 567, lastRun: 'vor 1 Tag', category: 'KI',
  },
  {
    id: 'wk-referral',        app: 'WaitlistKit',   icon: '🚀', appColor: '#8B5CF6',
    name: 'Viral Referral',
    desc: 'Signup → einzigartiger Referral-Link → Social-Share → Auto-Aufstieg',
    trigger: 'Neuer Signup',
    actions: ['Unique Link generieren', 'Welcome E-Mail', 'Leaderboard updaten'],
    status: 'active', runs: 2341, lastRun: 'vor 4 Min', category: 'Viral',
  },
  {
    id: 'wk-milestone',       app: 'WaitlistKit',   icon: '🎯', appColor: '#8B5CF6',
    name: 'Milestone Reward',
    desc: 'Bei 5/10/25 Referrals → automatisch Belohnung freischalten + Gratulation',
    trigger: 'Referral-Ziel erreicht',
    actions: ['Belohnung freischalten', 'Konfetti-Animation', 'Gratulations-E-Mail'],
    status: 'active', runs: 156, lastRun: 'vor 22 Min', category: 'Gamification',
  },
  {
    id: 'wk-launch',          app: 'WaitlistKit',   icon: '📣', appColor: '#8B5CF6',
    name: 'Launch Sequence',
    desc: 'Launch-Tag → Top-Referrer zuerst → gestaffelter Zugang nach Rang',
    trigger: 'Launch-Datum erreicht',
    actions: ['Top 10% zuerst einladen', 'Batch-Einladungen', 'Slack-Announcement'],
    status: 'draft', runs: 0, lastRun: '—', category: 'Launch',
  },
  {
    id: 'cs-verify',          app: 'CreatorSeal',   icon: '🛡', appColor: '#C9A84C',
    name: 'Auto-Verifikation',
    desc: 'Neuer Content → SHA-256 Hash → C2PA Signatur → Polygon Timestamp',
    trigger: 'Content hochgeladen',
    actions: ['SHA-256 berechnen', 'C2PA signieren', 'Blockchain anchoring'],
    status: 'active', runs: 4892, lastRun: 'vor 1 Min', category: 'Verifikation',
  },
  {
    id: 'cs-deepfake',        app: 'CreatorSeal',   icon: '🤖', appColor: '#C9A84C',
    name: 'Deepfake Detection',
    desc: 'Jedes Video-Upload → KI-Scan 98% Genauigkeit → Authentizitäts-Zertifikat',
    trigger: 'Video-Upload erkannt',
    actions: ['KI-Analyse starten', 'Deepfake-Score berechnen', 'Zertifikat ausstellen'],
    status: 'active', runs: 1247, lastRun: 'vor 8 Min', category: 'KI',
  },
  {
    id: 'cs-social',          app: 'CreatorSeal',   icon: '📱', appColor: '#C9A84C',
    name: 'Social Sync',
    desc: 'Verified Content → automatisch auf YouTube, TikTok, Instagram mit ✓-Badge',
    trigger: 'Verifikation abgeschlossen',
    actions: ['YouTube API Post', 'TikTok Upload', 'Instagram Reel'],
    status: 'active', runs: 389, lastRun: 'vor 34 Min', category: 'Social',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'KI': '#00D4FF', 'Alert': '#FF6B6B', 'Sync': '#00C853',
  'Zahlung': '#FFD700', 'Viral': '#8B5CF6', 'Gamification': '#F97316',
  'Launch': '#EC4899', 'Verifikation': '#C9A84C', 'Social': '#1877F2',
};

const APP_META: Record<string, { color: string; bg: string }> = {
  ReviewRadar: { color: '#1877F2', bg: '#00081a' },
  ChurnRescue: { color: '#EF4444', bg: '#1a0000' },
  WaitlistKit: { color: '#8B5CF6', bg: '#0d0015' },
  CreatorSeal: { color: '#C9A84C', bg: '#1a1000' },
};

export default function WorkflowsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<{ id: string; msg: string; ts: string }[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(WORKFLOWS.map(w => [w.id, w.status]))
  );

  const apps = ['all', 'ReviewRadar', 'ChurnRescue', 'WaitlistKit', 'CreatorSeal'];
  const filtered = filter === 'all' ? WORKFLOWS : WORKFLOWS.filter(w => w.app === filter);
  const selectedWF = WORKFLOWS.find(w => w.id === selected);

  const totalRuns = WORKFLOWS.reduce((s, w) => s + w.runs, 0);
  const activeCount = Object.values(statuses).filter(s => s === 'active').length;

  function runWorkflow(id: string) {
    if (running.has(id)) return;
    setRunning(prev => new Set(prev).add(id));
    const wf = WORKFLOWS.find(w => w.id === id)!;
    const steps = [...wf.actions];
    let i = 0;
    const t = setInterval(() => {
      if (i < steps.length) {
        setLogs(prev => [{ id, msg: `[${wf.name}] ✓ ${steps[i]}`, ts: new Date().toLocaleTimeString('de') }, ...prev.slice(0, 19)]);
        i++;
      } else {
        clearInterval(t);
        setRunning(prev => { const n = new Set(prev); n.delete(id); return n; });
        setLogs(prev => [{ id, msg: `[${wf.name}] ✅ Workflow abgeschlossen`, ts: new Date().toLocaleTimeString('de') }, ...prev.slice(0, 19)]);
      }
    }, 600);
  }

  function toggleStatus(id: string) {
    setStatuses(prev => ({ ...prev, [id]: prev[id] === 'active' ? 'paused' : 'active' }));
  }

  // Live log ticker
  useEffect(() => {
    const msgs = [
      '[KI-Auto-Antwort] ⭐ Neue Review von Marcus K. — Antwort generiert',
      '[Smart Retry] 💳 StartupHub GmbH — Retry in 46h geplant',
      '[Viral Referral] 🚀 max@startup.de — +12 neue Referrals',
      '[Auto-Verifikation] 🛡 CreatorSeal — SHA-256 berechnet',
      '[Deepfake Detection] 🤖 Video analysiert — Authentisch 98.4%',
      '[Plattform-Sync] 🔄 Google: 3 neue Reviews importiert',
    ];
    let idx = 0;
    const t = setInterval(() => {
      setLogs(prev => [{ id: 'system', msg: msgs[idx % msgs.length], ts: new Date().toLocaleTimeString('de') }, ...prev.slice(0, 19)]);
      idx++;
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-cyan-400">⚡ Workflow Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono bg-gray-800 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-gray-400">{activeCount} aktiv · {totalRuns.toLocaleString('de')} Ausführungen</span>
          </div>
          <Link href="/apps/creatorseal/dashboard" className="text-xs font-bold px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full hover:bg-yellow-500/20">
            🛡 CreatorSeal
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          { v: activeCount.toString(), l: 'Aktive Workflows', c: '#00C853' },
          { v: totalRuns.toLocaleString('de'), l: 'Gesamt Ausführungen', c: '#00D4FF' },
          { v: '72%', l: 'Ø Erfolgsrate', c: '#FFD700' },
          { v: running.size.toString(), l: 'Gerade aktiv', c: running.size > 0 ? '#FF6B6B' : '#4B5563' },
        ].map(s => (
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{ color: s.c }}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 px-5 pb-5">
        {/* Left: Workflow List */}
        <div className="flex-1 min-w-0">
          {/* App Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {apps.map(a => (
              <button key={a} onClick={() => setFilter(a)}
                className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all"
                style={filter === a
                  ? { background: a === 'all' ? '#00D4FF20' : APP_META[a]?.color + '20', border: `1px solid ${a === 'all' ? '#00D4FF' : APP_META[a]?.color}`, color: a === 'all' ? '#00D4FF' : APP_META[a]?.color }
                  : { background: 'transparent', border: '1px solid #374151', color: '#6B7280' }}>
                {a === 'all' ? '🌐 Alle' : a}
              </button>
            ))}
          </div>

          {/* Workflow Cards */}
          <div className="space-y-2">
            {filtered.map(wf => {
              const st = statuses[wf.id];
              const isRunning = running.has(wf.id);
              const isSelected = selected === wf.id;
              return (
                <div key={wf.id} onClick={() => setSelected(isSelected ? null : wf.id)}
                  className="rounded-xl border cursor-pointer transition-all"
                  style={{ borderColor: isSelected ? wf.appColor + '60' : '#1F2937', background: isSelected ? wf.appColor + '08' : '#111827' }}>
                  <div className="p-4 flex items-center gap-4">
                    <div className="text-2xl w-10 text-center flex-shrink-0">{wf.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-black text-sm">{wf.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: CATEGORY_COLORS[wf.category] + '20', color: CATEGORY_COLORS[wf.category] }}>{wf.category}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border font-mono" style={{ borderColor: APP_META[wf.app]?.color + '40', color: APP_META[wf.app]?.color }}>{wf.app}</span>
                      </div>
                      <div className="text-xs text-gray-400">{wf.desc}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden md:block">
                        <div className="text-xs font-mono text-gray-400">{wf.runs.toLocaleString('de')} runs</div>
                        <div className="text-xs text-gray-600">{wf.lastRun}</div>
                      </div>
                      {/* Status Toggle */}
                      <button onClick={e => { e.stopPropagation(); toggleStatus(wf.id); }}
                        className="text-xs px-2 py-1 rounded-full font-mono border transition-all"
                        style={st === 'active'
                          ? { borderColor: '#00C85350', background: '#00C85310', color: '#00C853' }
                          : st === 'paused'
                            ? { borderColor: '#F9730650', background: '#F9730610', color: '#F97306' }
                            : { borderColor: '#37415150', background: '#11182710', color: '#6B7280' }}>
                        {st === 'active' ? '● AKTIV' : st === 'paused' ? '⏸ PAUSE' : '○ DRAFT'}
                      </button>
                      {/* Run Button */}
                      <button onClick={e => { e.stopPropagation(); runWorkflow(wf.id); }}
                        disabled={isRunning || st === 'draft'}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                        style={{ background: isRunning ? '#00D4FF20' : wf.appColor + '20', border: `1px solid ${wf.appColor}50`, color: wf.appColor }}>
                        {isRunning ? '⟳ Läuft...' : '▶ Starten'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isSelected && (
                    <div className="px-4 pb-4 border-t border-gray-800 pt-3 mt-0">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">// Trigger</div>
                          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                            <span className="text-yellow-400">⚡</span>
                            <span className="text-xs font-mono text-gray-300">{wf.trigger}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">// Aktionen</div>
                          <div className="space-y-1.5">
                            {wf.actions.map((a, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-600">{i + 1}.</span>
                                <div className="flex-1 h-6 bg-gray-800 rounded text-xs font-mono text-gray-400 flex items-center px-2 gap-2">
                                  <span className={isRunning ? 'animate-pulse' : ''} style={{ color: isRunning ? wf.appColor : undefined }}>
                                    {isRunning ? '⟳' : '▸'}
                                  </span>
                                  {a}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Log */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden sticky top-4">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Live Log</span>
            </div>
            <div className="p-3 space-y-1.5 max-h-[500px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-xs font-mono text-gray-600 text-center py-8">Keine Logs…</div>
              ) : logs.map((l, i) => (
                <div key={i} className="flex gap-2 text-xs font-mono">
                  <span className="text-gray-600 flex-shrink-0">{l.ts}</span>
                  <span className={l.msg.includes('✅') ? 'text-green-400' : l.msg.includes('✓') ? 'text-cyan-400' : 'text-gray-400'}>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">// Dashboards</div>
            <div className="space-y-2">
              {[
                { href: '/apps/reviewradar/dashboard', label: '⭐ ReviewRadar', color: '#1877F2' },
                { href: '/apps/churnrescue/dashboard', label: '💳 ChurnRescue', color: '#EF4444' },
                { href: '/apps/waitlistkit/dashboard', label: '🚀 WaitlistKit', color: '#8B5CF6' },
                { href: '/apps/creatorseal/dashboard', label: '🛡 CreatorSeal', color: '#C9A84C' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono border transition-all hover:opacity-90"
                  style={{ borderColor: l.color + '30', background: l.color + '08', color: l.color }}>
                  {l.label} <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
