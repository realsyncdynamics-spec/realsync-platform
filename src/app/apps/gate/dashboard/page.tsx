'use client';

import { Shield, Activity, Cpu, CreditCard, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

const APP_STATS = [
  { name: 'CreatorSeal', calls: '12.4k', cost: '42 EUR', revenue: '840 EUR', color: '#00D4FF' },
  { name: 'AdEngine', calls: '45.1k', cost: '128 EUR', revenue: '1.240 EUR', color: '#FF6B35' },
  { name: 'TrendRadar', calls: '8.2k', cost: '15 EUR', revenue: '450 EUR', color: '#00FF88' },
  { name: 'DataCore', calls: '125.0k', cost: '210 EUR', revenue: '2.100 EUR', color: '#6366F1' },
];

const ROUTING_LOG = [
  { time: '08:32PM', from: 'CreatorSeal', to: 'DataCore', action: 'Syncing Trust Score', color: '#F0C040' },
  { time: '08:35PM', from: 'AdEngine', to: 'ScheduleMaster', action: 'Pushing Creative to Queue', color: '#FF6888' },
  { time: '08:38PM', from: 'TrendRadar', to: 'ContentForge', action: 'Trend → Content Pipeline', color: '#00FF88' },
  { time: '08:41PM', from: 'FanConnect', to: 'AnalyticsPro', action: 'Sentiment Data Sync', color: '#A78BFA' },
];

export default function GateDashboard() {
  return (
    <div className="min-h-screen bg-[#03050A] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">GATEWAY CORE</h1>
          <p className="text-[10px] font-mono text-[#C9A84C] tracking-[0.4em] uppercase mt-2">Central Ecosystem Router</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0B0F18] border border-[#C9A84C]/20 p-6 rounded-3xl">
            <Shield className="text-[#C9A84C] mb-4" size={24} />
            <p className="text-[10px] font-mono uppercase text-gray-500">System Load</p>
            <p className="text-2xl font-bold">Optimal</p>
          </div>
          <div className="bg-[#0B0F18] border border-[#2DD4BF]/20 p-6 rounded-3xl">
            <Activity className="text-[#2DD4BF] mb-4" size={24} />
            <p className="text-[10px] font-mono uppercase text-gray-500">Active Agents</p>
            <p className="text-2xl font-bold">13 / 13</p>
          </div>
          <div className="bg-[#0B0F18] border border-[#00F0FF]/20 p-6 rounded-3xl">
            <Cpu className="text-[#00F0FF] mb-4" size={24} />
            <p className="text-[10px] font-mono uppercase text-gray-500">API Calls Today</p>
            <p className="text-2xl font-bold">190.7k</p>
          </div>
          <div className="bg-[#0B0F18] border border-[#F0C040]/20 p-6 rounded-3xl">
            <CreditCard className="text-[#F0C040] mb-4" size={24} />
            <p className="text-[10px] font-mono uppercase text-gray-500">AI Cost Today</p>
            <p className="text-2xl font-bold">395 EUR</p>
          </div>
        </div>

        {/* Routing Log */}
        <div className="p-8 bg-[#0B0F18] border border-white/5 rounded-[40px]">
          <h2 className="text-xl font-bold mb-6 italic">Inter-App Routing Log</h2>
          <div className="space-y-3 font-mono text-[11px]">
            {ROUTING_LOG.map((log, i) => (
              <div key={i} style={{ color: log.color }}>
                ● [{log.time}] {log.from} → {log.to}: {log.action}
              </div>
            ))}
          </div>
        </div>

        {/* App Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {APP_STATS.map((app) => (
            <div key={app.name} className="p-6 bg-[#0B0F18] border border-white/5 rounded-[24px]">
              <h3 className="text-xs font-mono uppercase text-gray-500 mb-4">{app.name}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-600 font-mono">Revenue</p>
                  <p className="text-xl font-black italic">{app.revenue}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-600 font-mono">AI Cost</p>
                  <p className="text-sm font-bold text-red-400">-{app.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="flex gap-4">
          <Link href="/admin" className="bg-[#C9A84C] text-black px-6 py-3 font-bold uppercase text-xs rounded-lg">
            Admin Panel
          </Link>
          <Link href="/dashboard" className="border border-white/10 px-6 py-3 font-bold uppercase text-xs rounded-lg hover:border-white/30">
            User Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
