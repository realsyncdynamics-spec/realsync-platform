'use client';
import Link from 'next/link';
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-emerald-950/30 border-b border-emerald-900/30 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-emerald-400">💰 MonetizeMax</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-emerald-500 text-white rounded-full">Upgrade</Link>
      </div>
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h1 className="font-black text-2xl mb-2">MonetizeMax</h1>
        <p className="text-gray-400 font-mono text-sm mb-6">Revenue Optimization</p>
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-6 py-3 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          In Entwicklung · Bald verfügbar
        </div>
      </div>
    </div>
  );
}
