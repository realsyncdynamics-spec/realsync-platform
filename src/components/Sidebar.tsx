"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, BookOpen, Bot, Brain, CheckSquare, Eye,
  Hammer, LayoutDashboard, LogOut, Megaphone,
  Settings, Shield, Trophy, Users, Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navGroups = [
  {
    label: "CORE",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "#ffd700" },
      { href: "/dashboard/verify", icon: CheckSquare, label: "CreatorSeal", color: "#ffd700" },
      { href: "/dashboard/analytics", icon: BarChart3, label: "DataCore", color: "#06b6d4" },
      { href: "/dashboard/market-scanner", icon: Megaphone, label: "AdEngine", color: "#f43f5e" },
    ],
  },
  {
    label: "KI & TOOLS",
    items: [
      { href: "/dashboard/optimus", icon: Brain, label: "Optimus", color: "#00e5ff" },
      { href: "/dashboard/app-builder", icon: Bot, label: "AutoOS", color: "#f97316" },
      { href: "/dashboard/agenten", icon: Zap, label: "FlowSync", color: "#8b5cf6" },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { href: "/dashboard/social-automation", icon: Users, label: "SocialHub", color: "#10b981" },
      { href: "/dashboard/wettbewerb", icon: Trophy, label: "Wettbewerb", color: "#eab308" },
    ],
  },
  {
    label: "BILDUNG",
    items: [
      { href: "/dashboard/schullabor", icon: BookOpen, label: "EduLab", color: "#84cc16" },
    ],
  },
  {
    label: "BUSINESS",
    items: [
      { href: "/dashboard/handwerk", icon: Hammer, label: "Handwerk", color: "#f59e0b" },
      { href: "/dashboard/sicherheit", icon: Shield, label: "Sicherheit", color: "#22c55e" },
      { href: "/dashboard/billing", icon: Zap, label: "Billing", color: "#ffd700" },
      { href: "/dashboard/settings", icon: Settings, label: "Einstellungen", color: "#9ca3af" },
    ],
  },
];

export default function Sidebar({ user, plan }: { user: any; plan: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await createClient().auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-zinc-950 border-r border-zinc-800/60 flex flex-col py-4 px-3">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
          <span className="text-yellow-400 font-black text-sm">R</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-wide text-yellow-400">RealSync</span>
          <span className="text-[9px] text-zinc-500 tracking-[0.2em]">CREATOR OS</span>
        </div>
        <span className={`ml-auto px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider border ${
          plan === "diamant" ? "border-blue-300/40 text-blue-300 bg-blue-300/10" :
          plan === "platin"  ? "border-cyan-400/40 text-cyan-400 bg-cyan-400/10" :
          plan === "gold"    ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10" :
          plan === "silber"  ? "border-gray-400/40 text-gray-300 bg-gray-400/10" :
          plan === "bronze"  ? "border-orange-600/40 text-orange-500 bg-orange-600/10" :
          "border-zinc-700 text-zinc-500 bg-zinc-800"
        }`}>{plan.toUpperCase()}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[9px] font-bold tracking-[0.2em] text-zinc-600 px-2 mb-2">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label, color }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 group ${
                      active
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    <Icon size={15} style={{ color: active ? color : undefined }} className={active ? "" : "text-zinc-600 group-hover:text-zinc-400"} />
                    <span>{label}</span>
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-zinc-800/60 pt-3 mt-3 px-2">
        <div className="text-[10px] text-zinc-600 truncate mb-2">{user?.email}</div>
        <button onClick={logout} className="flex items-center gap-2 text-xs text-zinc-600 hover:text-red-400 transition-colors">
          <LogOut size={13} /> Abmelden
        </button>
      </div>
    </aside>
  );
}
