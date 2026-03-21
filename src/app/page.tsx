'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Tv, TrendingUp, FileText, Users, DollarSign, Palette, BarChart3, Calendar, Heart, Database, Scale, Award } from 'lucide-react';

const apps = [
  { name: 'CreatorSeal', icon: Shield, color: '#00D4FF', href: '/apps/creatorseal/dashboard', desc: 'Deepfake Protection & C2PA' },
  { name: 'AdEngine', icon: Tv, color: '#FF6B35', href: '/apps/adengine/dashboard', desc: 'KI-Ad Generator' },
  { name: 'TrendRadar', icon: TrendingUp, color: '#00FF88', href: '/apps/trendradar/dashboard', desc: 'Viral Trend Detection' },
  { name: 'ContentForge', icon: FileText, color: '#A855F7', href: '/apps/contentforge/dashboard', desc: 'KI-Content Erstellung' },
  { name: 'RightsGuard', icon: Scale, color: '#2DD4BF', href: '/apps/rightsguard/dashboard', desc: 'Digital Rights Management' },
  { name: 'MediaVault', icon: Database, color: '#8B5CF6', href: '/apps/mediavault/dashboard', desc: 'Sicherer Cloud-Speicher' },
  { name: 'BrandKit', icon: Palette, color: '#EC4899', href: '/apps/brandkit/dashboard', desc: 'KI-Brand Identity' },
  { name: 'CollabHub', icon: Users, color: '#F59E0B', href: '/apps/collabhub/dashboard', desc: 'Creator Collaboration' },
  { name: 'MonetizeMax', icon: DollarSign, color: '#10B981', href: '/apps/monetizemax/dashboard', desc: 'Revenue Optimization' },
  { name: 'AnalyticsPro', icon: BarChart3, color: '#6366F1', href: '/apps/analyticspro/dashboard', desc: 'Cross-Platform Analytics' },
  { name: 'ScheduleMaster', icon: Calendar, color: '#F97316', href: '/apps/schedulemaster/dashboard', desc: 'KI-Content Planer' },
  { name: 'FanConnect', icon: Heart, color: '#EF4444', href: '/apps/fanconnect/dashboard', desc: 'Community Management' },
  { name: 'CertificateGen', icon: Award, color: '#FBBF24', href: '/apps/certificategen/dashboard', desc: 'PDF/QR Zertifikate & Blockchain' },
    { name: 'Gate', icon: Shield, color: '#C9A84C', href: '/apps/gate/dashboard', desc: 'Central Ecosystem Router' },
];

export default function StargatePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          RealSync
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/login" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-sm bg-yellow-500/10 text-yellow-400 px-4 py-1 rounded-full border border-yellow-500/20 mb-6 inline-block">13 KI-Apps - 1 Plattform</span>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 mt-4">
            RealSync Creator OS
          </h1>
          <p className="text-gray-400 text-xl mb-4 max-w-2xl">Das KI-gesteuerte Oekosystem fuer Content Creators. Schuetze, monetarisiere und skaliere deinen Content.</p>
          <p className="text-gray-500 text-sm mb-8">C2PA | Blockchain | Wasserzeichen | QR-Zertifikate | Barcode</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors text-lg">
              Kostenlos starten
            </Link>
            <Link href="/pricing" className="border border-zinc-700 text-white px-8 py-3 rounded-xl font-semibold hover:border-zinc-500 transition-colors text-lg">
              Pakete ansehen
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Apps Grid */}
      <div className="px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {apps.map((app, i) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={app.href} className="block p-6 rounded-2xl border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group">
                <app.icon size={32} style={{ color: app.color }} className="mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg" style={{ color: app.color }}>{app.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{app.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-zinc-800 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Warum RealSync?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Immer Gratis', desc: 'Basis-Features fuer immer kostenlos. Keine Zeitbegrenzung. Keine versteckten Kosten.', icon: '🆓' },
              { title: 'Blockchain-Verifiziert', desc: 'Jeder Content wird mit C2PA, Wasserzeichen und Blockchain-Hash geschuetzt.', icon: '🔗' },
              { title: 'Skalierbar', desc: 'Von Free bis Gold - skaliere mit Bronze, Silber und Gold Paketen.', icon: '📈' },
            ].map((f) => (
              <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-8 py-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-gray-600 text-sm">© 2024 RealSyncDynamics. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-gray-500 hover:text-white text-sm">Pricing</Link>
            <Link href="/login" className="text-gray-500 hover:text-white text-sm">Login</Link>
            <Link href="/register" className="text-gray-500 hover:text-white text-sm">Registrieren</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
