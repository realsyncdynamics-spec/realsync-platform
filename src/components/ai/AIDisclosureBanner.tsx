'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export type AiDisclosureFeature = 'optimus' | 'reviewradar';

const FEATURE_LABELS: Record<AiDisclosureFeature, string> = {
  optimus: 'OPTIMUS (Perplexity Sonar API)',
  reviewradar: 'ReviewRadar (OPTIMUS + Perplexity)',
};

const storageKey = (f: AiDisclosureFeature) => `ai-disclosure-ack-${f}`;

export function getDisclosureAcknowledged(feature: AiDisclosureFeature): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem(storageKey(feature));
  } catch {
    return false;
  }
}

export default function AIDisclosureBanner({ feature }: { feature: AiDisclosureFeature }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getDisclosureAcknowledged(feature));
  }, [feature]);

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(storageKey(feature), new Date().toISOString());
    } catch {
      /* noop — private mode etc. */
    }
    setVisible(false);
  }

  return (
    <div
      role="note"
      style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,.10), rgba(0,212,255,.05))',
        border: '1px solid rgba(201,168,76,.35)',
        borderRadius: 12,
        padding: '12px 14px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <div style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }} aria-hidden>🤖</div>
      <div style={{ flex: 1, fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,.82)' }}>
        <strong style={{ color: '#C9A84C', fontWeight: 800 }}>KI-System aktiv —</strong>{' '}
        Du interagierst mit {FEATURE_LABELS[feature]}. Antworten können fehlerhaft oder halluziniert sein. Keine Rechts-, Medizin- oder Finanzberatung.{' '}
        <Link
          href="/ai-transparenz"
          style={{ color: '#00D4FF', textDecoration: 'underline', textUnderlineOffset: 2 }}
        >
          Transparenz &amp; Aufzeichnungen →
        </Link>
      </div>
      <button
        onClick={dismiss}
        aria-label="KI-Hinweis verstanden"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          padding: '6px 10px',
          background: 'rgba(255,255,255,.06)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 6,
          color: 'rgba(255,255,255,.7)',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        Verstanden
      </button>
    </div>
  );
}
