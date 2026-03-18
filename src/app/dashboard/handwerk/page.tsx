"use client";
import { useState } from "react";
import { Hammer, Plus, ClipboardList, Users, Receipt, Wrench } from "lucide-react";
const ORDERS = [
  { id: "A-001", client: "Mueller GmbH", task: "Badezimmer-Sanierung", status: "in_progress", amount: 4200 },
  { id: "A-002", client: "Schmidt Praxis", task: "Elektroinstallation", status: "done", amount: 1800 },
  { id: "A-003", client: "Weber Fam.", task: "Heizungsanlage", status: "pending", amount: 6500 },
  { id: "A-004", client: "Fischer Hotel", task: "Dachsanierung", status: "in_progress", amount: 12000 },
];
const TOOLS = ["Wasserwaage","Betonrechner","Flaechenrechner","Kabelquerschnitt","Gefaellerechner","Stundensatzrechner"];
export default function HandwerkPage() {
  const [tab, setTab] = useState<"orders"|"tools">("orders");
  const statusMap: Record<string,{label:string;color:string}> = {
    pending: {label:"Anfrage",color:"text-blue-400 border-blue-900"},
    in_progress: {label:"In Arbeit",color:"text-yellow-400 border-yellow-900"},
    done: {label:"Fertig",color:"text-green-400 border-green-900"},
  };
  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Hammer size={16} className="text-yellow-400" /></div>
          <div>
            <h1 className="text-white text-sm font-semibold">RealSync Handwerk</h1>
            <p className="text-zinc-600 text-xs font-mono">HandwerkOS · Thueringen · by RealSync Apps</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs bg-white text-zinc-950 px-3 py-1.5 rounded-md font-medium"><Plus size={12} />Neuer Auftrag</button>
      </div>
      <div className="px-6 py-2 border-b border-zinc-800 flex gap-4">
        {(["orders","tools"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`text-xs pb-2 border-b-2 transition ${tab===t?"border-white text-white":"border-transparent text-zinc-600"}`}>
            {t==="orders"?"Auftraege":"Werkzeuge"}
          </button>
        ))}
      </div>
      {tab==="orders"?(
        <div className="px-6 py-4 space-y-3">
          {ORDERS.map(o=>(
            <div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList size={14} className="text-zinc-600" />
                <div>
                  <div className="text-white text-sm">{o.task}</div>
                  <div className="text-zinc-600 text-[10px] font-mono">{o.id} · {o.client}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-sm font-mono">{o.amount.toLocaleString("de-DE")}€</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusMap[o.status].color}`}>{statusMap[o.status].label}</span>
              </div>
            </div>
          ))}
        </div>
      ):(
        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {TOOLS.map(t=>(
            <div key={t} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-zinc-600 transition">
              <Wrench size={20} className="text-zinc-600 mx-auto mb-2" />
              <div className="text-white text-xs">{t}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
