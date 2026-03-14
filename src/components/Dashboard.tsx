"use client";
import { useState } from "react";

export default function Dashboard({ user, profile, userTenants, tenantApps, allApps }: any) {
  const tenant = profile?.tenants;

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <span className="text-black font-black text-lg">R</span>
            </div>
            <span className="text-xl font-bold">RealSync</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">{tenant?.name}</span>
            <span className="text-sm text-white/40">{user?.email}</span>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-white/60 mb-8">Willkommen bei RealSync Platform</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tenantApps?.map((ta: any) => (
            <a key={ta.id} href={ta.app?.base_url || "#"}
              className="glass-card rounded-2xl p-6 hover:border-cyan-500/50 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-lg">{ta.app?.name?.[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{ta.app?.name}</h3>
                  <span className="text-xs text-cyan-400 uppercase">{ta.plan}</span>
                </div>
              </div>
              <p className="text-sm text-white/60">{ta.app?.description}</p>
            </a>
          ))}
        </div>
        <h2 className="text-xl font-bold mb-4">Weitere Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allApps?.filter((a: any) => !tenantApps?.some((ta: any) => ta.app?.id === a.id)).map((app: any) => (
            <div key={app.id} className="glass-card rounded-xl p-4 opacity-60">
              <h3 className="font-semibold mb-1">{app.name}</h3>
              <p className="text-xs text-white/40">{app.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
