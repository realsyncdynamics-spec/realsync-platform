'use client';
import { useState } from 'react';

const APPS = [
  { id: 'creatorseal', name: 'CreatorSeal', color: '#06b6d4', icon: '◇', cat: 'Schutz',
    short: 'Deepfake Protection & C2PA',
    desc: 'CreatorSeal ist dein Schutzschild gegen Content-Diebstahl und Deepfakes. Jeder Inhalt wird mit C2PA-Standard verifiziert, mit unsichtbaren Wasserzeichen versehen und per Blockchain-Hash gesichert. Barcodes und QR-Codes ermoeglichen sofortige Echtheits-Pruefung.',
    features: ['C2PA-Zertifizierung', 'Unsichtbare Wasserzeichen', 'Blockchain-Hash Registrierung', 'QR/Barcode Generierung', 'Deepfake-Erkennung KI', 'Echtzeit-Verifizierung'],
    free: ['1 Verifizierung/Tag', 'Basis C2PA Badge'], integrations: ['MediaVault', 'RightsGuard', 'ContentForge'] },
  { id: 'adengine', name: 'AdEngine', color: '#f97316', icon: '▶', cat: 'Marketing',
    short: 'KI-Ad Generator',
    desc: 'AdEngine generiert mit KI hochkonvertierende Werbeanzeigen fuer alle Plattformen. Von Instagram Reels bis YouTube Ads - automatische Zielgruppen-Analyse, A/B-Testing und Budget-Optimierung in Echtzeit.',
    features: ['KI-Anzeigen-Generator', 'Multi-Platform Ads', 'A/B Testing Engine', 'Budget-Optimierung', 'Zielgruppen-KI', 'ROI-Dashboard'],
    free: ['3 Anzeigen/Monat', 'Basis-Templates'], integrations: ['TrendRadar', 'Analytics+', 'MonetizeHub', 'BrandKit'] },
  { id: 'trendradar', name: 'TrendRadar', color: '#a855f7', icon: '↗', cat: 'Analytics',
    short: 'Viral Trend Detection',
    desc: 'TrendRadar erkennt virale Trends bevor sie mainstream werden. KI-gestuetzte Analyse von Social Media, Suchdaten und Content-Patterns. Automatische Content-Vorschlaege basierend auf deiner Nische.',
    features: ['Echtzeit Trend-Scan', 'Nischen-Analyse', 'Virality Score', 'Content-Vorschlaege', 'Wettbewerber-Tracking', 'Hashtag Intelligence'],
    free: ['5 Trend-Scans/Woche', 'Top 10 Trends'], integrations: ['ContentForge', 'AdEngine', 'Analytics+'] },
  { id: 'contentforge', name: 'ContentForge', color: '#22c55e', icon: '⚙', cat: 'Erstellung',
    short: 'KI-Content Erstellung',
    desc: 'ContentForge erstellt mit KI professionelle Inhalte fuer alle Plattformen. Von Reels ueber Karussells bis hin zu Blog-Posts. Brand-konsistente Vorlagen und automatische Formatierung.',
    features: ['KI-Content Generator', 'Multi-Format Export', 'Brand-Templates', 'Auto-Formatierung', 'Script Generator', 'Thumbnail KI'],
    free: ['5 Inhalte/Monat', 'Basis-Templates'], integrations: ['ScheduleMaster', 'CreatorSeal', 'BrandKit', 'CollabSpace'] },
  { id: 'fanconnect', name: 'FanConnect', color: '#ec4899', icon: '♥', cat: 'Community',
    short: 'Fan-Engagement Hub',
    desc: 'FanConnect verbindet dich mit deiner Community. CRM fuer Creators mit automatisierten Antworten, Fan-Segmentierung und Engagement-Tracking. Baue loyale Beziehungen auf.',
    features: ['Fan-CRM', 'Auto-Antworten KI', 'Segmentierung', 'Engagement Score', 'Newsletter Builder', 'Community Polls'],
    free: ['100 Kontakte', 'Basis CRM'], integrations: ['Analytics+', 'AdEngine'] },
  { id: 'mediavault', name: 'MediaVault', color: '#3b82f6', icon: '☁', cat: 'Speicher',
    short: 'Sicherer Media-Speicher',
    desc: 'MediaVault ist dein sicherer Cloud-Speicher fuer alle Medien. Automatische Organisation, Versionierung und nahtlose Integration mit allen RealSync Apps. Deine Inhalte, sicher und jederzeit verfuegbar.',
    features: ['Cloud-Speicher', 'Auto-Organisation', 'Versionierung', 'Schneller CDN-Zugriff', 'Batch-Upload', 'Media-Suche KI'],
    free: ['500MB Speicher', '50 Dateien'], integrations: ['CreatorSeal', 'ContentForge', 'BrandKit'] },
  { id: 'rightsguard', name: 'RightsGuard', color: '#ef4444', icon: '⚖', cat: 'Rechte',
    short: 'Digitaler Rechteschutz',
    desc: 'RightsGuard ueberwacht das Internet nach unautorisierter Nutzung deiner Inhalte. Automatische DMCA-Takedowns, Lizenz-Management und Rechte-Nachverfolgung.',
    features: ['Web-Crawling Schutz', 'Auto DMCA Takedown', 'Lizenz-Manager', 'Nutzungs-Tracking', 'Rechte-Zertifikate', 'Missbrauchs-Alerts'],
    free: ['5 Scans/Monat', 'Basis-Monitoring'], integrations: ['CreatorSeal', 'MonetizeHub'] },
  { id: 'schedulemaster', name: 'ScheduleMaster', color: '#eab308', icon: '⌖', cat: 'Publishing',
    short: 'Multi-Platform Scheduling',
    desc: 'ScheduleMaster plant und veroeffentlicht Inhalte auf allen Plattformen gleichzeitig. KI-optimierte Posting-Zeiten, Kalender-Ansicht und automatische Cross-Posting.',
    features: ['Multi-Platform Posting', 'KI-Timing Optimizer', 'Kalender-Dashboard', 'Auto Cross-Post', 'Queue-Management', 'Vorschau-Generator'],
    free: ['10 Posts/Monat', '2 Plattformen'], integrations: ['ContentForge', 'Analytics+'] },
  { id: 'monetizehub', name: 'MonetizeHub', color: '#14b8a6', icon: '€', cat: 'Finanzen',
    short: 'Einnahmen-Dashboard',
    desc: 'MonetizeHub konsolidiert alle deine Creator-Einnahmen an einem Ort. Von AdSense ueber Sponsorings bis Lizenzgebuehren. Steuerbericht-Export und Prognose-KI.',
    features: ['Multi-Source Revenue', 'Steuer-Export', 'Prognose KI', 'Sponsor Manager', 'Invoice Generator', 'Payment Tracking'],
    free: ['Basis-Dashboard', '3 Einnahmequellen'], integrations: ['AdEngine', 'RightsGuard', 'Analytics+'] },
  { id: 'collabspace', name: 'CollabSpace', color: '#8b5cf6', icon: '✧', cat: 'Team',
    short: 'Kreativ-Kollaboration',
    desc: 'CollabSpace ermoeglicht nahtlose Zusammenarbeit mit anderen Creators und Teams. Gemeinsame Workspaces, Aufgaben-Management und geteilte Brand-Assets.',
    features: ['Team-Workspaces', 'Aufgaben-Board', 'Geteilte Assets', 'Echtzeit Chat', 'Review-Workflow', 'Rollen-Management'],
    free: ['1 Workspace', '2 Mitglieder'], integrations: ['ContentForge', 'BrandKit', 'CreatorSeal'] },
  { id: 'analyticsplus', name: 'Analytics+', color: '#6366f1', icon: '≡', cat: 'Daten',
    short: 'Echtzeit-Analytics',
    desc: 'Analytics+ liefert tiefe Einblicke in deine Performance ueber alle Plattformen. KI-gestuetzte Empfehlungen, Wettbewerber-Vergleich und Custom Dashboards.',
    features: ['Cross-Platform Analytics', 'KI-Empfehlungen', 'Custom Dashboards', 'Wettbewerber-Analyse', 'Audience Insights', 'Export-API'],
    free: ['Basis-Metriken', '7-Tage Historie'], integrations: ['TrendRadar', 'AdEngine', 'MonetizeHub', 'ScheduleMaster'] },
  { id: 'brandkit', name: 'BrandKit', color: '#f43f5e', icon: '❀', cat: 'Branding',
    short: 'Brand-Identity Manager',
    desc: 'BrandKit verwaltet deine komplette Marken-Identitaet. Logos, Farben, Fonts, Vorlagen - alles zentral gespeichert und automatisch in allen Apps verfuegbar.',
    features: ['Brand-Guideline Builder', 'Asset-Bibliothek', 'Auto-Brand Apply', 'Template-System', 'Farb-Palette Manager', 'Font Manager'],
    free: ['1 Brand-Profil', 'Basis-Assets'], integrations: ['ContentForge', 'AdEngine', 'CollabSpace'] },
  { id: 'gate', name: 'Gate', color: '#84cc16', icon: '→', cat: 'Distribution',
    short: 'Content Gate & Paywall',
    desc: 'Gate ermoeglicht exklusive Inhalte hinter Paywalls, E-Mail-Gates oder Social-Follows. Monetarisiere Premium-Content und baue deine E-Mail-Liste auf.',
    features: ['Paywall Builder', 'E-Mail Gate', 'Social Follow Gate', 'Custom Landing Pages', 'A/B Testing', 'Conversion Tracking'],
    free: ['1 Gate-Seite', 'E-Mail Gate'], integrations: ['CreatorSeal', 'MonetizeHub', 'FanConnect'] },
];

