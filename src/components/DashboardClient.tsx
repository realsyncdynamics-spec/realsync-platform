"use client";
import { BarChart3, Calendar, CheckCircle, Instagram, LayoutDashboard, LogOut, PlusCircle, Settings, Share2, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Toaster } from "react-hot-toast";

interface Props {
  user: any;
  stats: { totalPosts: number; publishedPosts: number; scheduledPosts: number; socialAccounts: number };
  subscription: any;
  recentPosts: any[];
  tenantId: string;
}

export default function DashboardClient({ user, stats, subscription, recentPosts }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const planLabel = (plan: string) => (plan ?? "free").toUpperCase();

  const statusColor = (s: string) => ({
    published: "text-yellow-400",
    scheduled: "text-yellow-300",
    draft: "text-zinc-500",
    failed: "text-red-500",
    publishing: "text-yellow-200",
  }[s] ?? "text-zinc-500");

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/posts", icon: Share2, label: "Posts" },
    { href: "/dashboard/create", icon: PlusCircle, label: "Neuer Post" },
    { href: "/dashboard/social-accounts", icon: Instagram, label: "Social Accounts" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/billing", icon: Zap, label: "Billing" },
    { href: "/dashboard/settings", icon: Settings, label: "Einstellungen" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-yellow-50 flex">
      <Toaster position="top-right" toastOptions={{ style: { background: "#18181b", color: "#fef08a", border: "1px solid #713f12" } }} />

      {/* Sidebar */}
      <aside className="w-60 bg-zinc-900 border-r border-yellow-900/40 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-yellow-900/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-yellow-400 rounded flex items-center justify-center font-black text-zinc-950 text-sm">R</div>
            <span className="font-bold text-yellow-300 tracking-wide">RealSync</span>
          </div>
          <div className="mt-2">
            <span className="text-xs border border-yellow-700 text-yellow-400 px-2 py-0.5 rounded-sm font-mono">
              {planLabel(subscription?.plan)}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-zinc-400 hover:bg-yellow-950 hover:text-yellow-300 border border-transparent hover:border-yellow-900/60 transition-all text-sm"
            >
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-yellow-900/40">
          <div className="text-xs text-zinc-500 mb-2 truncate">{user.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-yellow-400 transition-colors text-xs"
          >
            <LogOut size={13} />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-yellow-300 tracking-tight">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Willkommen zurück, {user.email.split("@")[0]}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Gesamt Posts", value: stats.totalPosts, icon: Share2 },
              { label: "Veröffentlicht", value: stats.publishedPosts, icon: CheckCircle },
              { label: "Geplant", value: stats.scheduledPosts, icon: Calendar },
              { label: "Social Accounts", value: stats.socialAccounts, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-zinc-900 border border-yellow-900/40 rounded-lg p-4 hover:border-yellow-700/60 transition-colors">
                <Icon size={16} className="text-yellow-500 mb-2" />
                <div className="text-2xl font-bold text-yellow-300">{value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            {/* Quick Actions */}
            <div className="bg-zinc-900 border border-yellow-900/40 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-yellow-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <TrendingUp size={14} /> Schnellaktionen
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/dashboard/create", icon: PlusCircle, label: "Post erstellen", accent: true },
                  { href: "/dashboard/social-accounts", icon: Instagram, label: "Account verbinden", accent: false },
                  { href: "/dashboard/posts", icon: Calendar, label: "Geplante Posts", accent: false },
                  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics", accent: false },
                ].map(({ href, icon: Icon, label, accent }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded border text-xs font-medium transition-all ${
                      accent
                        ? "bg-yellow-400 text-zinc-950 border-yellow-400 hover:bg-yellow-300"
                        : "bg-zinc-800 border-yellow-900/40 text-zinc-300 hover:border-yellow-700/60 hover:text-yellow-300"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-zinc-900 border border-yellow-900/40 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-yellow-400 mb-4 uppercase tracking-widest">Letzte Posts</h2>
              {recentPosts.length === 0 ? (
                <div className="text-center text-zinc-600 py-8">
                  <Share2 size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Noch keine Posts</p>
                  <Link href="/dashboard/create" className="text-yellow-500 text-xs hover:text-yellow-300 mt-2 block">
                    Ersten Post erstellen →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentPosts.map((post: any) => (
                    <div key={post.id} className="p-3 bg-zinc-800 border border-yellow-900/30 rounded">
                      <p className="text-xs text-zinc-300 truncate">{post.content.substring(0, 70)}...</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs font-mono ${statusColor(post.status)}`}>{post.status}</span>
                        <span className="text-zinc-600 text-xs">• {post.platform}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upgrade Banner */}
          {(!subscription || subscription?.plan === "free") && (
            <div className="border border-yellow-700/60 bg-yellow-950/30 rounded-lg p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-300">Upgrade zu Pro</h3>
                <p className="text-zinc-400 text-xs mt-1">5.000 Posts/Monat • 10 Team-Mitglieder • Erweiterte Analytics</p>
              </div>
              <Link
                href="/dashboard/billing"
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-zinc-950 px-5 py-1.5 rounded text-sm font-semibold transition-all"
              >
                Upgrade
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
