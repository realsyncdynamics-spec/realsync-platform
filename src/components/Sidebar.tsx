"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, BookOpen, Bot, Brain, CheckSquare, FlaskConical,
  Hammer, LayoutDashboard, Link2, LogOut, Megaphone, MessageSquare,
  Search, Settings, Shield, ShieldCheck, Sparkles, Trophy, Users, Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navGroups = [
  {
    label: "CORE",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/dashboard/verify", icon: CheckSquare, label: "CreatorSeal" },
      { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
      { href: "/dashboard/market-scanner", icon: Search, label: "MarketScanner" },
      { href: "/dashboard/campaigns", icon: Megaphone, label: "Campaigns" },
    ],
  },
  {
    label: "KI & TOOLS",
    items: [
      { href: "/dashboard/optimus", icon: Brain, label: "Optimus" },
      { href: "/dashboard/link-magic", icon: Link2, label: "Link-Magic" },
      { href: "/dashboard/app-builder", icon: Sparkles, label: "AppBuilder" },
      { href: "/dashboard/agenten", icon: Bot, label: "Agenten" },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { href: "/dashboard/social-automation", icon: Users, label: "SozialNetzwerk" },
      { href: "/dashboard/community", icon: MessageSquare, label: "Community" },
      { href: "/dashboard/wettbewerb", icon: Trophy, label: "Wettbewerb" },
    ],
  },
  {
    label: "BILDUNG",
    items: [
      { href: "/dashboard/schullabor", icon: FlaskConical, label: "SchulLabor" },
      { href: "/dashboard/bildung", icon: BookOpen, label: "Bildung" },
    ],
  },
  {
    label: "BUSINESS",
    items: [
      { href: "/dashboard/handwerk", icon: Hammer, label: "Handwerk" },
      { href: "/dashboard/sicherheit", icon: Shield, label: "Sicherheit" },
      { href: "/dashboard/billing", icon: Zap, label: "Billing" },
      { href: "/dashboard/settings", icon: Settings, label: "Einstellungen" },
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
  const planColors: Record<string, string> = {
    free: "border-zinc-700 text-zinc-400",
    starter: "border-yellow-800 text-yellow-600",
    pro: "border-yellow-600 text-yellow-400",
    enterprise: "border-yellow-400 text-yellow-300",
  };
  return (
    <aside className="w-56 shrink-0 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-yellow-400 rounded-md flex items-center justify-center">
            <ShieldCheck size={14} className="text-zinc-950" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none tracking-tight">RealSync</div>
            <div className="text-zinc-600 text-[10px] font-mono leading-none mt-0.5 uppercase tracking-widest">Platform</div>
          </div>
        </Link>
        <div className="mt-3">
          <span className={`text-[10px] border px-2 py-0.5 rounded-full font-mono ${planColors[plan] ?? planColors.free}`}>
            {plan.toUpperCase()}
          </span>
        </div>
      </div>
      {/* Nav Groups */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1 text-[9px] font-mono text-zinc-600 tracking-widest uppercase">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                      active
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      {/* User */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <div className="text-[10px] text-zinc-600 truncate mb-2 font-mono">{user?.email}</div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 transition-colors text-xs"
        >
          <LogOut size={12} />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
