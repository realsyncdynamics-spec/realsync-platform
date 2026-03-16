"use client";

import { useState } from "react";

const DEMO_CAMPAIGNS = [
  { id: 1, name: "YouTube Launch Promo", status: "active", platform: "YouTube", budget: "50 EUR", reach: "12.4K", clicks: "892" },
  { id: 2, name: "Instagram Creator Ads", status: "active", platform: "Instagram", budget: "30 EUR", reach: "8.1K", clicks: "456" },
  { id: 3, name: "TikTok Viral Push", status: "paused", platform: "TikTok", budget: "25 EUR", reach: "5.2K", clicks: "234" },
  { id: 4, name: "X/Twitter Brand Awareness", status: "draft", platform: "X", budget: "0 EUR", reach: "-", clicks: "-" },
];

export default function CampaignsPage() {
  const [campaigns] = useState(DEMO_CAMPAIGNS);

  const statusColor = (s: string) => {
    if (s === "active") return "bg-green-500/20 text-green-400";
    if (s === "paused") return "bg-yellow-500/20 text-yellow-400";
    return "bg-zinc-500/20 text-zinc-400";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">RealSync Campaigns</h1>
        <span className="px-3 py-1 bg-purple-600/20 border border-purple-500 rounded-full text-xs text-purple-300 font-medium">by RealSync Apps</span>
      </div>
      <p className="text-zinc-400 mb-6">Verwalte deine Werbekampagnen auf allen Plattformen</p>

      <div className="flex gap-3 mb-6">
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium">Neue Kampagne</button>
        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">Alle</button>
        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">Aktiv</button>
        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">Pausiert</button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="text-left p-3 text-sm text-zinc-400">Kampagne</th>
              <th className="text-left p-3 text-sm text-zinc-400">Plattform</th>
              <th className="text-left p-3 text-sm text-zinc-400">Status</th>
              <th className="text-left p-3 text-sm text-zinc-400">Budget</th>
              <th className="text-left p-3 text-sm text-zinc-400">Reichweite</th>
              <th className="text-left p-3 text-sm text-zinc-400">Klicks</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-zinc-400">{c.platform}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(c.status)}`}>{c.status}</span>
                </td>
                <td className="p-3 text-zinc-300">{c.budget}</td>
                <td className="p-3 text-zinc-300">{c.reach}</td>
                <td className="p-3 text-zinc-300">{c.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center text-xs text-zinc-500">Powered by RealSync Apps</div>
    </div>
  );
}
