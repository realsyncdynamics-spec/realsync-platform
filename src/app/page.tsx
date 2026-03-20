'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Tv, TrendingUp, FileText, Users, DollarSign, Palette, BarChart3, Calendar, Heart, Database, Scale } from 'lucide-react';

const apps = [
  { name: 'CreatorSeal', icon: Shield, color: '#00D4FF', href: '/apps/creatorseal', desc: 'Deepfake Protection & C2PA' },
  { name: 'AdEngine', icon: Tv, color: '#FF6B35', href: '/apps/adengine', desc: 'KI-Ad Generator' },
  { name: 'TrendRadar', icon: TrendingUp, color: '#00FF88', href: '/apps/trendradar', desc: 'Viral Trend Detection' },
  { name: 'ContentForge', icon: FileText, color: '#A855F7', href: '/apps/contentforge', desc: 'KI-Content Erstellung' },
  { name: 'RightsGuard', icon: Scale, color: '#2DD4BF', href: '/apps/rightsguard', desc: 'Digital Rights Management' },
  { name: 'MediaVault', icon: Database, color: '#8B5CF6', href: '/apps/mediavault', desc: 'Sicherer Cloud-Speicher' },
  { name: 'BrandKit', icon: Palette, color: '#EC4899', href: '/apps/brandkit', desc: 'KI-Brand Identity' },
  { name: 'CollabHub', icon: Users, color: '#F59E0B', href: '/apps/collabhub', desc: 'Creator Collaboration' },
  { name: 'MonetizeMax', icon: DollarSign, color: '#10B981', href: '/apps/monetizemax', desc: 'Revenue Optimization' },
  { name: 'AnalyticsPro', icon: BarChart3, color: '#6366F1', href: '/apps/analyticspro', desc: 'Cross-Platform Analytics' },
  { name: 'ScheduleMaster', icon: Calendar, color: '#F97316', href: '/apps/schedulemaster', desc: 'KI-Content Planer' },
  { name: 'FanConnect', icon: Heart, color: '#EF4444', href: '/apps/fanconnect', desc: 'Community Management' },
];

export default function StargatePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
      >
        RealSync Creator OS
      </motion.h1>
      <p className="text-gray-400 text-lg mb-12">Stargate Orbital Hub - 12 KI-Apps fuer Content Creators</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl">
        {apps.map((app, i) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={app.href} className="block p-6 rounded-2xl border border-gray-800 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 transition-all group">
              <app.icon size={32} style={{ color: app.color }} className="mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg" style={{ color: app.color }}>{app.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{app.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
      <p className="text-gray-600 text-sm mt-12">Powered by RealSyncDynamics - Alle Apps mit Stripe Integration</p>
    </div>
  );
}
