'use client';

const AI_COSTS = [
  { agent: 'Perplexity', calls: '89.2k', cost: '412 EUR', model: 'sonar', status: 'Active' },
  { agent: 'Gemini', calls: '62.1k', cost: '285 EUR', model: 'gemini-pro', status: 'Active' },
  { agent: 'Comet', calls: '34.5k', cost: '98 EUR', model: 'browser-agent', status: 'Active' },
  { agent: 'Mistral', calls: '4.8k', cost: '32 EUR', model: 'mistral-large', status: 'Standby' },
  { agent: 'Claude', calls: '1.2k', cost: '15 EUR', model: 'claude-3', status: 'Standby' },
];

export default function AdminAICostsPage() {
  const totalCost = AI_COSTS.reduce((sum, a) => sum + parseInt(a.cost), 0);
  return (
    <div className="p-8 md:p-12 space-y-8">
      <div>
        <p className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-[0.5em] mb-2">AI Cost Tracker</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Agent Expenses</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B0F18] border border-red-500/20 p-6 rounded-[32px]">
          <p className="text-[10px] font-mono uppercase text-gray-500">Total AI Cost (mtl.)</p>
          <p className="text-3xl font-black italic text-red-400">842 EUR</p>
        </div>
        <div className="bg-[#0B0F18] border border-green-500/20 p-6 rounded-[32px]">
          <p className="text-[10px] font-mono uppercase text-gray-500">Revenue / Cost Ratio</p>
          <p className="text-3xl font-black italic text-green-400">17.6x</p>
        </div>
        <div className="bg-[#0B0F18] border border-cyan-500/20 p-6 rounded-[32px]">
          <p className="text-[10px] font-mono uppercase text-gray-500">Total API Calls</p>
          <p className="text-3xl font-black italic text-cyan-400">191.8k</p>
        </div>
      </div>

      <div className="bg-[#0B0F18] border border-white/5 rounded-[32px] overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500">Agent Breakdown</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-black/20 text-[10px] font-mono uppercase text-gray-500">
            <tr>
              <th className="p-4">Agent</th>
              <th className="p-4">Model</th>
              <th className="p-4">API Calls</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {AI_COSTS.map((a) => (
              <tr key={a.agent} className="border-t border-white/5 hover:bg-white/5">
                <td className="p-4 font-bold">{a.agent}</td>
                <td className="p-4 text-[10px] font-mono text-gray-400">{a.model}</td>
                <td className="p-4">{a.calls}</td>
                <td className="p-4 text-red-400 font-bold">{a.cost}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-mono uppercase ${a.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
