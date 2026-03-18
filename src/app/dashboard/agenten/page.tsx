"use client";
import { Bot, Activity, Zap, CheckCircle, AlertCircle, Clock } from "lucide-react";
const AGENTS = [
  { name: "CreatorSeal-Agent", app: "CreatorSeal", status: "active", tasks: 142, mission: "Verifizierung, Signierung, Trust Score" },
  { name: "Optimus-Router", app: "Optimus", status: "active", tasks: 89, mission: "KI-Modell-Routing, 9 Modelle" },
  { name: "Scanner-Agent", app: "MarketScanner", status: "active", tasks: 56, mission: "Marktanalyse, Trend-Erkennung" },
  { name: "SchulLabor-Agent", app: "SchulLabor", status: "idle", tasks: 23, mission: "MINT-Module, Simulation" },
  { name: "Community-Agent", app: "Community", status: "active", tasks: 67, mission: "Netzwerk, Moderation" },
  { name: "Link-Magic-Agent", app: "Link-Magic", status: "active", tasks: 34, mission: "Ad Generation, Copy" },
  { name: "Bildung-Agent", app: "Bildung", status: "idle", tasks: 12, mission: "Lehrplan-Sync" },
  { name: "Handwerk-Agent", app: "Handwerk", status: "active", tasks: 45, mission: "Auftraege verwalten" },
  { name: "Sicherheit-Agent", app: "Sicherheit", status: "active", tasks: 78, mission: "Stripe, Audit-Logs" },
  { name: "Wettbewerb-Agent", app: "Wettbewerb", status: "active", tasks: 19, mission: "847/1000 Plaetze" },
  { name: "Analytics-Agent", app: "Analytics", status: "active", tasks: 93, mission: "Dashboards, KPIs" },
  { name: "Kampagnen-Agent", app: "Campaigns", status: "active", tasks: 41, mission: "Multi-Channel Ads" },
];
export default function AgentenPage() {
  const active = AGENTS.filter(a=>a.status==="active").length;
  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Bot size={16} className="text-yellow-400" /></div>
          <div>
            <h1 className="text-white text-sm font-semibold">RealSync Agenten</h1>
            <p className="text-zinc-600 text-xs font-mono">KI-Agenten-Zentrale · {active} aktiv · by RealSync Apps</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5"><Activity size={12} className="text-green-500" /><span className="text-green-500 text-xs font-mono">{active}/{AGENTS.length} ONLINE</span></div>
      </div>
      <div className="px-6 py-4 space-y-2">
        {AGENTS.map((a,i)=>(
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {a.status==="active"?<CheckCircle size={12} className="text-green-500" />:<Clock size={12} className="text-zinc-600" />}
              <div>
                <div className="text-white text-xs font-medium">{a.name}</div>
                <div className="text-zinc-600 text-[10px] font-mono">{a.mission}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 text-[10px] font-mono">{a.tasks} Tasks</span>
              <span className="text-[10px] font-mono text-zinc-700">{a.app}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${a.status==="active"?"bg-green-500":"bg-zinc-700"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
