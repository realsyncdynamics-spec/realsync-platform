'use client';
import { useState } from 'react';

const SOCIAL_POSTS = [
  {
    platform: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    type: 'Bio CTA',
    content: `🛡 Creator Trust-Score kostenlos prüfen
Powered by C2PA + KI + Blockchain

realsyncdynamics.de/join/rs-dominik`,
  },
  {
    platform: 'TikTok',
    icon: '🎵',
    color: '#00F2EA',
    type: 'Caption Hook',
    content: `Ich habe meinen Content in 30 Sekunden verifiziert — und meinen Trust-Score bekommen. 

Deepfake-Schutz, C2PA, Blockchain. Das ist Creator Economy 2026. 

Link in Bio 👆 (kostenlos!)

#creatortool #contentcreator #trustscore #ki`,
  },
  {
    platform: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    type: 'Announcement Post',
    content: `Ich baue das Creator OS für DACH.

Nach monatelanger Entwicklung: RealSync Dynamics ist live.

16 Tools in einer Plattform:
🛡 CreatorSeal — Trust-Score + C2PA-Verifikation
⭐ ReviewRadar — KI-Antworten auf alle Reviews  
💳 ChurnRescue — 72% Failed Payments gerettet
🎯 DealFlow — Brand-Matching via KI
🤖 OPTIMUS — KI-Agent powered by Perplexity AI

Für Creator im DACH-Markt. Ab €0,00/Monat.

→ Jetzt kostenlos testen: realsyncdynamics.de

Ich suche die ersten 10 Creator-Tester. Wer ist dabei?`,
  },
  {
    platform: 'X / Twitter',
    icon: '𝕏',
    color: '#E4E6EF',
    type: 'Launch Thread',
    content: `Das Creator OS für Deutschland ist live 🧵

1/ Ich habe 6 Monate gebaut. Heute launche ich RealSync Dynamics.

2/ Das Problem: Creator verlieren täglich Geld.
- Fake Reviews → kein professionelles Image
- Failed Payments → Umsatz verloren  
- Kein Brand-Deal-Matching → verpasste Einnahmen

3/ Die Lösung: 16 Apps. 1 Plattform.
🛡 Trust-Score in 30 Sekunden
⭐ KI-Review-Antworten
💳 Automatisches Payment-Recovery
🎯 Brand-Deal-Matching
🤖 OPTIMUS KI-Agent (Perplexity-powered)

4/ Kostenlos starten → realsyncdynamics.de

RT wenn du Creator kennst die das brauchen 🙏`,
  },
  {
    platform: 'YouTube',
    icon: '📺',
    color: '#FF4444',
    type: 'Video Beschreibung',
    content: `🛡 Meinen Creator Trust-Score kostenlos prüfen: realsyncdynamics.de/join/rs-dominik

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▸ RealSync Creator OS: realsyncdynamics.de
▸ Kostenlos starten: realsyncdynamics.de/register
▸ Trust-Score prüfen: realsyncdynamics.de/creatorseal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 SOCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▸ Instagram: @dominik_steiner
▸ TikTok: @dominik_steiner`,
  },
  {
    platform: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    type: 'Creator-Outreach Nachricht',
    content: `Hey [Name]! 👋

Ich launche gerade mein neues Projekt — RealSync Dynamics, das Creator OS für DACH-Creator.

Kurz: 16 Tools in einer Plattform. Trust-Score, KI-Reviews, Payment-Recovery, Brand Deals, KI-Agent.

Du bekommst als Einer der Ersten kostenlosen Zugang + Bronze-Status.

Interesse? Hier direkt starten: realsyncdynamics.de/join/rs-dominik

PS: Wenn du jemanden einlädst der sich anmeldet, bekommst du automatisch Coins (= bares Geld 🪙)`,
  },
];

const EMAIL_TEMPLATE = `Betreff: [Einladung] Creator Trust-Score kostenlos prüfen 🛡

Hallo [Name],

ich schreibe dir weil ich ein neues Tool gebaut habe, das ich mit ausgewählten Creatorn testen möchte.

RealSync Dynamics ist ein Creator OS — 16 Tools in einer Plattform, speziell für DACH-Creator:

🛡 CreatorSeal — Trust-Score in 30 Sekunden (C2PA + Deepfake-Scan + Blockchain)
⭐ ReviewRadar — KI-Antworten auf Google/Trustpilot Reviews
💳 ChurnRescue — Automatisches Payment-Recovery  
🎯 DealFlow — Brand-Matching via KI
🤖 OPTIMUS — KI-Agent powered by Perplexity AI

Du bekommst:
✓ Kostenloser Zugang (Bronze-Status)
✓ Deinen persönlichen Creator Trust-Score
✓ 7-Tage-Promo-Plan von OPTIMUS

Starte hier kostenlos: realsyncdynamics.de/join/rs-dominik

Ich freue mich auf dein Feedback!

Dominik
RealSync Dynamics`;

