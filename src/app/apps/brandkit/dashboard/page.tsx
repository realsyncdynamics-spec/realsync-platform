'use client';
import { useState } from 'react';
import Link from 'next/link';

const COLORS = [
  {name:'Primary Cyan',  hex:'#00D4FF', usage:'CTAs, Links, Highlights'},
  {name:'Gold Accent',   hex:'#C9A84C', usage:'Logo, Premium-Elemente'},
  {name:'Background',    hex:'#03050A', usage:'Page Background'},
  {name:'Surface',       hex:'#080C14', usage:'Cards, Panels'},
  {name:'Border',        hex:'#1A2130', usage:'Dividers, Borders'},
  {name:'Text Primary',  hex:'#E4E6EF', usage:'Headlines, Body'},
];
const FONTS = [
  {name:'Syne',     weight:'900/800/700', usage:'Headlines, CTAs', preview:'Creator OS'},
  {name:'DM Mono',  weight:'500/400',     usage:'Data, Code, Labels', preview:'realsyncdynamics.de'},
];
const ASSETS = [
  {name:'Logo Dark',    icon:'◈', format:'SVG/PNG', size:'4.2 KB'},
  {name:'Logo Light',   icon:'◈', format:'SVG/PNG', size:'4.2 KB'},
  {name:'Favicon',      icon:'⬡', format:'ICO/PNG', size:'1.1 KB'},
  {name:'OG Image',     icon:'🖼', format:'PNG',     size:'89 KB'},
  {name:'Banner 1200x630',icon:'📐',format:'PNG',    size:'234 KB'},
];

export default function BrandKitDashboard() {
  const [copied, setCopied] = useState<string|null>(null);

  function copyHex(hex: string) {
    navigator.clipboard?.writeText(hex).catch(()=>{});
    setCopied(hex);
    setTimeout(()=>setCopied(null), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-pink-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(236,72,153,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-pink-400">🎨 BrandKit</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono border bg-pink-500/10 text-pink-400 border-pink-500/30">KI-Brand</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-pink-500 text-white rounded-full">Upgrade</Link>
      </div>

      <div className="p-5 space-y-4">
        {/* Color Palette */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">// Farbpalette</div>
          <div className="grid grid-cols-3 gap-3">
            {COLORS.map(c=>(
              <div key={c.hex} className="rounded-xl overflow-hidden border border-gray-800 cursor-pointer hover:border-gray-600 transition-all" onClick={()=>copyHex(c.hex)}>
                <div className="h-14" style={{background:c.hex}}/>
                <div className="p-3 bg-gray-900">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-gray-300">{c.name}</span>
                    <span className="text-xs font-mono text-gray-500">{copied===c.hex?'✓ Kopiert':c.hex}</span>
                  </div>
                  <div className="text-xs text-gray-600 font-mono">{c.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">// Typografie</div>
          <div className="space-y-3">
            {FONTS.map(f=>(
              <div key={f.name} className="flex items-center gap-4 bg-gray-800 rounded-xl p-4">
                <div className="flex-1">
                  <div className="text-lg font-black text-pink-400" style={{fontFamily:f.name==='Syne'?'Syne,sans-serif':"'DM Mono',monospace"}}>{f.preview}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">{f.name} · Weight: {f.weight}</div>
                  <div className="text-xs text-gray-600 font-mono">{f.usage}</div>
                </div>
                <button className="text-xs px-3 py-1.5 bg-pink-500/15 border border-pink-500/30 text-pink-400 rounded-full">@import</button>
              </div>
            ))}
          </div>
        </div>

        {/* Logo + Assets */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">// Brand Assets</div>

          {/* Logo Preview */}
          <div className="flex items-center gap-4 bg-gray-800 rounded-xl p-5 mb-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <div style={{width:20,height:20,border:'3px solid #C9A84C',transform:'rotate(45deg)',position:'relative',flexShrink:0}}>
                <div style={{position:'absolute',inset:4,background:'#C9A84C'}}/>
              </div>
              <span style={{fontWeight:900,fontSize:18,letterSpacing:'.04em'}}>
                RealSync<span style={{color:'#C9A84C'}}>Dynamics</span>
              </span>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="text-xs px-3 py-1.5 bg-pink-500/15 border border-pink-500/30 text-pink-400 rounded-full">SVG</button>
              <button className="text-xs px-3 py-1.5 bg-gray-700 border border-gray-600 text-gray-400 rounded-full">PNG</button>
            </div>
          </div>

          <div className="space-y-2">
            {ASSETS.map(a=>(
              <div key={a.name} className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl">
                <span className="text-xl w-8 text-center">{a.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{a.format} · {a.size}</div>
                </div>
                <button className="text-xs px-3 py-1.5 bg-gray-700 border border-gray-600 text-gray-400 rounded-full hover:text-white">↓ Download</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
