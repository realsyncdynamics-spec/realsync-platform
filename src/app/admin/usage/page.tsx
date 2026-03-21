'use client';

const APP_USAGE = [
  { name: 'CreatorSeal', calls: '12.4k', users: 890, growth: '+18%', color: '#00D4FF' },
  { name: 'AdEngine', calls: '45.1k', users: 1240, growth: '+32%', color: '#FF6B35' },
  { name: 'TrendRadar', calls: '8.2k', users: 620, growth: '+9%', color: '#00FF88' },
  { name: 'ContentForge', calls: '28.7k', users: 980, growth: '+24%', color: '#A855F7' },
  { name: 'RightsGuard', calls: '5.1k', users: 340, growth: '+5%', color: '#2DD4BF' },
  { name: 'MediaVault', calls: '15.3k', users: 760, growth: '+14%', color: '#8B5CF6' },
  { name: 'BrandKit', calls: '9.8k', users: 520, growth: '+11%', color: '#EC4899' },
  { name: 'CollabHub', calls: '6.2k', users: 410, growth: '+8%', color: '#F59E0B' },
  { name: 'MonetizeMax', calls: '11.4k', users: 680, growth: '+21%', color: '#10B981' },
  { name: 'AnalyticsPro', calls: '19.6k', users: 870, growth: '+16%', color: '#6366F1' },
  { name: 'ScheduleMaster', calls: '14.2k', users: 730, growth: '+13%', color: '#F97316' },
  { name: 'FanConnect', calls: '7.8k', users: 490, growth: '+7%', color: '#EF4444' },
  { name: 'CertificateGen', calls: '3.4k', users: 280, growth: '+45%', color: '#FBBF24' },
];

export default function AdminUsagePage() {
  return (
    <div className="p-8 md:p-12 space-y-8">
      <div>
        <p className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-[0.5em] mb-2">App Usage</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Platform Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {APP_USAGE.map((app) => (
          <div key={app.name} className="bg-[#0B0F18] border border-white/5 p-5 rounded-[24px] hover:border-white/15 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-sm" style={{ color: app.color }}>{app.name}</h3>
              <span className="text-green-400 text-[10px] font-bold">{app.growth}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-xs">
              <span>{app.calls} calls</span>
              <span>{app.users} users</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
