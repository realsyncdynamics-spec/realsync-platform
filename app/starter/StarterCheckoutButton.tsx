"use client";

import { useState } from "react";

type Utm = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}>;

export default function StarterCheckoutButton({
  referralCode,
  utm
}: {
  referralCode: string | null;
  utm?: Utm;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          planCode: "starter",
          referralCode: referralCode ?? undefined,
          utm: utm && Object.keys(utm).length > 0 ? utm : undefined
        })
      });

      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent("/starter")}`;
        return;
      }

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || `Checkout failed (${res.status})`);
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          background: "var(--gold)",
          color: "#0a0a0a",
          border: "none",
          padding: "14px 24px",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          width: "100%",
          transition: "opacity 150ms ease"
        }}
      >
        {loading ? "Leite zu Stripe weiter…" : "Jetzt für €9,90 starten"}
      </button>
      {error && (
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "#ff6b6b",
            marginTop: 10,
            lineHeight: 1.5
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
