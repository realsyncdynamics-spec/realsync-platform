'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PLANS = [
  { id: 'free', name: 'Free', price: 0, period: 'Fuer immer', color: '#22c55e',
    features: ['1 App nach Wahl', 'C2PA Basis-Verifizierung', 'Wasserzeichen (Basis)', '5 Zertifikate/Monat', 'Community Support', 'Blockchain-Hash (Basis)'],
    limits: { apps: 1, certs: 5, storage: '500MB', api: 100 } },
  { id: 'bronze', name: 'Bronze', price: 19.99, period: '/Monat', color: '#cd7f32',
    features: ['5 Apps', 'C2PA Standard', 'Wasserzeichen + Barcode', '50 Zertifikate/Monat', 'Blockchain-Hash Standard', 'E-Mail Support', 'Basis-Automatisierungen', 'AdEngine Basis'],
    limits: { apps: 5, certs: 50, storage: '5GB', api: 1000 } },
  { id: 'silver', name: 'Silber', price: 49.99, period: '/Monat', color: '#c0c0c0',
    features: ['10 Apps', 'C2PA Advanced', 'Wasserzeichen + Barcode + QR', '200 Zertifikate/Monat', 'Blockchain-Hash Pro', 'Priority Support', 'Workflow-Automations', 'AdEngine Pro', 'Analytics Dashboard', 'Deepfake Detection'],
    limits: { apps: 10, certs: 200, storage: '25GB', api: 5000 } },
  { id: 'gold', name: 'Gold', price: 99.99, period: '/Monat', color: '#FFD700',
    features: ['Alle 13 Apps', 'C2PA Enterprise', 'Alle Wasserzeichen-Typen', 'Unbegrenzte Zertifikate', 'Blockchain-Hash Enterprise', 'Dedicated Support', 'Unbegrenzte Automations', 'AdEngine Enterprise', 'Echtzeit-Analytics', 'Deepfake Protection Full', 'API Vollzugriff', 'White-Label Option', 'Oekosystem-Datenbus'],
    limits: { apps: 13, certs: -1, storage: '100GB', api: -1 } }
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan') || 'free';
  const [selectedPlan, setSelectedPlan] = useState(planId);
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly'|'yearly'>('monthly');
  const plan = PLANS.find(p => p.id === selectedPlan) || PLANS[0];
  const yearlyDiscount = 0.8;
  const finalPrice = billingCycle === 'yearly' ? plan.price * 12 * yearlyDiscount : plan.price;

  const handleCheckout = async () => {
    if (selectedPlan === 'free') { router.push('/register?plan=free'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan, billingCycle })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Fehler beim Checkout');
    } catch { alert('Verbindungsfehler'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 p-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">RealSync</a>
        <div className="flex gap-4"><a href="/pricing" className="text-gray-400 hover:text-white">Pakete</a><a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a></div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2">Checkout</h1>
        <p className="text-gray-400 text-center mb-8">Waehle dein Paket und starte sofort</p>
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-full p-1 flex">
            <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-full text-sm font-medium transition ${billingCycle==='monthly'?'bg-yellow-500 text-black':'text-gray-400'}`}>Monatlich</button>
            <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2 rounded-full text-sm font-medium transition ${billingCycle==='yearly'?'bg-yellow-500 text-black':'text-gray-400'}`}>Jaehrlich <span className="text-green-400 text-xs">-20%</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {PLANS.map(p => (
            <button key={p.id} onClick={() => setSelectedPlan(p.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPlan===p.id ? 'border-yellow-500 bg-gray-900/80 scale-105' : 'border-gray-800 bg-gray-900/40 hover:border-gray-600'}`}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:p.color}}>{p.name}</div>
              <div className="text-2xl font-bold">{p.price === 0 ? 'Gratis' : `€${billingCycle==='yearly'?(p.price*12*yearlyDiscount).toFixed(0):p.price}`}</div>
              <div className="text-xs text-gray-500">{p.price===0?p.period:billingCycle==='yearly'?'/Jahr':p.period}</div>
              <div className="mt-3 space-y-1">{p.features.slice(0,4).map((f,i) => <div key={i} className="text-xs text-gray-400">✓ {f}</div>)}
                {p.features.length>4 && <div className="text-xs text-gray-600">+{p.features.length-4} weitere</div>}</div>
            </button>
          ))}
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Bestelluebersicht</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-400">Paket</span><span className="font-bold" style={{color:plan.color}}>{plan.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Apps</span><span>{plan.limits.apps === 13 ? 'Alle 13' : plan.limits.apps}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Zertifikate</span><span>{plan.limits.certs===-1?'Unbegrenzt':plan.limits.certs+'/Mo'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Speicher</span><span>{plan.limits.storage}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">API Calls</span><span>{plan.limits.api===-1?'Unbegrenzt':plan.limits.api+'/Mo'}</span></div>
            <hr className="border-gray-700"/>
            <div className="flex justify-between text-lg"><span className="font-bold">Gesamt</span><span className="font-bold text-yellow-500">{plan.price===0?'Gratis':`€${finalPrice.toFixed(2)}`}</span></div>
            {billingCycle==='yearly' && plan.price>0 && <div className="text-green-400 text-sm text-right">Du sparst €{(plan.price*12*0.2).toFixed(2)}/Jahr</div>}
          </div>
          <button onClick={handleCheckout} disabled={loading}
            className="w-full mt-6 py-4 rounded-xl font-bold text-lg transition bg-yellow-500 hover:bg-yellow-400 text-black disabled:opacity-50">
            {loading ? 'Weiterleitung...' : plan.price===0 ? 'Kostenlos registrieren' : `Jetzt ${plan.name} buchen`}
          </button>
          {plan.price===0 && <p className="text-center text-gray-500 text-sm mt-3">Keine Kreditkarte erforderlich. Fuer immer kostenlos.</p>}
          {plan.price>0 && <p className="text-center text-gray-500 text-sm mt-3">Sichere Zahlung ueber Stripe. Jederzeit kuendbar.</p>}
        </div>
        <div className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h3 className="font-bold mb-4">Alle Features deines {plan.name}-Pakets</h3>
          <div className="grid grid-cols-2 gap-2">{plan.features.map((f,i) => <div key={i} className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span>{f}</div>)}</div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full"/></div>}><CheckoutContent/></Suspense>;
}
