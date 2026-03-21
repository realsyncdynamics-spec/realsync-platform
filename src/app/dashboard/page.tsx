'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Tv, TrendingUp, FileText, Users, DollarSign, Palette, BarChart3, Calendar, Heart, Database, Scale, Award } from 'lucide-react';

const apps = [
  { name: 'CreatorSeal', icon: Shield, color: '#00D4FF', href: '/apps/creatorseal/dashboard', desc: 'Deepfake Protection' },
  { name: 'AdEngine', icon: Tv, color: '#FF6B35', href: '/apps/adengine/dashboard', desc: 'KI-Ad Generator' },
  { name: 'TrendRadar', icon: TrendingUp, color: '#00FF88', href: '/apps/trendradar/dashboard', desc: 'Trends' },
  { name: 'ContentForge', icon: FileText, color: '#A855F7', href: '/apps/contentforge/dashboard', desc: 'Content' },
  { name: 'RightsGuard', icon: Scale, color: '#2DD4BF', href: '/apps/rightsguard/dashboard', desc: 'DRM' },
  { name: 'MediaVault', icon: Database, color: '#8B5CF6', href: '/apps/mediavault/dashboard', desc: 'Storage' },
  { name: 'BrandKit', icon: Palette, color: '#EC4899', href: '/apps/brandkit/dashboard', desc: 'Branding' },
  { name: 'CollabHub', icon: Users, color: '#F59E0B', href: '/apps/collabhub/dashboard', desc: 'Collab' },
  { name: 'MonetizeMax', icon: DollarSign, color: '#10B981', href: '/apps/monetizemax/dashboard', desc: 'Revenue' },
  { name: 'AnalyticsPro', icon: BarChart3, color: '#6366F1', href: '/apps/analyticspro/dashboard', desc: 'Analytics' },
  { name: 'ScheduleMaster', icon: Calendar, color: '#F97316', href: '/apps/schedulemaster/dashboard', desc: 'Planer' },
  { name: 'FanConnect', icon: Heart, color: '#EF4444', href: '/apps/fanconnect/dashboard', desc: 'Community' },
  { name: 'CertificateGen', icon: Award, color: '#FBBF24', href: '/apps/certificategen/dashboard', desc: 'Zertifikate' },
];

export default function DashboardPage() {
  const [plan] = useState('Free');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          RealSync
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/20">{plan} Plan</span>
          <Link href="/pricing" className="text-gray-400 hover:text-white text-sm">Upgrade</Link>
          <button className="text-gray-400 hover:text-white text-sm">Logout</button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">Willkommen zurueck! Waehle eine App um zu starten.</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Aktive Apps', value: '13', change: 'Alle verfuegbar' },
            { label: 'Content geschuetzt', value: '4,892', change: '+24% diesen Monat' },
            { label: 'Zertifikate erstellt', value: '847', change: '+12% diese Woche' },
            { label: 'Aktueller Plan', value: plan, change: 'Kostenlos fuer immer' },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-green-400 text-sm mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Apps Grid */}
        <h2 className="text-xl font-semibold mb-4">Deine Apps</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {apps.map((app) => (
            <Link key={app.name} href={app.href} className="block p-5 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 transition-all group">
              <app.icon size={28} style={{ color: app.color }} className="mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold" style={{ color: app.color }}>{app.name}</h3>
              <p className="text-gray-500 text-xs mt-1">{app.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Letzte Aktivitaeten</h3>
          <div className="space-y-3">
            {[
              { action: 'CreatorSeal Scan abgeschlossen', time: 'vor 2 Min', type: 'success' },
              { action: 'Neues Zertifikat erstellt (CERT-847)', time: 'vor 15 Min', type: 'info' },
              { action: 'Blockchain-Hash verifiziert', time: 'vor 1 Std', type: 'success' },
              { action: 'Ad-Kampagne gestartet', time: 'vor 3 Std', type: 'info' },
              { action: 'Wasserzeichen auf 12 Dateien angewendet', time: 'vor 5 Std', type: 'success' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`} />
                  <span>{item.action}</span>
                </div>
                <span className="text-gray-500 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
