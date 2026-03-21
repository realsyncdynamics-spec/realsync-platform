'use client';

const USERS = [
  { id: '1', name: 'Dominik Steiner', email: 'd.steiner@realsync.de', plan: 'Gold', status: 'Active', usage: '92%' },
  { id: '2', name: 'Laura Miller', email: 'laura@creator.io', plan: 'Silver', status: 'Active', usage: '45%' },
  { id: '3', name: 'Alex Rivera', email: 'alex@vault.com', plan: 'Bronze', status: 'Paused', usage: '12%' },
  { id: '4', name: 'Sarah Tech', email: 'sarah@ai.com', plan: 'Free', status: 'Active', usage: '98%' },
  { id: '5', name: 'Max Brenner', email: 'max@studio.de', plan: 'Silver', status: 'Active', usage: '67%' },
  { id: '6', name: 'Jana Weber', email: 'jana@content.de', plan: 'Gold', status: 'Active', usage: '81%' },
];

export default function AdminUsersPage() {
  return (
    <div className="p-8 md:p-12">
      <div className="mb-8">
        <p className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-[0.5em] mb-2">User Management</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Active Subscriptions</h1>
      </div>

      <div className="bg-[#0B0F18] border border-white/5 rounded-[32px] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500">{USERS.length} Users</p>
          <button className="text-[10px] font-mono text-[#C9A84C] uppercase border border-[#C9A84C]/30 px-4 py-1 rounded-full">Export CSV</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-black/20 text-[10px] font-mono uppercase text-gray-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{user.email}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.plan === 'Gold' ? 'bg-[#C9A84C] text-black' : user.plan === 'Silver' ? 'bg-gray-400 text-black' : user.plan === 'Bronze' ? 'bg-orange-700 text-white' : 'bg-white/10 text-white'}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="p-4">
                  <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: user.usage }} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 mt-1 block">{user.usage}</span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-2 text-[10px] font-mono uppercase ${user.status === 'Active' ? 'text-green-500' : 'text-orange-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
