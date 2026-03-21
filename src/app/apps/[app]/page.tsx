import { APP_DESCRIPTIONS } from '@/lib/ecosystem';
import type { AppId } from '@/lib/ecosystem';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ app: string }> }

export default async function AppInfoPage({ params }: Props) {
  const { app } = await params;
  const appId = app as AppId;
  const info = APP_DESCRIPTIONS[appId];

  if (!info) return notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">RealSync</Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link>
          <Link href="/automations" className="text-gray-400 hover:text-white text-sm">Automations</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: info.color + '20', borderColor: info.color, borderWidth: 1 }}>
              {appId === 'creatorseal' ? '\u{1F6E1}' : appId === 'adengine' ? '\u{1F4FA}' : appId === 'trendradar' ? '\u{1F4C8}' : appId === 'contentforge' ? '\u{1F4DD}' : appId === 'rightsguard' ? '\u{2696}' : appId === 'mediavault' ? '\u{1F5C4}' : appId === 'brandkit' ? '\u{1F3A8}' : appId === 'collabhub' ? '\u{1F465}' : appId === 'monetizemax' ? '\u{1F4B0}' : appId === 'analyticspro' ? '\u{1F4CA}' : appId === 'schedulemaster' ? '\u{1F4C5}' : appId === 'fanconnect' ? '\u{2764}' : '\u{1F3C6}'}
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: info.color }}>{info.name}</h1>
              <p className="text-gray-400 text-lg">{info.tagline}</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">{info.description}</p>
          <div className="flex gap-4 mt-6">
            <Link href={`/apps/${appId}/dashboard`} className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400">App oeffnen</Link>
            <Link href="/register" className="border border-zinc-700 px-6 py-2 rounded-lg font-semibold hover:border-zinc-500">Kostenlos starten</Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {info.features.map(f => (
              <div key={f} className="flex items-center gap-2 p-3 bg-zinc-800 rounded-lg">
                <span className="text-green-400">&#10003;</span>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Anwendungsfaelle</h2>
          <div className="space-y-3">
            {info.useCases.map(uc => (
              <div key={uc} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                <span className="text-yellow-400">&#9679;</span>
                <span>{uc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ecosystem-Integrationen</h2>
          <p className="text-gray-400 mb-4">Daten fliessen automatisch zwischen diesen Apps:</p>
          <div className="flex gap-3 flex-wrap">
            {info.integrations.map(intId => {
              const intApp = APP_DESCRIPTIONS[intId];
              return (
                <Link key={intId} href={`/apps/${intId}`} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: intApp.color }} />
                  <span className="font-medium" style={{ color: intApp.color }}>{intApp.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pricing Tiers for this App */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Verfuegbarkeit nach Plan</h2>
          <div className="grid grid-cols-4 gap-3">
            {(['Free', 'Bronze', 'Silber', 'Gold'] as const).map(plan => (
              <div key={plan} className={`p-4 rounded-lg text-center ${plan === 'Gold' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-zinc-800'}`}>
                <p className="font-semibold mb-1">{plan}</p>
                <p className="text-green-400 text-sm">&#10003; Verfuegbar</p>
                <p className="text-gray-500 text-xs mt-1">{plan === 'Free' ? 'Basis-Limits' : plan === 'Bronze' ? 'Erweitert' : plan === 'Silber' ? 'Profi' : 'Unbegrenzt'}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/pricing" className="text-yellow-400 hover:text-yellow-300 text-sm">Alle Plan-Details ansehen &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
