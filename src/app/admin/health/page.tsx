'use client';

const SERVICES = [
  { label: 'Supabase DB', status: 'Operational', latency: '12ms', warning: false },
  { label: 'Vercel Edge', status: 'Operational', latency: '8ms', warning: false },
  { label: 'Perplexity API', status: 'Degraded', latency: '450ms', warning: true },
  { label: 'Gemini AI', status: 'Operational', latency: '180ms', warning: false },
  { label: 'Stripe Connect', status: 'Operational', latency: '24ms', warning: false },
  { label: 'Comet Agent', status: 'Operational', latency: '95ms', warning: false },
  { label: 'Blockchain RPC', status: 'Operational', latency: '340ms', warning: false },
];

export default function AdminHealthPage() {
  return (
    <div className="p-8 md:p-12 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-[0.5em] mb-2">System Health</p>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Infrastructure</h1>
        </div>
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-green-500 uppercase font-bold">All Systems Nominal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0B0F18] border border-white/5 p-6 rounded-[32px]">
          <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Uptime (30d)</p>
          <p className="text-4xl font-black italic text-green-400">99.96%</p>
        </div>
        <div className="bg-[#0B0F18] border border-white/5 p-6 rounded-[32px]">
          <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Avg Response Time</p>
          <p className="text-4xl font-black italic text-cyan-400">158ms</p>
        </div>
      </div>

      <div className="bg-[#0B0F18] border border-white/5 rounded-[32px] p-8">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500 mb-8">Service Status</h2>
        <div className="space-y-6">
          {SERVICES.map((s) => (
            <div key={s.label} className="flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${s.warning ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{s.label}</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono ${s.warning ? 'text-orange-500' : 'text-green-500'}`}>{s.status}</span>
                <span className="text-[8px] font-mono text-gray-600 ml-3">{s.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
