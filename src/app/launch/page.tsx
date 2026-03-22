'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const STEPS = [
  {
    id: 'supabase',
    num: '01',
    title: 'Supabase Setup',
    color: '#3ECF8E',
    icon: '🗄',
    status: 'pending',
    time: '5 Min',
    tasks: [
      {
        label: 'SQL Schema ausführen',
        detail: 'supabase.com/dashboard → SQL Editor → Inhalt einfügen → Run',
        copy: null,
        link: 'https://supabase.com/dashboard',
        linkLabel: 'Supabase öffnen →',
      },
      {
        label: 'Google OAuth aktivieren',
        detail: 'Authentication → Providers → Google → aktivieren',
        copy: null,
        link: 'https://console.cloud.google.com/apis/credentials',
        linkLabel: 'Google Console →',
      },
      {
        label: 'NEXT_PUBLIC_SUPABASE_URL kopieren',
        detail: 'Settings → API → URL',
        copy: 'NEXT_PUBLIC_SUPABASE_URL=',
        link: null,
        linkLabel: null,
      },
      {
        label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY kopieren',
        detail: 'Settings → API → anon (public) key',
        copy: 'NEXT_PUBLIC_SUPABASE_ANON_KEY=',
        link: null,
        linkLabel: null,
      },
      {
        label: 'SUPABASE_SERVICE_ROLE_KEY kopieren',
        detail: 'Settings → API → service_role (secret!) key',
        copy: 'SUPABASE_SERVICE_ROLE_KEY=',
        link: null,
        linkLabel: null,
      },
    ],
  },
  {
    id: 'stripe',
    num: '02',
    title: 'Stripe Setup',
    color: '#635BFF',
    icon: '💳',
    status: 'pending',
    time: '10 Min',
    tasks: [
      {
        label: 'Bronze Produkt erstellen — €19,00/Mo',
        detail: 'Products → Add Product → Bronze Creator · €19,00 · Recurring',
        copy: 'STRIPE_BRONZE_PRICE_ID=price_',
        link: 'https://dashboard.stripe.com/products',
        linkLabel: 'Stripe Products →',
      },
      {
        label: 'Silber erstellen — €49,00/Mo',
        detail: 'Products → Add Product → Silber Creator · €49,00 · Recurring',
        copy: 'STRIPE_SILBER_PRICE_ID=price_',
        link: null,
        linkLabel: null,
      },
      {
        label: 'Gold erstellen — €99,00/Mo',
        detail: 'Products → Add Product → Gold Creator · €99,00 · Recurring',
        copy: 'STRIPE_GOLD_PRICE_ID=price_',
        link: null,
        linkLabel: null,
      },
      {
        label: 'Platin erstellen — €199,00/Mo',
        detail: 'Products → Add Product → Platin Creator · €199,00 · Recurring',
        copy: 'STRIPE_PLATIN_PRICE_ID=price_',
        link: null,
        linkLabel: null,
      },
      {
        label: 'Stripe Secret Key',
        detail: 'API Keys → Secret key (sk_live_...)',
        copy: 'STRIPE_SECRET_KEY=sk_live_',
        link: 'https://dashboard.stripe.com/apikeys',
        linkLabel: 'API Keys →',
      },
      {
        label: 'Webhook erstellen',
        detail: 'Webhooks → Add endpoint → URL unten kopieren → Events: customer.subscription.*',
        copy: 'https://realsync-platform.vercel.app/api/stripe/webhook',
        link: 'https://dashboard.stripe.com/webhooks',
        linkLabel: 'Webhooks →',
      },
      {
        label: 'Webhook Secret kopieren',
        detail: 'Nach Webhook-Erstellung: Signing secret (whsec_...)',
        copy: 'STRIPE_WEBHOOK_SECRET=whsec_',
        link: null,
        linkLabel: null,
      },
    ],
  },
  {
    id: 'perplexity',
    num: '03',
    title: 'Perplexity API',
    color: '#20B2AA',
    icon: '⬡',
    status: 'pending',
    time: '2 Min',
    tasks: [
      {
        label: 'API Key erstellen',
        detail: 'perplexity.ai/settings/api → Neuer Key → Kopieren',
        copy: 'PERPLEXITY_API_KEY=pplx-',
        link: 'https://www.perplexity.ai/settings/api',
        linkLabel: 'Perplexity API →',
      },
    ],
  },
  {
    id: 'vercel',
    num: '04',
    title: 'Vercel ENV + Redeploy',
    color: '#000000',
    icon: '▲',
    status: 'pending',
    time: '3 Min',
    tasks: [
      {
        label: 'Alle ENV Vars einfügen',
        detail: 'Vercel → realsync-platform → Settings → Environment Variables',
        copy: null,
        link: 'https://vercel.com/realsyncdynamics-spec/realsync-platform/settings/environment-variables',
        linkLabel: 'ENV Variables →',
      },
      {
        label: 'NEXT_PUBLIC_APP_URL setzen',
        detail: 'Nach Domain-Setup: realsyncdynamics.de',
        copy: 'NEXT_PUBLIC_APP_URL=https://realsyncdynamics.de',
        link: null,
        linkLabel: null,
      },
      {
        label: 'Redeploy auslösen',
        detail: 'Deployments → neuestes → ... → Redeploy',
        copy: null,
        link: 'https://vercel.com/realsyncdynamics-spec/realsync-platform/deployments',
        linkLabel: 'Deployments →',
      },
    ],
  },
  {
    id: 'domain',
    num: '05',
    title: 'Domain aktivieren',
    color: '#F59E0B',
    icon: '🌐',
    status: 'active',
    time: '5 Min',
    tasks: [
      {
        label: 'realsyncdynamics.de in Vercel hinzufügen',
        detail: 'Vercel → realsync-platform → Settings → Domains → hinzufügen',
        copy: 'realsyncdynamics.de',
        link: 'https://vercel.com/realsyncdynamics-spec/realsync-platform/settings/domains',
        linkLabel: 'Domains →',
      },
      {
        label: 'A-Record beim Provider setzen',
        detail: 'DNS-Verwaltung bei Strato/IONOS → A-Record @ → 76.76.21.21',
        copy: '76.76.21.21',
        link: null,
        linkLabel: null,
      },
      {
        label: 'CNAME für www setzen',
        detail: 'CNAME www → cname.vercel-dns.com',
        copy: 'cname.vercel-dns.com',
        link: null,
        linkLabel: null,
      },
    ],
  },
  {
    id: 'creators',
    num: '06',
    title: 'Erste 10 Creator',
    color: '#EC4899',
    icon: '🚀',
    status: 'active',
    time: 'Sofort',
    tasks: [
      {
        label: 'B2B-QR-Link teilen',
        detail: 'Dein persönlicher Referral-Link — teile ihn in alle Bios',
        copy: 'https://realsync-platform.vercel.app/join/rs-dominik',
        link: 'https://realsync-platform.vercel.app/join/rs-dominik',
        linkLabel: 'Link testen →',
      },
      {
        label: 'Instagram Bio aktualisieren',
        detail: 'Link in Bio → realsyncdynamics.de/join/rs-dominik · CTA: "Kostenloser Creator-Score 🛡"',
        copy: 'Kostenloser Creator Trust-Score 🛡 → realsyncdynamics.de/join/rs-dominik',
        link: null,
        linkLabel: null,
      },
      {
        label: 'TikTok Bio',
        detail: 'realsyncdynamics.de/join/rs-dominik',
        copy: '🛡 Creator Trust-Score → realsyncdynamics.de/join/rs-dominik',
        link: null,
        linkLabel: null,
      },
      {
        label: 'LinkedIn Post',
        detail: 'Post über Creator Economy + RealSync vorstellen',
        copy: 'Ich baue gerade das Creator OS für DACH. 16 Tools in einer Plattform. Trust-Score, KI-Reviews, Brand Deals. Jetzt kostenlos testen: realsyncdynamics.de',
        link: 'https://linkedin.com',
        linkLabel: 'LinkedIn öffnen →',
      },
    ],
  },
];

