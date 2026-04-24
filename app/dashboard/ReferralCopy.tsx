"use client";

import { useState } from "react";

export default function ReferralCopy({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API blocked (e.g. http contexts); leave input focused instead.
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        style={{
          flex: "1 1 240px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 8,
          padding: "10px 12px",
          color: "inherit",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 12
        }}
      />
      <button
        type="button"
        onClick={copy}
        style={{
          background: copied ? "var(--green)" : "var(--gold)",
          color: "#0a0a0a",
          border: "none",
          padding: "10px 16px",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 12,
          cursor: "pointer",
          transition: "background 150ms ease"
        }}
      >
        {copied ? "Kopiert ✓" : "Kopieren"}
      </button>
    </div>
  );
}
