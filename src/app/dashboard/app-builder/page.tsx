'use client';
import React, { useState } from 'react';

const templates = [
  { id: 'landing', name: 'Landing Page', desc: 'Responsive Landing mit Hero, Features, Pricing', icon: '🌐' },
  { id: 'dashboard', name: 'Dashboard App', desc: 'Admin-Dashboard mit Charts, Tabellen, Sidebar', icon: '📊' },
  { id: 'ecommerce', name: 'E-Commerce Shop', desc: 'Produktkatalog, Warenkorb, Stripe Checkout', icon: '🛒' },
  { id: 'blog', name: 'Blog / CMS', desc: 'Markdown-Blog mit Kategorien und Suche', icon: '📝' },
  { id: 'saas', name: 'SaaS Starter', desc: 'Auth, Billing, Multi-Tenant mit API', icon: '🚀' },
  { id: 'portfolio', name: 'Portfolio', desc: 'Kreatives Portfolio mit Galerie und Kontakt', icon: '🎨' },
];

export default function AppBuilderPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [appName, setAppName] = useState('');
  const [step, setStep] = useState(1);
  const [features, setFeatures] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const featureOptions = [
    'Authentifizierung (NextAuth)', 'Stripe Payments', 'Datenbank (Prisma)',
    'REST API', 'Dashboard Analytics', 'E-Mail Benachrichtigungen',
    'Dark Mode', 'Responsive Design', 'SEO Optimierung',
    'Multi-Sprache (i18n)', 'File Upload', 'WebSocket Echtzeit',
  ];

  const toggleFeature = (f: string) => {
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Multi-App Builder</h1>
      <p className="text-gray-400 mb-8">Erstelle komplette Web-Apps in Minuten - kostenlos</p>

      <div className="flex gap-4 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            step >= s ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-black/30">{s}</span>
            {s === 1 ? 'Template' : s === 2 ? 'Features' : 'Generieren'}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">1. Waehle ein Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <button key={t.id} onClick={() => setSelected(t.id)}
                className={`p-6 rounded-xl border text-left transition-all ${
                  selected === t.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}>
                <span className="text-3xl mb-3 block">{t.icon}</span>
                <h3 className="font-bold text-lg">{t.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
          {selected && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">App Name</label>
              <input value={appName} onChange={e => setAppName(e.target.value)}
                className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                placeholder="Meine neue App..." />
              <button onClick={() => setStep(2)}
                disabled={!appName}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium disabled:opacity-50">
                Weiter
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">2. Waehle Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {featureOptions.map(f => (
              <button key={f} onClick={() => toggleFeature(f)}
                className={`p-3 rounded-lg border text-sm text-left transition-all ${
                  features.includes(f) ? 'border-green-500 bg-green-500/10 text-green-300' : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}>
                {features.includes(f) ? '✓ ' : '○ '}{f}
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-700 rounded-lg">Zurueck</button>
            <button onClick={() => setStep(3)} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium">
              Weiter ({features.length} Features)
            </button>
          </div>
        </div>
      )}

      {step === 3 && !done && (
        <div>
          <h2 className="text-xl font-semibold mb-4">3. App generieren</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p><strong>Template:</strong> {templates.find(t => t.id === selected)?.name}</p>
            <p><strong>App Name:</strong> {appName}</p>
            <p><strong>Features:</strong> {features.join(', ') || 'Keine'}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-700 rounded-lg">Zurueck</button>
              <button onClick={handleGenerate} disabled={generating}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium disabled:opacity-50">
                {generating ? 'Generiere...' : 'App generieren (kostenlos)'}
              </button>
            </div>
          </div>
          {generating && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3"><span className="animate-spin">⚙</span> Erstelle Projektstruktur...</div>
              <div className="flex items-center gap-3"><span className="animate-spin">⚙</span> Installiere Abhaengigkeiten...</div>
              <div className="flex items-center gap-3"><span className="animate-spin">⚙</span> Generiere Komponenten...</div>
            </div>
          )}
        </div>
      )}

      {done && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">{appName} wurde erstellt!</h2>
          <p className="text-gray-400 mb-6">Deine App ist bereit zum Deployment</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium">Auf Vercel deployen</button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium">Code herunterladen</button>
            <button onClick={() => { setDone(false); setStep(1); setSelected(null); setAppName(''); setFeatures([]); }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium">Neue App</button>
          </div>
        </div>
      )}
    </div>
  );
}
