'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PLANS, type PlanId } from '@/lib/plans';
import {
  Shield, Tv, FileText, Users, DollarSign, Palette,
  BarChart3, Calendar, Heart, Database, Scale, Award, Star, Zap,
} from 'lucide-react';

const APPS = [
  { name: 'CreatorSeal',    icon: Shield,    color: '#C9A84C', href: '/apps/creatorseal/dashboard',  desc: 'Verifikation & C2PA' },
  { name: 'ReviewRadar',    icon: Star,      color: '#3B82F6', href: '/apps/reviewradar/dashboard',   desc: 'Review-Management' },
  { name: 'ChurnRescue',    icon: DollarSign,color: '#EF4444', href: '/apps/churnrescue/dashboard',   desc: 'Failed Payments' },
  { name: 'WaitlistKit',    icon: Users,     color: '#8B5CF6', href: '/apps/waitlistkit/dashboard',   desc: 'Viral Waitlist' },
  { name: 'AdEngine',       icon: Tv,        color: '#FF6888', href: '/apps/adengine/dashboard',      desc: 'KI-Ad Generator' },
  { name: 'Optimus KI',     icon: Zap,       color: '#60D0FF', href: '/optimus',                      desc: '9 KI-Modelle' },
  { name: 'BrandKit',       icon: Palette,   color: '#EC4899', href: '/apps/brandkit/dashboard',      desc: 'Brand Identity' },
  { name: 'AnalyticsPro',   icon: BarChart3, color: '#6366F1', href: '/apps/analyticspro/dashboard',  desc: 'Analytics & BI' },
  { name: 'ContentForge',   icon: FileText,  color: '#A855F7', href: '/apps/contentforge/dashboard',  desc: 'Content-Erstellung' },
  { name: 'RightsGuard',    icon: Scale,     color: '#2DD4BF', href: '/apps/rightsguard/dashboard',   desc: 'DRM & Rechte' },
  { name: 'MediaVault',     icon: Database,  color: '#8B5CF6', href: '/apps/mediavault/dashboard',    desc: 'Medienspeicher' },
  { name: 'ScheduleMaster', icon: Calendar,  color: '#F97316', href: '/apps/schedulemaster/dashboard',desc: 'Redaktionsplan' },
  { name: 'FanConnect',     icon: Heart,     color: '#EF4444', href: '/apps/fanconnect/dashboard',    desc: 'Community' },
  { name: 'CertificateGen', icon: Award,     color: '#FBBF24', href: '/apps/certificategen/dashboard',desc: 'Zertifikate' },
];

interface Profile {
  full_name: string | null;
  username: string;
  plan_id: PlanId;
  trust_score: number | null;
  coin_balance: number;
  verify_level: number | null;
}

interface Verification {
  id: string;
  content_type: string;
  filename: string | null;
  trust_score: number | null;
  created_at: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [{ data: prof }, { data: veri }] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name,username,plan_id,trust_score,coin_balance,verify_level')
          .eq('id', user.id)
          .single(),
        supabase
          .from('verifications')
          .select('id,content_type,filename,trust_score,created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setProfile(prof as Profile | null);
      setVerifications((veri as Verification[]) || []);
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const planId: PlanId = profile?.plan_id || 'gratis';
  const plan = PLANS[planId];
  const displayName = profile?.full_name || profile?.username || 'Creator';

  return (
    <div className="p-6 max-w-6xl">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {loading ? 'Dashboard' : `Willkommen, ${displayName.split(' ')[0]}!`}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {loading ? 'Lädt…' : `${plan.emoji} ${plan.name} · Trust Score: ${profile?.trust_score?.toFixed(1) ?? '—'}`}
          </p>
        </div>
        <Link
          href="/hub"
          className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-yellow-600 hover:text-yellow-400 transition-colors"
        >
          Creator Hub →
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Aktueller Plan',
            value: loading ? '…' : `${plan.emoji} ${plan.name}`,
            sub: loading ? '' : plan.tagline,
            color: plan.color,
            href: '/dashboard/billing',
          },
          {
            label: 'Trust Score',
            value: loading ? '…' : (profile?.trust_score?.toFixed(1) ?? '—'),
            sub: 'CreatorSeal',
            color: '#00C853',
            href: '/apps/creatorseal/dashboard',
          },
          {
            label: 'Verify Level',
            value: loading ? '…' : `Lv. ${profile?.verify_level ?? 1}`,
            sub: `Max Lv. ${plan.verifyLevel}`,
            color: '#C9A84C',
            href: '/apps/creatorseal/dashboard',
          },
          {
            label: 'Coins',
            value: loading ? '…' : (profile?.coin_balance ?? 0).toLocaleString('de-DE'),
            sub: 'Optimus-Guthaben',
            color: '#8B5CF6',
            href: '/optimus',
          },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} className="block bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-colors">
            <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-zinc-600 mt-1 truncate">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Apps grid */}
      <h2 className="text-sm font-semibold text-zinc-400 mb-3 tracking-wider uppercase">Deine Apps</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {APPS.map(app => (
          <Link
            key={app.name}
            href={app.href}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-center group"
          >
            <app.icon size={22} style={{ color: app.color }} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-zinc-300 leading-tight">{app.name}</span>
            <span className="text-[10px] text-zinc-600 leading-tight hidden md:block">{app.desc}</span>
          </Link>
        ))}
      </div>

      {/* Recent verifications */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-300">Letzte Verifikationen</h3>
          <Link href="/apps/creatorseal/dashboard" className="text-xs text-yellow-600 hover:text-yellow-400">
            Alle ansehen →
          </Link>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-xs text-zinc-600">Lädt…</div>
        ) : verifications.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-zinc-500 mb-3">Noch keine Inhalte verifiziert</p>
            <Link
              href="/apps/creatorseal/dashboard"
              className="inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs rounded-lg hover:bg-yellow-500/20 transition-colors"
            >
              🛡 Ersten Inhalt verifizieren
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {verifications.map(v => (
              <div key={v.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-zinc-300 truncate max-w-xs">
                      {v.filename || `${v.content_type} verifiziert`}
                    </p>
                    <p className="text-xs text-zinc-600 capitalize">{v.content_type}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {v.trust_score !== null && (
                    <p className="text-sm font-bold text-green-400">{v.trust_score.toFixed(1)}</p>
                  )}
                  <p className="text-xs text-zinc-600">
                    {new Date(v.created_at).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