export default function CreatorKitPage() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, key: string) {
    await navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#03050A', color: 'white', fontFamily: "'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.fu{animation:fu .35s ease both}`}</style>

      <div style={{ background: 'rgba(3,5,10,.98)', borderBottom: '1px solid #0F1520', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/launch" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>← Launch</a>
          <span style={{ color: '#1A2130' }}>|</span>
          <span style={{ fontWeight: 800, fontSize: 14 }}>🎯 Creator-Kit · Erste 10 Creator</span>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '4px 12px', background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.3)', borderRadius: 20, color: '#EC4899' }}>
          Referral: realsync.de/join/rs-dominik
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px' }}>

        <div className="fu" style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#EC4899', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 8 }}>// CREATOR-OUTREACH KIT</div>
          <h1 style={{ fontWeight: 900, fontSize: 26, marginBottom: 6 }}>Launch-Texte für alle Plattformen</h1>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
            Kopier-fertige Posts, Bio-CTAs, E-Mail-Template und WhatsApp-Nachrichten.<br/>
            Jeder Signup über deinen Link = +950 Coins (= €9,50) für dich.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { v: '+950 🪙', l: 'Pro Referral (Bronze)', c: '#C9A84C' },
            { v: '+2.450 🪙', l: 'Pro Referral (Silber)', c: '#C0C0C0' },
            { v: '+4.950 🪙', l: 'Pro Referral (Gold)', c: '#FFD700' },
            { v: '100 🪙 = €1,00', l: 'Coins-Wert', c: '#10B981' },
          ].map(s => (
            <div key={s.l} style={{ background: '#080C14', border: '1px solid #1A2130', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 16, color: s.c }}>{s.v}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Social Posts */}
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.25)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 14 }}>// Social Media Posts</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {SOCIAL_POSTS.map((post, i) => (
            <div key={i} style={{ background: '#080C14', border: `1px solid ${post.color}20`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.05)', background: post.color + '08' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{post.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: post.color }}>{post.platform}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.3)' }}>{post.type}</span>
                </div>
                <button onClick={() => copy(post.content, `post-${i}`)}
                  style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '5px 14px', background: copied === `post-${i}` ? 'rgba(16,185,129,.15)' : `${post.color}15`, border: `1px solid ${copied === `post-${i}` ? 'rgba(16,185,129,.3)' : post.color + '35'}`, borderRadius: 6, color: copied === `post-${i}` ? '#10B981' : post.color, cursor: 'pointer', transition: 'all .15s' }}>
                  {copied === `post-${i}` ? '✓ Kopiert!' : '📋 Kopieren'}
                </button>
              </div>
              <div style={{ padding: '14px 16px', fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.65)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {post.content}
              </div>
            </div>
          ))}
        </div>

        {/* Email */}
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.25)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 14 }}>// E-Mail Template</div>
        <div style={{ background: '#080C14', border: '1px solid rgba(201,168,76,.2)', borderRadius: 14, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.05)', background: 'rgba(201,168,76,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📧</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#C9A84C' }}>Creator Outreach E-Mail</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.3)' }}>Personalisiert · DSGVO-konform</span>
            </div>
            <button onClick={() => copy(EMAIL_TEMPLATE, 'email')}
              style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '5px 14px', background: copied === 'email' ? 'rgba(16,185,129,.15)' : 'rgba(201,168,76,.12)', border: `1px solid ${copied === 'email' ? 'rgba(16,185,129,.3)' : 'rgba(201,168,76,.3)'}`, borderRadius: 6, color: copied === 'email' ? '#10B981' : '#C9A84C', cursor: 'pointer' }}>
              {copied === 'email' ? '✓ Kopiert!' : '📋 Kopieren'}
            </button>
          </div>
          <div style={{ padding: '16px', fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.65)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
            {EMAIL_TEMPLATE}
          </div>
        </div>

        {/* Referral link */}
        <div style={{ background: 'linear-gradient(135deg,rgba(236,72,153,.06),rgba(201,168,76,.04))', border: '1px solid rgba(236,72,153,.2)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#EC4899', letterSpacing: '.2em', marginBottom: 8 }}>// DEIN PERSÖNLICHER REFERRAL-LINK</div>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12 }}>realsync-platform.vercel.app/join/rs-dominik</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => copy('https://realsync-platform.vercel.app/join/rs-dominik', 'reflink')}
              style={{ padding: '10px 20px', background: copied === 'reflink' ? 'rgba(16,185,129,.15)' : 'rgba(236,72,153,.15)', border: `1px solid ${copied === 'reflink' ? 'rgba(16,185,129,.3)' : 'rgba(236,72,153,.3)'}`, borderRadius: 9, color: copied === 'reflink' ? '#10B981' : '#EC4899', fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: 'pointer', fontWeight: 700 }}>
              {copied === 'reflink' ? '✓ Link kopiert!' : '🔗 Link kopieren'}
            </button>
            <a href="https://realsync-platform.vercel.app/join/rs-dominik" target="_blank" rel="noopener"
              style={{ padding: '10px 20px', background: 'rgba(255,255,255,.05)', border: '1px solid #1A2130', borderRadius: 9, color: 'rgba(255,255,255,.5)', fontFamily: "'DM Mono',monospace", fontSize: 10, textDecoration: 'none' }}>
              Vorschau →
            </a>
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.2)', marginTop: 10 }}>
            Jeder Signup = +950 Coins · Jedes Bronze-Abo = +950 Coins · Nie verfallen
          </div>
        </div>
      </div>
    </div>
  );
}