const SQL_SCHEMA_LINK = 'https://github.com/realsyncdynamics-spec/realsync-platform/blob/main/supabase/migrations/001_initial_schema.sql';

export default function LaunchPage() {
  const [done, setDone] = useState<Record<string,boolean>>({});
  const [copied, setCopied] = useState<string|null>(null);

  const totalTasks = STEPS.reduce((s, step) => s + step.tasks.length, 0);
  const doneTasks = Object.values(done).filter(Boolean).length;
  const progress = Math.round((doneTasks / totalTasks) * 100);

  function toggleDone(key: string) {
    setDone(d => ({ ...d, [key]: !d[key] }));
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#03050A', color: 'white', fontFamily: "'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.fu{animation:fu .35s ease both}`}</style>

      {/* Header */}
      <div style={{ background: 'rgba(3,5,10,.98)', borderBottom: '1px solid #0F1520', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/hub" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>← Hub</Link>
          <span style={{ color: '#1A2130' }}>|</span>
          <span style={{ fontWeight: 800, fontSize: 14 }}>🚀 Production Launch</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: progress === 100 ? '#10B981' : '#C9A84C' }}>
            {doneTasks}/{totalTasks} Tasks · {progress}%
          </div>
          <div style={{ width: 120, height: 4, background: '#1A2130', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#C9A84C,#10B981)', width: `${progress}%`, borderRadius: 2, transition: 'width .4s' }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero */}
        <div className="fu" style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: progress === 100 ? '#10B981' : '#C9A84C', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10 }}>
            {progress === 100 ? '✅ PRODUCTION READY' : `// LAUNCH CHECKLIST · ${progress}% DONE`}
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 28, marginBottom: 8 }}>
            {progress === 100 ? '🎉 RealSync ist live!' : 'RealSync in Production bringen'}
          </h1>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
            {progress === 100
              ? 'Alle Schritte abgeschlossen. Teile deinen QR-Code und gewinne die ersten Creator.'
              : 'Klicke Tasks ab sobald du sie erledigt hast. Links öffnen direkt die richtigen Seiten.'}
          </p>
        </div>

        {/* SQL Schema notice */}
        <div style={{ background: 'rgba(62,207,142,.06)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 28, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>📋</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#3ECF8E', marginBottom: 2 }}>SQL Schema benötigt</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.4)' }}>
              Für Schritt 01: Supabase SQL Editor → Inhalt von migrations/001_initial_schema.sql einfügen
            </div>
          </div>
          <a href={SQL_SCHEMA_LINK} target="_blank" rel="noopener"
            style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '5px 12px', background: 'rgba(62,207,142,.12)', border: '1px solid rgba(62,207,142,.3)', borderRadius: 6, color: '#3ECF8E', textDecoration: 'none' }}>
            Schema ansehen →
          </a>
        </div>

        {/* Steps */}
        {STEPS.map((step, si) => {
          const stepDone = step.tasks.filter((_, ti) => done[`${step.id}-${ti}`]).length;
          const stepTotal = step.tasks.length;
          const isComplete = stepDone === stepTotal;
          return (
            <div key={step.id} className="fu" style={{ animationDelay: `${si * .06}s`, background: '#080C14', border: `1px solid ${isComplete ? step.color + '40' : '#1A2130'}`, borderRadius: 16, marginBottom: 12, overflow: 'hidden', transition: 'border-color .2s' }}>
              {/* Step header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #0F1520' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: isComplete ? step.color + '20' : 'rgba(255,255,255,.04)', border: `1px solid ${isComplete ? step.color + '40' : '#1A2130'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {isComplete ? '✅' : step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: isComplete ? step.color : 'rgba(255,255,255,.3)', letterSpacing: '.15em' }}>SCHRITT {step.num}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.2)' }}>· {step.time}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: isComplete ? step.color : '#E4E6EF', marginTop: 2 }}>{step.title}</div>
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: isComplete ? step.color : 'rgba(255,255,255,.35)' }}>
                  {stepDone}/{stepTotal}
                </div>
              </div>

              {/* Tasks */}
              <div style={{ padding: '10px 20px 14px' }}>
                {step.tasks.map((task, ti) => {
                  const key = `${step.id}-${ti}`;
                  const isDone = done[key];
                  return (
                    <div key={ti} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: ti < step.tasks.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                      <button onClick={() => toggleDone(key)}
                        style={{ width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${isDone ? step.color : '#374151'}`, background: isDone ? step.color + '20' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all .15s' }}>
                        {isDone && <span style={{ color: step.color, fontSize: 11, fontWeight: 700 }}>✓</span>}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: isDone ? 'rgba(255,255,255,.4)' : '#E4E6EF', textDecoration: isDone ? 'line-through' : 'none', marginBottom: 3 }}>{task.label}</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.3)', lineHeight: 1.5 }}>{task.detail}</div>
                        {(task.copy || task.link) && (
                          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                            {task.copy && (
                              <button onClick={() => copyText(task.copy!, key + '-copy')}
                                style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '3px 10px', background: copied === key + '-copy' ? 'rgba(16,185,129,.15)' : 'rgba(255,255,255,.05)', border: `1px solid ${copied === key + '-copy' ? 'rgba(16,185,129,.3)' : '#1A2130'}`, borderRadius: 5, color: copied === key + '-copy' ? '#10B981' : 'rgba(255,255,255,.5)', cursor: 'pointer', transition: 'all .15s', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {copied === key + '-copy' ? '✓ Kopiert!' : `📋 ${task.copy.length > 45 ? task.copy.slice(0, 45) + '…' : task.copy}`}
                              </button>
                            )}
                            {task.link && (
                              <a href={task.link} target="_blank" rel="noopener"
                                style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '3px 10px', background: `rgba(${step.color === '#000000' ? '255,255,255' : step.color.slice(1).match(/.{2}/g)?.map(h => parseInt(h, 16)).join(',') || '201,168,76'},.08)`, border: `1px solid ${step.color}30`, borderRadius: 5, color: step.color === '#000000' ? '#E4E6EF' : step.color, textDecoration: 'none' }}>
                                {task.linkLabel}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Done state */}
        {progress === 100 && (
          <div className="fu" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,.08),rgba(201,168,76,.06))', border: '1px solid rgba(16,185,129,.3)', borderRadius: 16, padding: '28px', textAlign: 'center', marginTop: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 6, color: '#10B981' }}>RealSync ist live!</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 20, lineHeight: 1.8 }}>
              Supabase ✓ · Stripe ✓ · Perplexity ✓ · Domain ✓ · Creator-Launch ✓
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/hub" style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#C9A84C,#FFD700)', borderRadius: 10, color: '#000', fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 13, textDecoration: 'none' }}>
                🏠 Zum Creator Hub →
              </Link>
              <Link href="/creator-kit" style={{ padding: '11px 22px', background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 10, color: '#10B981', fontFamily: "'DM Mono',monospace", fontSize: 11, textDecoration: 'none' }}>
                🎯 Creator-Kit →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