const CATEGORIES = ['Alle', 'Schutz', 'Marketing', 'Analytics', 'Erstellung', 'Community', 'Speicher', 'Rechte', 'Publishing', 'Finanzen', 'Team', 'Daten', 'Branding', 'Distribution'];

export default function InfoPage() {
  const [selected, setSelected] = useState<string|null>(null);
  const [cat, setCat] = useState('Alle');
  const filtered = cat === 'Alle' ? APPS : APPS.filter(a => a.cat === cat);
  const app = APPS.find(a => a.id === selected);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 p-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">RealSync</a>
        <div className="flex gap-4"><a href="/ecosystem" className="text-gray-400 hover:text-white">Oekosystem</a><a href="/pricing" className="text-gray-400 hover:text-white">Pakete</a><a href="/login" className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold">Login</a></div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm mb-4">13 KI-Apps</div>
          <h1 className="text-4xl font-bold mb-2">Alle <span className="text-yellow-500">Apps</span> im Detail</h1>
          <p className="text-gray-400">Entdecke jede App des RealSync Creator OS mit allen Features und Free-Tier Details</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {CATEGORIES.map(c => <button key={c} onClick={() => { setCat(c); setSelected(null); }} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${cat===c?'bg-yellow-500 text-black font-bold':'bg-gray-900 text-gray-400'}`}>{c}</button>)}
        </div>

        {!selected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(a => (
              <button key={a.id} onClick={() => setSelected(a.id)} className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-left hover:border-yellow-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{backgroundColor: a.color+'20', color: a.color}}>{a.icon}</div>
                  <div><div className="font-bold text-lg" style={{color: a.color}}>{a.name}</div><div className="text-xs text-gray-500">{a.cat}</div></div>
                </div>
                <div className="text-gray-400 text-sm mb-3">{a.short}</div>
                <div className="text-xs text-gray-600">Gratis: {a.free[0]}</div>
                <div className="text-xs text-yellow-500/60 mt-2 group-hover:text-yellow-500">Details ansehen &rarr;</div>
              </button>
            ))}
          </div>
        ) : app && (
          <div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white mb-4 text-sm">&larr; Zurueck zu allen Apps</button>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{backgroundColor: app.color+'20', color: app.color}}>{app.icon}</div>
                <div><h2 className="text-3xl font-bold" style={{color: app.color}}>{app.name}</h2><div className="text-gray-400">{app.short} | {app.cat}</div></div>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">{app.desc}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3 text-lg">Alle Features</h3>
                  <div className="space-y-2">{app.features.map((f,i) => <div key={i} className="flex items-center gap-2"><span className="text-green-400">✓</span><span>{f}</span></div>)}</div>
                </div>
                <div>
                  <h3 className="font-bold mb-3 text-lg">Gratis-Paket (fuer immer)</h3>
                  <div className="space-y-2 mb-6">{app.free.map((f,i) => <div key={i} className="flex items-center gap-2"><span className="text-yellow-400">★</span><span>{f}</span></div>)}</div>
                  <h3 className="font-bold mb-3 text-lg">Integrationen</h3>
                  <div className="flex flex-wrap gap-2">{app.integrations.map((int,i) => {
                    const intApp = APPS.find(a => a.name === int);
                    return <span key={i} className="px-3 py-1 rounded-lg text-sm" style={{backgroundColor: (intApp?.color||'#666')+'20', color: intApp?.color||'#999'}}>{int}</span>;
                  })}</div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="/checkout?plan=free" className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400">Kostenlos starten</a>
                <a href="/pricing" className="px-6 py-3 bg-gray-800 rounded-xl font-medium hover:bg-gray-700">Alle Pakete</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
