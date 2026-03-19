"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain, CheckSquare, Eye, Shield, Trophy, Hammer, BarChart3,
  Bot, Users, Megaphone, Zap, BookOpen, Star, Activity
} from "lucide-react";
import { useState, useEffect } from "react";

const apps = [
  { slug: "optimus", label: "Optimus", icon: Brain, color: "#00e5ff", status: "LIVE", angle: 270 },
  { slug: "verify", label: "CreatorSeal", icon: Star, color: "#ffd700", status: "LIVE", angle: 300 },
  { slug: "sicherheit", label: "Gate", icon: Eye, color: "#a855f7", status: "LIVE", angle: 330 },
  { slug: "market-scanner", label: "AdEngine", icon: Megaphone, color: "#f43f5e", status: "BETA", angle: 0 },
  { slug: "analytics", label: "DataCore", icon: BarChart3, color: "#06b6d4", status: "LIVE", angle: 30 },
  { slug: "app-builder", label: "AutoOS", icon: Bot, color: "#f97316", status: "LIVE", angle: 60 },
  { slug: "social-automation", label: "SocialHub", icon: Users, color: "#10b981", status: "LIVE", angle: 90 },
  { slug: "schullabor", label: "EduLab", icon: BookOpen, color: "#84cc16", status: "BETA", angle: 120 },
  { slug: "handwerk", label: "Handwerk", icon: Hammer, color: "#f59e0b", status: "LIVE", angle: 150 },
  { slug: "wettbewerb", label: "Wettbewerb", icon: Trophy, color: "#eab308", status: "LIVE", angle: 210 },
  { slug: "sicherheit", label: "Sicherheit", icon: Shield, color: "#22c55e", status: "LIVE", angle: 180 },
  { slug: "agenten", label: "FlowSync", icon: Zap, color: "#8b5cf6", status: "BETA", angle: 240 },
];

const agents = [
  { name: "Llama 3.1", status: "STANDBY", color: "#06b6d4" },
  { name: "Claude Sonnet", status: "PRIMARY", color: "#a855f7" },
  { name: "DeepSeek R1", status: "STANDBY", color: "#f43f5e" },
  { name: "Perplexity AI", status: "PRIMARY", color: "#ffd700" },
];

interface Props {
  user: any;
  stats: { totalPosts: number; publishedPosts: number; scheduledPosts: number; socialAccounts: number };
  subscription: any;
  recentPosts: any[];
  tenantId: string;
}

export default function DashboardClient({ user, stats, subscription, recentPosts }: Props) {
  const [time, setTime] = useState(new Date());
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const radius = 260;
  const centerX = 350;
  const centerY = 350;

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Agent Status Bar */}
      <div className="w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-4 py-2 flex items-center gap-6 text-xs font-mono overflow-x-auto">
        <span className="text-yellow-400 font-bold tracking-widest">AGENT-STATUS</span>
        {agents.map((a) => (
          <span key={a.name} className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-bold" style={{ color: a.color }}>{a.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              a.status === "PRIMARY" ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/40" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}>{a.status}</span>
          </span>
        ))}
      </div>

      {/* Main Orbit Area */}
      <div className="relative flex items-center justify-center" style={{ height: "calc(100vh - 90px)" }}>
        {/* Center Logo */}
        <div className="absolute flex flex-col items-center justify-center z-10">
          <div className="w-32 h-32 rounded-full border-2 border-yellow-500/50 bg-zinc-900/80 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.15)]">
            <span className="text-lg font-black tracking-wider text-yellow-400">RealSync</span>
            <span className="text-[10px] text-yellow-600 tracking-[0.3em] font-bold">DYNAMICS</span>
          </div>
          <span className="mt-2 text-[10px] text-zinc-500 tracking-widest">CREATOR OS</span>
        </div>

        {/* Orbit Ring */}
        <svg className="absolute" width="700" height="700" viewBox="0 0 700 700">
          <circle cx="350" cy="350" r={radius} fill="none" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
          <circle cx="350" cy="350" r={radius - 40} fill="none" stroke="rgba(255,215,0,0.04)" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="350" cy="350" r={radius + 40} fill="none" stroke="rgba(255,215,0,0.04)" strokeWidth="1" strokeDasharray="4 8" />
        </svg>

        {/* App Nodes */}
        {apps.map((app) => {
          const rad = (app.angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(rad);
          const y = centerY + radius * Math.sin(rad);
          const Icon = app.icon;
          const isHovered = hoveredApp === app.slug;

          return (
            <Link
              key={app.slug + app.angle}
              href={`/dashboard/${app.slug}`}
              className="absolute flex flex-col items-center group transition-transform duration-200"
              style={{
                left: `calc(50% - 350px + ${x}px)`,
                top: `calc(50% - 350px + ${y}px)`,
                transform: `translate(-50%, -50%) ${isHovered ? "scale(1.15)" : "scale(1)"}`,
              }}
              onMouseEnter={() => setHoveredApp(app.slug)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                style={{
                  borderColor: app.color,
                  backgroundColor: `${app.color}10`,
                  boxShadow: isHovered ? `0 0 30px ${app.color}40, 0 0 60px ${app.color}20` : `0 0 15px ${app.color}15`,
                }}
              >
                <Icon size={28} style={{ color: app.color }} />
              </div>
              <span className="mt-2 text-xs font-bold tracking-wide" style={{ color: app.color }}>
                {app.label}
              </span>
              <span className={`mt-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                app.status === "LIVE"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {app.status}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Status Ticker */}
      <div className="fixed bottom-0 left-0 w-full border-t border-zinc-800 bg-zinc-950/95 backdrop-blur px-4 py-1.5 flex items-center gap-8 text-[10px] font-mono overflow-x-auto">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">LIVE</span>
        </span>
        <span className="text-zinc-500">AI Optimus · Perplexity-First · 9 Modelle <span className="text-emerald-400 font-bold">ONLINE</span></span>
        <span className="text-zinc-500">DATA DataCore · Comet-powered Marktdaten <span className="text-emerald-400 font-bold">LIVE</span></span>
        <span className="text-zinc-500">Posts: <span className="text-yellow-400">{stats.totalPosts}</span> · Published: <span className="text-yellow-400">{stats.publishedPosts}</span> · Scheduled: <span className="text-yellow-400">{stats.scheduledPosts}</span></span>
        <span className="text-zinc-500">Accounts: <span className="text-cyan-400">{stats.socialAccounts}</span></span>
        <span className="ml-auto text-zinc-600">{time.toLocaleTimeString("de-DE")}</span>
      </div>
    </div>
  );
}
