import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Database, Zap, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminNav = [
    { icon: <LayoutDashboard size={18} />, label: 'Overview', href: '/admin' },
    { icon: <Users size={18} />, label: 'User Management', href: '/admin/users' },
    { icon: <DollarSign size={18} />, label: 'Revenue & Stripe', href: '/admin/revenue' },
    { icon: <Zap size={18} />, label: 'AI Cost Tracker', href: '/admin/ai-costs' },
    { icon: <Database size={18} />, label: 'App Usage', href: '/admin/usage' },
    { icon: <Settings size={18} />, label: 'System Health', href: '/admin/health' },
  ];

  return (
    <div className="min-h-screen bg-[#03050A] text-white flex">
      <aside className="w-64 border-r border-white/5 bg-[#0B0F18] flex flex-col p-6 fixed h-full z-50">
        <div className="mb-10 px-2 font-black italic tracking-tighter text-xl flex items-center gap-2">
          <span className="w-6 h-6 bg-[#C9A84C] rounded-sm flex items-center justify-center text-[10px] text-black">A</span>
          REALSYNC <span className="text-[#C9A84C]">ADMIN</span>
        </div>
        <nav className="space-y-1 flex-1">
          {adminNav.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-[#C9A84C] transition-all text-xs font-mono uppercase tracking-widest">
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-6 text-[8px] font-mono text-gray-600 uppercase tracking-[0.4em]">
          Core v1.0.8-stable
        </div>
      </aside>
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
