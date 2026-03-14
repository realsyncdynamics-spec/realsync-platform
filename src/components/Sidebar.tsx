"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Calendar, CheckSquare, LayoutDashboard, LogOut, PlusCircle, Settings, Share2, ShieldCheck, Users, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/posts", icon: Share2, label: "Posts" },
  { href: "/dashboard/create", icon: PlusCircle, label: "Neuer Post" },
  { href: "/dashboard/social-accounts", icon: Users, label: "Social Accounts" },
  { href: "/dashboard/verify", icon: CheckSquare, label: "Verifikation" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/billing", icon: Zap, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Einstellungen" },
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
    <aside className="w-56 shrink-0 bg-zinc-900 border-r border-yellow-900/30 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-yellow-900/30">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-yellow-400 rounded flex items-center justify-center">
            <ShieldCheck size={15} className="text-zinc-950" />
          </div>
          <div>
            <div className="text-yellow-300 font-black text-sm leading-none">RealSync</div>
            <div className="text-yellow-800 text-xs font-mono leading-none mt-0.5">CREATOR VERIFY</div>
          </div>
        </Link>
        <div className="mt-3">
          <span className={`text-xs border px-2 py-0.5 rounded font-mono ${planColors[plan] ?? planColors.free}`}>
            {plan.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-all border ${
                active
                  ? "bg-yellow-950 text-yellow-300 border-yellow-800/60"
                  : "text-zinc-500 border-transparent hover:bg-zinc-800 hover:text-yellow-400 hover:border-yellow-900/40"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-yellow-900/30">
        <div className="text-xs text-zinc-600 truncate mb-2 font-mono">{user?.email}</div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-zinc-600 hover:text-yellow-500 transition-colors text-xs"
        >
          <LogOut size={12} />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
