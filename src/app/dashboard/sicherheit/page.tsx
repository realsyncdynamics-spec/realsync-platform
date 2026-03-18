"use client";
import { Shield, Key, CreditCard, FileText, Lock, AlertTriangle } from "lucide-react";
const AUDIT_LOG = [
  { time: "05:12", action: "Login", user: "admin@realsyncdynamics.de", ip: "91.xxx.xx.12" },
  { time: "04:58", action: "API Key erstellt", user: "admin@realsyncdynamics.de", ip: "91.xxx.xx.12" },
  { time: "04:30", action: "Stripe Webhook", user: "system", ip: "stripe.com" },
  { time: "03:15", action: "2FA aktiviert", user: "admin@realsyncdynamics.de", ip: "91.xxx.xx.12" },
  { time: "02:00", action: "Backup erstellt", user: "system", ip: "supabase.io" },
];
export default function SicherheitPage() {
  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Shield size={16} className="text-yellow-400" /></div>
        <div>
          <h1 className="text-white text-sm font-semibold">RealSync Sicherheit</h1>
          <p className="text-zinc-600 text-xs font-mono">Security · Stripe · Audit · by RealSync Apps</p>
        </div>
      </div>
      <div className="px-6 py-4 grid grid-cols-4 gap-3 border-b border-zinc-800">
        {[{icon:Lock,label:"2FA",val:"Aktiv",c:"text-green-500"},{icon:Key,label:"API Keys",val:"3",c:"text-white"},{icon:CreditCard,label:"Stripe",val:"Live",c:"text-green-500"},{icon:AlertTriangle,label:"Threats",val:"0",c:"text-white"}].map((s,i)=>(
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <s.icon size={16} className="text-zinc-600 mx-auto mb-1" />
            <div className={`text-sm font-bold ${s.c}`}>{s.val}</div>
            <div className="text-zinc-600 text-[10px] font-mono">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4">
        <h2 className="text-xs text-zinc-600 font-mono uppercase tracking-wider mb-3">Audit Log</h2>
        <div className="space-y-1">
          {AUDIT_LOG.map((l,i)=>(
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-zinc-700 text-[10px] font-mono w-12">{l.time}</span>
                <span className="text-white text-xs">{l.action}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-600 text-[10px] font-mono">{l.user}</span>
                <span className="text-zinc-700 text-[10px] font-mono">{l.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-zinc-800">
        <h2 className="text-xs text-zinc-600 font-mono uppercase tracking-wider mb-3">Stripe Integration</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-green-500" />
            <div>
              <div className="text-white text-sm">Stripe Live Mode</div>
              <div className="text-zinc-600 text-[10px] font-mono">Subscriptions · Webhooks · Metered Billing</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-green-500 border border-green-900 px-2 py-0.5 rounded-full">CONNECTED</span>
        </div>
      </div>
    </div>
  );
}
