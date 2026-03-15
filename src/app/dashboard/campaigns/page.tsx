"use client";

import { useState } from "react";

const DEMO_CAMPAIGNS = [
  { id: 1, name: "YouTube Launch Promo", status: "active", platform: "YouTube", budget: "50 EUR", clicks: 1240, impressions: 15600, ctr: "7.9%" },
  { id: 2, name: "Instagram Creator Ads", status: "active", platform: "Instagram", budget: "30 EUR", clicks: 890, impressions: 12300, ctr: "7.2%" },
  { id: 3, name: "TikTok Viral Push", status: "paused", platform: "TikTok", budget: "25 EUR", clicks: 560, impressions: 8900, ctr: "6.3%" },
  { id: 4, name: "X/Twitter Brand Awareness", status: "draft", platform: "X", budget: "0 EUR", clicks: 0, impressions: 0, ctr: "0%" },
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Kampagnen</h1>
          <p className="text-zinc-400">Verwalte deine Werbekampagnen auf allen Plattformen</p>
        </div>
        <button className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
          + Neue Kampagne
        </button>
      </div>

      <div className="grid gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-yellow-500/30 transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColor(c.status)}`}>
                  {c.status}
                </span>
              </div>
              <span className="text-zinc-500 text-sm">{c.platform}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-zinc-500 text-xs">Budget</p>
                <p className="text-white font-medium">{c.budget}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Klicks</p>
                <p className="text-white font-medium">{c.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Impressionen</p>
                <p className="text-white font-medium">{c.impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">CTR</p>
                <p className="text-yellow-400 font-medium">{c.ctr}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
