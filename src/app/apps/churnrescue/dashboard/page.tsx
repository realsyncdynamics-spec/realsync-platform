'use client';
import Link from 'next/link';
import { useState } from 'react';

const mockCustomers = [
  { id: '1', name: 'StartupHub GmbH', email: 'max@startuphub.de', mrr: 99, failCode: 'insufficient_funds', failedAt: 'vor 2h', retryAt: 'in 46h', status: 'scheduled', history: '14 Mo.' },
  { id: '2', name: 'CreatorTools AG', email: 'lisa@creatortools.de', mrr: 49, failCode: 'card_declined', failedAt: 'vor 5h', retryAt: 'in 1h', status: 'retrying', history: '3 Mo.' },
  { id: '3', name: 'DigitalFlow UG', email: 'tom@digitalflow.de', mrr: 149, failCode: 'expired_card', failedAt: 'gestern', retryAt: '—', status: 'email_sent', history: '8 Mo.' },
  { id: '4', name: 'MediaStar GbR', email: 'anna@mediastar.de', mrr: 29, failCode: 'insufficient_funds', failedAt: 'vor 3 Tagen', retryAt: '—', status: 'recovered', history: '22 Mo.' },
  { id: '5', name: 'TechVision KG', email: 'jan@techvision.de', mrr: 299, failCode: 'do_not_honor', failedAt: 'vor 4 Tagen', retryAt: '—', status: 'recovered', history: '6 Mo.' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Retry geplant', color: '#1A73E8', bg: '#E8F0FE' },
  retrying: { label: 'Wird versucht', color: '#F9AB00', bg: '#FEF7E0' },
  email_sent: { label: 'Mail gesendet', color: '#9334EA', bg: '#F5F3FF' },
  recovered: { label: '✓ Gerettet', color: '#00C853', bg: '#E8F5E9' },
  failed: { label: 'Verloren', color: '#D93025', bg: '#FCE8E6' },
};

export default function ChurnRescueDashboard() {
  const recovered = mockCustomers.filter(c => c.status === 'recovered');
  const recoveredMRR = recovered.reduce((a, c) => a + c.mrr, 0);
  const atRiskMRR = mockCustomers.filter(c => c.status !== 'recovered').reduce((a, c) => a + c.mrr, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
            <span className="text-gray-700">|</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="font-bold text-lg">ChurnRescue</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full">Live Monitoring</span>
            <a href="/pricing?app=churnrescue" className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full hover:bg-cyan-500/20 transition-all">💎 Upgrade</a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">€{recoveredMRR}</div>
            <div className="text-green-600 text-xs mt-1">Diese Woche gerettet</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400">€{atRiskMRR}</div>
            <div className="text-red-600 text-xs mt-1">Aktuell gefährdet</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <div className="text-gray-500 text-xs mt-1">Failed Payments</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">72%</div>
            <div className="text-gray-500 text-xs mt-1">Recovery-Rate</div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">// Failed Payments</span>
            <span className="text-xs text-gray-600">Smart Retry Engine aktiv</span>
          </div>
          <div className="divide-y divide-gray-800">
            {mockCustomers.map(customer => {
              const st = statusConfig[customer.status];
              return (
                <div key={customer.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{customer.name}</span>
                      <span className="text-gray-500 text-xs">{customer.history} Kunde</span>
                    </div>
                    <div className="text-gray-500 text-xs font-mono">{customer.failCode}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">€{customer.mrr}<span className="text-gray-500 font-normal text-xs">/Mo</span></div>
                    <div className="text-gray-600 text-xs">{customer.failedAt}</div>
                  </div>
                  <div className="text-right w-28">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg + '30' }}>{st.label}</span>
                    {customer.retryAt !== '—' && <div className="text-gray-600 text-xs mt-1">{customer.retryAt}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recovery Calc */}
        <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3">// Jahres-Projektion</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">Ohne ChurnRescue (8% Verlust/Mo)</div>
              <div className="text-2xl font-bold text-red-400">-€3.456/Jahr</div>
            </div>
            <div className="text-3xl text-gray-700">→</div>
            <div>
              <div className="text-gray-400 text-sm">Mit ChurnRescue (72% Recovery)</div>
              <div className="text-2xl font-bold text-green-400">+€2.488/Jahr</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
