'use client';

import { useState } from 'react';

const mockCertificates = [
  { id: 'CERT-001', title: 'Brand Ambassador Certificate', recipient: 'Sarah Miller', type: 'PDF + QR', status: 'Issued', blockchain: 'Verified', created: '2024-01-15', downloads: 234 },
  { id: 'CERT-002', title: 'Content License Agreement', recipient: 'Alex Chen', type: 'PDF + QR', status: 'Issued', blockchain: 'Verified', created: '2024-01-14', downloads: 189 },
  { id: 'CERT-003', title: 'Creator Verification Badge', recipient: 'Maria Lopez', type: 'QR Only', status: 'Pending', blockchain: 'Pending', created: '2024-01-13', downloads: 0 },
  { id: 'CERT-004', title: 'Collaboration Agreement', recipient: 'Tom Wright', type: 'PDF + QR', status: 'Issued', blockchain: 'Verified', created: '2024-01-12', downloads: 156 },
  { id: 'CERT-005', title: 'Authenticity Certificate', recipient: 'Lisa Park', type: 'PDF + Barcode', status: 'Issued', blockchain: 'Verified', created: '2024-01-11', downloads: 312 },
  { id: 'CERT-006', title: 'Rights Transfer Document', recipient: 'James Wilson', type: 'PDF + QR', status: 'Draft', blockchain: 'N/A', created: '2024-01-10', downloads: 0 },
];

const templates = [
  { name: 'Brand Certificate', uses: 1240, rating: 4.8 },
  { name: 'License Agreement', uses: 890, rating: 4.6 },
  { name: 'Authenticity Seal', uses: 2100, rating: 4.9 },
  { name: 'Rights Document', uses: 670, rating: 4.5 },
];

export default function CertificateGenDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">CertificateGen</h1>
            <p className="text-gray-400 mt-1">PDF & QR Certificate Generation with Blockchain Verification</p>
          </div>
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400">
            + New Certificate
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Certificates', value: '2,847', change: '+18%' },
            { label: 'Blockchain Verified', value: '2,341', change: '+22%' },
            { label: 'QR Scans (30d)', value: '12,450', change: '+35%' },
            { label: 'PDF Downloads', value: '8,920', change: '+14%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-green-400 text-sm mt-1">{stat.change} vs last month</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2">
          {['overview', 'certificates', 'templates', 'verification'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg capitalize ${
                activeTab === tab ? 'bg-zinc-800 text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Certificates</h3>
              <div className="space-y-3">
                {mockCertificates.slice(0, 4).map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                    <div>
                      <p className="font-medium">{cert.title}</p>
                      <p className="text-sm text-gray-400">{cert.recipient} - {cert.type}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cert.status === 'Issued' ? 'bg-green-900 text-green-400' :
                        cert.status === 'Pending' ? 'bg-yellow-900 text-yellow-400' :
                        'bg-zinc-700 text-gray-400'
                      }`}>{cert.status}</span>
                      <p className="text-xs text-gray-500 mt-1">{cert.created}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Templates</h3>
              <div className="space-y-3">
                {templates.map((t) => (
                  <div key={t.name} className="p-3 bg-zinc-800 rounded-lg">
                    <p className="font-medium">{t.name}</p>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{t.uses.toLocaleString()} uses</span>
                      <span className="text-yellow-400">{t.rating} stars</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm">ID</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Title</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Recipient</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Type</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Blockchain</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {mockCertificates.map((cert) => (
                  <tr key={cert.id} className="border-t border-zinc-800 hover:bg-zinc-800">
                    <td className="p-4 text-yellow-400 font-mono text-sm">{cert.id}</td>
                    <td className="p-4">{cert.title}</td>
                    <td className="p-4 text-gray-400">{cert.recipient}</td>
                    <td className="p-4">{cert.type}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cert.blockchain === 'Verified' ? 'bg-green-900 text-green-400' :
                        cert.blockchain === 'Pending' ? 'bg-yellow-900 text-yellow-400' :
                        'bg-zinc-700 text-gray-400'
                      }`}>{cert.blockchain}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cert.status === 'Issued' ? 'bg-green-900 text-green-400' :
                        cert.status === 'Pending' ? 'bg-yellow-900 text-yellow-400' :
                        'bg-zinc-700 text-gray-400'
                      }`}>{cert.status}</span>
                    </td>
                    <td className="p-4 text-gray-400">{cert.downloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Brand Certificate', 'License Agreement', 'Authenticity Seal', 'Rights Document', 'Creator Badge', 'Custom Template'].map((name) => (
              <div key={name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-yellow-500 cursor-pointer transition-colors">
                <div className="w-full h-32 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-4xl">📄</div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-gray-400 mt-1">PDF + QR + Blockchain</p>
                <button className="mt-3 w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm">Use Template</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Certificate Verification</h3>
            <p className="text-gray-400 mb-6">Verify authenticity via QR scan or certificate ID</p>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g., CERT-001)"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white mb-4"
              />
              <button className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400">Verify Certificate</button>
            </div>
            <div className="mt-8 p-4 bg-zinc-800 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-gray-400">Verification Methods:</p>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <p className="text-xs text-gray-400">QR Scan</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔗</div>
                  <p className="text-xs text-gray-400">Blockchain</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔢</div>
                  <p className="text-xs text-gray-400">Barcode</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
