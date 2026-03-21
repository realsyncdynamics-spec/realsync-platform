'use client';

import { useState } from 'react';

interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'color' | 'font' | 'template' | 'guideline';
  format: string;
  lastModified: string;
  size: string;
}

const MOCK_ASSETS: BrandAsset[] = [
  { id: '1', name: 'Primary Logo', type: 'logo', format: 'SVG', lastModified: '2025-01-15', size: '24 KB' },
  { id: '2', name: 'Brand Color Palette', type: 'color', format: 'JSON', lastModified: '2025-01-10', size: '2 KB' },
  { id: '3', name: 'Heading Font - Inter Bold', type: 'font', format: 'WOFF2', lastModified: '2025-01-08', size: '156 KB' },
  { id: '4', name: 'Social Media Template Pack', type: 'template', format: 'PSD', lastModified: '2025-01-14', size: '4.2 MB' },
  { id: '5', name: 'Brand Guidelines v2.0', type: 'guideline', format: 'PDF', lastModified: '2025-01-12', size: '8.5 MB' },
  { id: '6', name: 'Icon Library', type: 'logo', format: 'SVG', lastModified: '2025-01-11', size: '340 KB' },
];

const TYPE_ICONS: Record<string, string> = { logo: 'L', color: 'C', font: 'F', template: 'T', guideline: 'G' };
const TYPE_COLORS: Record<string, string> = {
  logo: 'bg-indigo-500/20 text-indigo-400',
  color: 'bg-pink-500/20 text-pink-400',
  font: 'bg-cyan-500/20 text-cyan-400',
  template: 'bg-green-500/20 text-green-400',
  guideline: 'bg-yellow-500/20 text-yellow-400',
};

export default function BrandKitDashboard() {
  const [assets] = useState<BrandAsset[]>(MOCK_ASSETS);
  const [filterType, setFilterType] = useState('all');

  const filtered = filterType === 'all' ? assets : assets.filter(a => a.type === filterType);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">BrandKit Dashboard</h1>
            <p className="text-gray-400 mt-1">Brand asset management & identity toolkit</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg text-sm font-medium transition-all">+ Upload Asset</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {['all', 'logo', 'color', 'font', 'template', 'guideline'].map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`p-4 rounded-2xl text-center text-sm font-medium capitalize transition-all border ${filterType === t ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-600'}`}>{t === 'all' ? `All (${assets.length})` : `${t}s`}</button>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-mono text-gray-500 uppercase">Brand Assets</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono text-gray-600 uppercase bg-black/30">
              <tr><th className="text-left p-4">Asset</th><th className="p-4">Type</th><th className="p-4">Format</th><th className="p-4">Size</th><th className="p-4">Modified</th></tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-t border-gray-800 hover:bg-gray-800/30 cursor-pointer">
                  <td className="p-4 font-bold">{a.name}</td>
                  <td className="p-4 text-center"><span className={`text-xs px-2 py-1 rounded-full ${TYPE_COLORS[a.type]}`}>{a.type}</span></td>
                  <td className="p-4 text-center font-mono text-gray-400">{a.format}</td>
                  <td className="p-4 text-center text-gray-400">{a.size}</td>
                  <td className="p-4 text-center text-gray-500">{a.lastModified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
