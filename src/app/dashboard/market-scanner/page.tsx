"use client";

import { useState } from "react";

const DEMO_SIGNALS = [
  { asset: "Bitcoin (BTC)", signal: "Bullish", confidence: 82, change: "+4.2%", price: "$67,450" },
  { asset: "Ethereum (ETH)", signal: "Bullish", confidence: 75, change: "+3.1%", price: "$3,890" },
  { asset: "YouTube CPM (DE)", signal: "Neutral", confidence: 60, change: "+0.5%", price: "$18.50" },
  { asset: "TikTok Ads CPC", signal: "Bearish", confidence: 68, change: "-2.1%", price: "$0.42" },
  { asset: "Instagram Reels RPM", signal: "Bullish", confidence: 71, change: "+1.8%", price: "$2.10" },
  { asset: "Spotify Streams", signal: "Neutral", confidence: 55, change: "-0.3%", price: "$0.004" },
  { asset: "Patreon Subs Trend", signal: "Bullish", confidence: 79, change: "+5.2%", price: "N/A" },
  { asset: "Merch Sales Index", signal: "Neutral", confidence: 52, change: "+0.1%", price: "N/A" },
];

export default function MarketScannerPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? DEMO_SIGNALS : DEMO_SIGNALS.filter(s => s.signal.toLowerCase() === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-yellow-400 mb-2">Market Scanner</h1>
      <p className="text-zinc-400 mb-6">Echtzeit-Signale f\u00fcr Creator-M\u00e4rkte, Crypto & Ads</p>

      <div className="flex gap-2 mb-6">
        {["all", "bullish", "neutral", "bearish"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? "bg-yellow-500 text-black"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {f === "all" ? "Alle" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
              <th className="text-left p-4">Asset / Markt</th>
              <th className="text-left p-4">Signal</th>
              <th className="text-left p-4">Konfidenz</th>
              <th className="text-left p-4">\u00c4nderung</th>
              <th className="text-left p-4">Preis / Wert</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                <td className="p-4 font-medium text-white">{item.asset}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.signal === "Bullish" ? "bg-green-500/20 text-green-400" :
                    item.signal === "Bearish" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {item.signal}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.confidence >= 70 ? "bg-green-500" :
                          item.confidence >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="text-zinc-400 text-sm">{item.confidence}%</span>
                  </div>
                </td>
                <td className={`p-4 font-medium ${
                  item.change.startsWith("+") ? "text-green-400" :
                  item.change.startsWith("-") ? "text-red-400" : "text-zinc-400"
                }`}>
                  {item.change}
                </td>
                <td className="p-4 text-zinc-300">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <p className="text-zinc-500 text-sm">\ud83d\udce1 Daten werden alle 5 Minuten aktualisiert. Premium-Nutzer erhalten Echtzeit-Alerts.</p>
      </div>
    </div>
  );
}
