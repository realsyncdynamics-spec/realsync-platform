'use client';

import { useState } from 'react';
import Link from 'next/link';

const presetWorkflows = [
  { id: 'wf-auto-watermark', name: 'Auto-Wasserzeichen bei Upload', trigger: 'MediaVault: file.uploaded', actions: ['CreatorSeal: Wasserzeichen', 'CreatorSeal: C2PA', 'RightsGuard: Blockchain'], enabled: true, runs: 1247 },
  { id: 'wf-content-to-ad', name: 'Content -> Ad-Kampagne', trigger: 'ContentForge: content.published', actions: ['AdEngine: Kampagne erstellen', 'ScheduleMaster: Post planen', 'AnalyticsPro: Tracking'], enabled: true, runs: 834 },
  { id: 'wf-trend-to-content', name: 'Trend -> Content erstellen', trigger: 'TrendRadar: trend.detected', actions: ['ContentForge: KI-Content', 'BrandKit: Branding', 'ScheduleMaster: Optimal planen'], enabled: true, runs: 456 },
  { id: 'wf-collab-certificate', name: 'Collab-Deal -> Zertifikat', trigger: 'CollabHub: deal.accepted', actions: ['CertificateGen: Vertrag (PDF+QR)', 'RightsGuard: Registrierung', 'MonetizeMax: Revenue Tracking'], enabled: false, runs: 123 },
  { id: 'wf-deepfake-alert', name: 'Deepfake -> Schutzprotokoll', trigger: 'CreatorSeal: deepfake.detected', actions: ['RightsGuard: Takedown', 'CertificateGen: Beweis', 'AnalyticsPro: Incident Log'], enabled: true, runs: 67 },
  { id: 'wf-fan-engage', name: 'Fan-Meilenstein -> Monetarisierung', trigger: 'FanConnect: milestone.reached', actions: ['CertificateGen: Fan-Badge', 'MonetizeMax: Exklusiv-Angebot', 'AdEngine: Retargeting'], enabled: true, runs: 289 },
];

const recentExecutions = [
  { workflow: 'Auto-Wasserzeichen', status: 'success', time: 'vor 2 Min', duration: '3.6s', steps: 3 },
  { workflow: 'Content -> Ad-Kampagne', status: 'success', time: 'vor 15 Min', duration: '4.8s', steps: 3 },
  { workflow: 'Deepfake -> Schutzprotokoll', status: 'warning', time: 'vor 1 Std', duration: '2.4s', steps: 3 },
  { workflow: 'Trend -> Content', status: 'success', time: 'vor 3 Std', duration: '5.2s', steps: 3 },
  { workflow: 'Fan-Meilenstein', status: 'success', time: 'vor 5 Std', duration: '3.1s', steps: 3 },
];

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState(presetWorkflows);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">RealSync</Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Automatisierungen</h1>
            <p className="text-gray-400 mt-1">Workflows zwischen allen 13 Apps - Daten fliessen automatisch</p>
          </div>
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400">+ Neuer Workflow</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Aktive Workflows', value: workflows.filter(w => w.enabled).length.toString(), sub: `von ${workflows.length} gesamt` },
            { label: 'Ausfuehrungen (30d)', value: '3,016', sub: '+42% vs Vormonat' },
            { label: 'Erfolgsrate', value: '98.7%', sub: 'Letzte 30 Tage' },
            { label: 'Zeit gespart', value: '47 Std', sub: 'Diesen Monat' },
          ].map(s => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
              <p className="text-green-400 text-sm mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Workflows */}
        <h2 className="text-xl font-semibold mb-4">Ecosystem Workflows</h2>
        <div className="space-y-3 mb-8">
          {workflows.map(wf => (
            <div key={wf.id} className={`bg-zinc-900 border rounded-xl p-5 ${wf.enabled ? 'border-zinc-800' : 'border-zinc-800 opacity-60'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${wf.enabled ? 'bg-green-400' : 'bg-gray-600'}`} />
                  <h3 className="font-semibold text-lg">{wf.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">{wf.runs} Ausfuehrungen</span>
                  <button onClick={() => toggleWorkflow(wf.id)} className={`px-4 py-1 rounded-full text-sm font-medium ${wf.enabled ? 'bg-green-900 text-green-400' : 'bg-zinc-800 text-gray-400'}`}>
                    {wf.enabled ? 'Aktiv' : 'Inaktiv'}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-zinc-800 px-3 py-1 rounded-lg text-yellow-400">{wf.trigger}</span>
                <span className="text-gray-600">→</span>
                {wf.actions.map((a, i) => (
                  <span key={i} className="bg-zinc-800 px-3 py-1 rounded-lg text-gray-300">{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Executions */}
        <h2 className="text-xl font-semibold mb-4">Letzte Ausfuehrungen</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="text-left p-4 text-gray-400 text-sm">Workflow</th>
                <th className="text-left p-4 text-gray-400 text-sm">Status</th>
                <th className="text-left p-4 text-gray-400 text-sm">Zeit</th>
                <th className="text-left p-4 text-gray-400 text-sm">Dauer</th>
                <th className="text-left p-4 text-gray-400 text-sm">Schritte</th>
              </tr>
            </thead>
            <tbody>
              {recentExecutions.map((ex, i) => (
                <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-800">
                  <td className="p-4 font-medium">{ex.workflow}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${ex.status === 'success' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>{ex.status}</span>
                  </td>
                  <td className="p-4 text-gray-400">{ex.time}</td>
                  <td className="p-4 text-gray-400">{ex.duration}</td>
                  <td className="p-4 text-gray-400">{ex.steps} Steps</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ecosystem Data Flow */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Ecosystem Datenfluss</h3>
          <p className="text-gray-400 mb-4">Daten werden automatisch zwischen Apps uebertragen - kein manueller Export/Import noetig.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { from: 'MediaVault', to: 'CreatorSeal', data: 'Dateien -> Wasserzeichen' },
              { from: 'ContentForge', to: 'AdEngine', data: 'Content -> Kampagnen' },
              { from: 'TrendRadar', to: 'ContentForge', data: 'Trends -> Content-Ideen' },
              { from: 'CollabHub', to: 'CertificateGen', data: 'Deals -> Vertraege' },
              { from: 'CreatorSeal', to: 'RightsGuard', data: 'Hashes -> Blockchain' },
              { from: 'FanConnect', to: 'MonetizeMax', data: 'Engagement -> Revenue' },
              { from: 'AnalyticsPro', to: 'ScheduleMaster', data: 'Insights -> Planung' },
              { from: 'BrandKit', to: 'ContentForge', data: 'Brand -> Content' },
            ].map((flow, i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-3">
                <p className="text-yellow-400 text-xs font-semibold">{flow.from} → {flow.to}</p>
                <p className="text-gray-400 text-xs mt-1">{flow.data}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
