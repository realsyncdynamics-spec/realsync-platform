'use client';

import { Shield, CheckCircle, AlertTriangle, FileCheck, Upload } from 'lucide-react';
import Link from 'next/link';

const MOCK_SCANS = [
  { id: 1, file: 'interview_final.mp4', result: 'Authentic', confidence: 98, date: '2026-03-20' },
  { id: 2, file: 'product_demo.jpg', result: 'Authentic', confidence: 95, date: '2026-03-19' },
  { id: 3, file: 'suspect_clip.mp4', result: 'Deepfake Detected', confidence: 87, date: '2026-03-18' },
];

export default function CreatorSealDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex items-center justify-between mb-10">
        <Link href="/apps/creatorseal" className="text-gray-500 hover:text-white text-sm">&larr; CreatorSeal</Link>
        <h1 className="text-2xl font-black italic" style={{ color: '#00D4FF' }}>CREATORSEAL DASHBOARD</h1>
        <Link href="/" className="text-gray-500 hover:text-white text-sm">Hub &rarr;</Link>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <Shield size={24} className="text-[#00D4FF] mb-3" />
          <div className="text-3xl font-black">142</div>
          <div className="text-xs text-gray-500 font-mono uppercase">Total Scans</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <CheckCircle size={24} className="text-green-500 mb-3" />
          <div className="text-3xl font-black">138</div>
          <div className="text-xs text-gray-500 font-mono uppercase">Verified</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <AlertTriangle size={24} className="text-red-500 mb-3" />
          <div className="text-3xl font-black">4</div>
          <div className="text-xs text-gray-500 font-mono uppercase">Deepfakes</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <FileCheck size={24} className="text-yellow-500 mb-3" />
          <div className="text-3xl font-black">12</div>
          <div className="text-xs text-gray-500 font-mono uppercase">C2PA Certs</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-sm font-mono text-gray-500 uppercase mb-6">Recent Scans</h3>
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono text-gray-600 uppercase">
              <tr><th className="text-left pb-4">File</th><th className="text-left pb-4">Result</th><th className="text-left pb-4">Confidence</th></tr>
            </thead>
            <tbody>
              {MOCK_SCANS.map((s) => (
                <tr key={s.id} className="border-t border-gray-800">
                  <td className="py-3 font-mono text-xs">{s.file}</td>
                  <td className="py-3"><span className={`text-xs font-bold ${s.result === 'Authentic' ? 'text-green-500' : 'text-red-500'}`}>{s.result}</span></td>
                  <td className="py-3 text-xs">{s.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-sm font-mono text-gray-500 uppercase mb-6">Quick Scan</h3>
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center">
            <Upload size={32} className="mx-auto text-[#00D4FF] mb-4" />
            <p className="text-sm text-gray-400">Drop file to scan</p>
          </div>
          <button className="w-full mt-4 py-3 bg-[#00D4FF] text-black font-bold rounded-xl">Start Scan</button>
        </div>
      </div>
    </div>
  );
}
