'use client';

import { useState, useEffect, useRef } from 'react';

const GOLD = "#C9A84C";
const CYAN = "#00F0FF";
const BG = "#03050A";

const PLANS = [
  {
    id: "gratis", name: "Gratis", emoji: "🆓", price: 0,
    color: "#6B7280", glow: "#6B728044",
    tagline: "Für immer kostenlos — kein Limit",
    verifyLevel: 1,
    apps: ["CreatorSeal Basis", "Creator-Profil", "QR-Code", "Barcode"],
    social: ["YouTube (Anzeige)", "TikTok (Anzeige)"],
    features: [
      { icon: "👤", text: "Öffentliches Creator-Profil", on: true },
      { icon: "📱", text: "QR-Code + Barcode Generator", on: true },
      { icon: "✉️", text: "E-Mail Verifikation", on: true },
      { icon: "🛡", text: "RealSync Basis-Badge", on: true },
      { icon: "🌐", text: "realsyncdynamics.de/creator/du", on: true },
      { icon: "📊", text: "Basis-Analytics", on: true },
      { icon: "💧", text: "Wasserzeichen", on: false },
      { icon: "⛓", text: "Blockchain-Zeitstempel", on: false },
      { icon: "🔐", text: "C2PA 2.3 Signatur", on: false },
      { icon: "🎨", text: "Custom Design", on: false },
      { icon: "📡", text: "Social Media API", on: false },
      { icon: "🌍", text: "Custom Domain", on: false },
    ],
    highlight: false,
  },
  {
    id: "bronze", name: "Bronze", emoji: "🥉", price: 19,
    color: "#CD7F32", glow: "#CD7F3244",
    tagline: "Erster echter Schutz",
    verifyLevel: 2,
    apps: ["CreatorSeal", "AdEngine", "Creator-Profil+", "QR Pro", "Barcode Pro"],
    social: ["YouTube", "TikTok", "Instagram (Basic)"],
    features: [
      { icon: "👤", text: "Creator-Profil + Custom Bio", on: true },
      { icon: "📱", text: "QR + Barcode (Download)", on: true },
      { icon: "✉️", text: "E-Mail + Phone Verifikation", on: true },
      { icon: "🛡", text: "Bronze Creator Badge", on: true },
      { icon: "💧", text: "Unsichtbares Wasserzeichen", on: true },
      { icon: "📊", text: "Analytics Dashboard", on: true },
      { icon: "📡", text: "3 Social Media Plattformen", on: true },
      { icon: "🎬", text: "Content Feed (3 Plattf.)", on: true },
      { icon: "⛓", text: "Blockchain-Zeitstempel", on: false },
      { icon: "🔐", text: "C2PA 2.3 Signatur", on: false },
      { icon: "🎨", text: "Custom Design", on: false },
      { icon: "🌍", text: "Custom Domain", on: false },
    ],
    highlight: false,
  },
  {
    id: "silber", name: "Silber", emoji: "🥈", price: 49,
    color: "#D4D4D4", glow: "#C0C0C055",
    tagline: "Blockchain-Power für Creator",
    verifyLevel: 3,
    apps: ["CreatorSeal", "AdEngine", "DataCore", "SocialHub", "Analytics Pro", "Creator-Website"],
    social: ["YouTube", "TikTok", "Instagram", "Facebook", "Twitch"],
    features: [
      { icon: "👤", text: "Creator-Profil + Custom Design", on: true },
      { icon: "📱", text: "QR + Barcode + Embed-Code", on: true },
      { icon: "✉️", text: "Multi-Faktor Verifikation", on: true },
      { icon: "🛡", text: "Silber Creator Badge", on: true },
      { icon: "💧", text: "Wasserzeichen (HD)", on: true },
      { icon: "⛓", text: "Polygon Blockchain Timestamp", on: true },
      { icon: "📡", text: "5 Social Media Plattformen", on: true },
      { icon: "🎬", text: "Content Feed (alle Plattf.)", on: true },
      { icon: "📊", text: "Erweiterte Analytics", on: true },
      { icon: "🔐", text: "C2PA 2.3 Signatur", on: false },
      { icon: "🎨", text: "Custom Domain", on: false },
      { icon: "🌍", text: "White-Label", on: false },
    ],
    highlight: true,
  },
  {
    id: "gold", name: "Gold", emoji: "🥇", price: 99,
    color: "#FFD700", glow: "#FFD70055",
    tagline: "Vollständiger Creator-Schutz",
    verifyLevel: 4,
    apps: ["Alle 16 Apps", "Creator-Website Pro", "Analytics Enterprise", "AdEngine Pro", "SocialHub", "AutoOS"],
    social: ["YouTube", "TikTok", "Instagram", "Facebook", "Twitch", "X/Twitter"],
    features: [
      { icon: "👤", text: "Creator-Profil + Shop-Integration", on: true },
      { icon: "📱", text: "QR + NFC-Tag Support", on: true },
      { icon: "✉️", text: "Biometrische Verifikation", on: true },
      { icon: "🛡", text: "Gold Creator Badge", on: true },
      { icon: "💧", text: "Wasserzeichen (4K)", on: true },
      { icon: "⛓", text: "Polygon + Zeitstempel Chain", on: true },
      { icon: "🔐", text: "C2PA 2.3 Vollstandard", on: true },
      { icon: "📡", text: "Alle 6 Social Plattformen", on: true },
      { icon: "🎬", text: "Content Feed + Auto-Posting", on: true },
      { icon: "📊", text: "Pro Analytics + CSV Export", on: true },
      { icon: "🎨", text: "Custom Design + Themes", on: true },
      { icon: "🌍", text: "Custom Domain", on: false },
    ],
    highlight: false,
  },
  {
    id: "platin", name: "Platin", emoji: "💎", price: 199,
    color: "#00D4FF", glow: "#00D4FF44",
    tagline: "Enterprise-Creator · White-Label",
    verifyLevel: 5,
    apps: ["Alle 16 Apps", "White-Label", "API unbegrenzt", "Custom Integrationen", "Team bis 25"],
    social: ["Alle Plattformen", "API-Direct Access", "Webhooks", "Auto-Posting"],
    features: [
      { icon: "👤", text: "Vollständige eigene Webseite", on: true },
      { icon: "📱", text: "NFC + QR + Barcode Bundle", on: true },
      { icon: "✉️", text: "Enterprise Verifikation", on: true },
      { icon: "🛡", text: "Platin Badge + Polygon NFT", on: true },
      { icon: "💧", text: "Wasserzeichen (8K + Video)", on: true },
      { icon: "⛓", text: "Multi-Chain Blockchain", on: true },
      { icon: "🔐", text: "C2PA 2.3 + Rechtsgutachten", on: true },
      { icon: "📡", text: "Alle Plattformen + Webhooks", on: true },
      { icon: "🎬", text: "Content Hub + KI-Planung", on: true },
      { icon: "🌍", text: "Custom Domain (eigene-domain.de)", on: true },
      { icon: "🎨", text: "White-Label Creator-Plattform", on: true },
      { icon: "🤖", text: "KI-Content-Assistent", on: true },
    ],
    highlight: false,
  },
  {
    id: "diamant", name: "Diamant", emoji: "💠", price: 499,
    color: "#93C5FD", glow: "#93C5FD44",
    tagline: "Höchste Stufe · Alles inklusive",
    verifyLevel: 6,
    apps: ["Alles aus Platin", "On-Premise", "Custom KI-Training", "Dedicated Manager"],
    social: ["Alle Plattformen", "Enterprise APIs", "Custom Integrationen", "SLA 99.99%"],
    features: [
      { icon: "👤", text: "Custom Creator-App (iOS/Android)", on: true },
      { icon: "📱", text: "Physische Creator-Card (NFC)", on: true },
      { icon: "✉️", text: "Rechtliche Absicherung", on: true },
      { icon: "🛡", text: "Diamant Badge + Exklusiv-Status", on: true },
      { icon: "💧", text: "Wasserzeichen + Steganografie", on: true },
      { icon: "⛓", text: "Eigene Blockchain-Node", on: true },
      { icon: "🔐", text: "C2PA 2.3 + Notarielle Bestätigung", on: true },
      { icon: "📡", text: "Alle Plattformen + Custom APIs", on: true },
      { icon: "🎬", text: "KI-Videoschnitt + Auto-Publishing", on: true },
      { icon: "🌍", text: "Multi-Domain + CDN weltweit", on: true },
      { icon: "🎨", text: "Custom App White-Label", on: true },
      { icon: "🤖", text: "Dedicated KI + Account Manager", on: true },
    ],
    highlight: false,
  },
];

const APPS_BY_PLAN = {
  gratis: ["CreatorSeal", "Creator-Profil", "QR-Code"],
  bronze: ["CreatorSeal", "AdEngine", "Creator-Profil+", "QR Pro"],
  silber: ["CreatorSeal", "AdEngine", "DataCore", "SocialHub", "Creator-Website", "Analytics"],
  gold:   ["CreatorSeal", "AdEngine", "DataCore", "SocialHub", "Creator-Website", "Analytics", "AutoOS", "FlowSync", "Optimus", "EduLab", "ReviewRadar", "ChurnRescue", "WaitlistKit", "Handwerk", "Gate", "Sicherheit"],
  platin: ["Alle 16 Apps", "White-Label", "API-Hub", "Enterprise-Tools", "Team-Manager", "Custom-Integration"],
  diamant:["Alle 16 Apps", "Custom iOS App", "Custom Android App", "On-Premise", "Eigene Blockchain-Node", "Dedicated Support"],
};

const SOCIAL_PLATFORMS = [
  { id: "youtube",   name: "YouTube",   icon: "▶", color: "#FF0000", followers: "12.4K", videos: "87",  views: "1.2M",  engagement: "8.4%" },
  { id: "tiktok",    name: "TikTok",    icon: "♪", color: "#00F2EA", followers: "34.7K", videos: "142", views: "5.8M",  engagement: "12.1%" },
  { id: "instagram", name: "Instagram", icon: "◈", color: "#E1306C", followers: "8.9K",  videos: "203", views: "420K",  engagement: "6.7%" },
  { id: "facebook",  name: "Facebook",  icon: "f", color: "#1877F2", followers: "3.2K",  videos: "45",  views: "87K",   engagement: "3.2%" },
  { id: "twitch",    name: "Twitch",    icon: "◉", color: "#9147FF", followers: "1.8K",  videos: "28",  views: "156K",  engagement: "15.4%" },
  { id: "x",         name: "X / Twitter",icon:"✕", color: "#FFFFFF", followers: "5.6K",  videos: "834", views: "980K",  engagement: "4.8%" },
];

const CONTENT_FEED = [
  { platform: "tiktok",    title: "CreatorSeal Demo #fyp",  views: "156K",  thumb: "🎵", date: "vor 5T",  verified: true,  wm: true  },
  { platform: "youtube",   title: "RealSync Dynamics Intro",views: "24.3K", thumb: "🎬", date: "vor 2T",  verified: true,  wm: true  },
  { platform: "youtube",   title: "Tutorial: C2PA 2.3",     views: "8.7K",  thumb: "📹", date: "vor 1W",  verified: true,  wm: true  },
  { platform: "tiktok",    title: "Blockchain für Creator", views: "89K",   thumb: "⛓", date: "vor 1W",  verified: true,  wm: true  },
  { platform: "instagram", title: "Behind the Scenes",      views: "12K",   thumb: "📸", date: "vor 2W",  verified: false, wm: false },
  { platform: "tiktok",    title: "Tech Stack 2026",        views: "234K",  thumb: "💻", date: "vor 1M",  verified: true,  wm: true  },
];

function QR({ size = 120, color = "#000" }) {
  const cells = 21, cs = size / cells;
  const h = 0xA7F3D0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="4"/>
      {Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) => {
          const fp = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
          const on = fp || ((h ^ (r * 31 + c * 17)) & 1) === 1;
          return on ? <rect key={`${r}-${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill={color}/> : null;
        })
      )}
    </svg>
  );
}

function Barcode({ value = "RS-2026-D5T8K1", height = 48 }) {
  let x = 6;
  const bars = [];
  for (let i = 0; i < value.length; i++) {
    const w = (value.charCodeAt(i) % 3 + 1) * 2.4;
    const gap = i % 4 === 0 ? 3.5 : 1.5;
    bars.push(<rect key={i} x={x} y={4} width={w} height={height - 16} fill="#111"/>);
    x += w + gap;
  }
  return (
    <svg width="260" height={height} viewBox={`0 0 260 ${height}`}>
      <rect width="260" height={height} fill="white" rx="4"/>
      {bars}
      <text x="130" y={height - 2} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#444">{value}</text>
    </svg>
  );
}

function Sparkline({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 30 - ((v - min) / (max - min)) * 28;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="100" height="32" viewBox="0 0 100 32">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts.split(" ").at(-1).split(",")[0]} cy={pts.split(" ").at(-1).split(",")[1]} r="3" fill={color}/>
    </svg>
  );
}

export default function CreatorSealDashboard() {
  const [activePlan, setActivePlan] = useState("gold");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectedSocials, setConnectedSocials] = useState({ youtube: true, tiktok: true, instagram: true, facebook: false, twitch: false, x: false });
  const [showQR, setShowQR] = useState(false);
  const [ticker, setTicker] = useState(0);
  const plan = PLANS.find(p => p.id === activePlan);
  const vl = plan.verifyLevel;

  useEffect(() => {
    const t = setInterval(() => setTicker(v => v + 1), 2800);
    return () => clearInterval(t);
  }, []);

  const totalFollowers = SOCIAL_PLATFORMS
    .filter(s => connectedSocials[s.id])
    .reduce((sum, s) => sum + parseFloat(s.followers) * 1000, 0);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "plans",     label: "Pakete & Preise" },
    { id: "profile",   label: "Creator Profil" },
    { id: "verify",    label: "Verifikation" },
    { id: "social",    label: "Social Media" },
    { id: "apps",      label: "Apps & Tools" },
  ];

  return (
    <div style={{ fontFamily: "'Syne', 'DM Mono', monospace", background: BG, color: "#E4E6EF", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0d14; }
        ::-webkit-scrollbar-thumb { background: #C9A84C44; border-radius: 2px; }
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:.9} 50%{opacity:.4} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px var(--gc)} 50%{box-shadow:0 0 40px var(--gc)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .plan-card { transition: all .25s cubic-bezier(.34,1.56,.64,1); }
        .plan-card:hover { transform: translateY(-6px) scale(1.01); }
        .btn-hover { transition: all .15s; }
        .btn-hover:hover { filter: brightness(1.2); transform: translateY(-1px); }
        .social-card { transition: all .2s; }
        .social-card:hover { transform: scale(1.02); }
        .tab-btn { transition: all .15s; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "rgba(3,5,10,.97)", borderBottom: `1px solid ${GOLD}22`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 12, height: 12, border: `1.5px solid ${GOLD}`, transform: "rotate(45deg)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 2, background: GOLD }}/>
            </div>
            <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: ".04em" }}>RealSync<span style={{ color: GOLD }}>Dynamics</span></span>
          </div>
          <span style={{ color: "#2A3348", fontSize: 13 }}>|</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: plan.color }}>🛡 CreatorSeal</span>
          <span style={{ fontSize: 10, fontFamily: "DM Mono,monospace", letterSpacing: ".08em", padding: "2px 8px", border: `1px solid ${plan.color}60`, color: plan.color, borderRadius: 2 }}>
            {plan.emoji} {plan.name.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#0B0F18", border: "1px solid #1a2238", borderRadius: 20, padding: "4px 12px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", animation: "pulse 1.2s ease infinite" }}/>
            <span style={{ fontFamily: "DM Mono,monospace", fontSize: 10, color: "#7A8498" }}>RS-2026-D5T8K1</span>
          </div>
          <button className="btn-hover" onClick={() => setShowQR(true)}
            style={{ fontSize: 10, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "5px 12px", background: `${CYAN}15`, border: `1px solid ${CYAN}40`, color: CYAN, borderRadius: 2, cursor: "pointer", letterSpacing: ".08em" }}>
            QR-CODE
          </button>
          <button className="btn-hover" onClick={() => setActiveTab("plans")}
            style={{ fontSize: 10, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "5px 14px", background: plan.color, color: "#000", border: "none", borderRadius: 2, cursor: "pointer", letterSpacing: ".08em" }}>
            UPGRADE {plan.emoji}
          </button>
        </div>
      </div>

      {/* ── PLAN SWITCHER ── */}
      <div style={{ background: "#070A12", borderBottom: "1px solid #0F1520", padding: "8px 20px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto" }}>
        <span style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Plan:</span>
        {PLANS.map(p => (
          <button key={p.id} onClick={() => setActivePlan(p.id)} className="btn-hover"
            style={{ fontSize: 9, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "4px 10px", borderRadius: 2, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: ".07em",
              background: activePlan === p.id ? p.color + "22" : "transparent",
              border: `1px solid ${p.color}${activePlan === p.id ? "80" : "30"}`,
              color: activePlan === p.id ? p.color : "#4A5568",
              opacity: activePlan === p.id ? 1 : .5 }}>
            {p.emoji} {p.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── TABS ── */}
      <div style={{ background: "rgba(7,10,18,.95)", borderBottom: "1px solid #0F1520", padding: "0 20px", display: "flex", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className="tab-btn"
            style={{ padding: "12px 16px", fontSize: 10, fontFamily: "DM Mono,monospace", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", background: "transparent", border: "none", whiteSpace: "nowrap",
              borderBottom: activeTab === t.id ? `2px solid ${plan.color}` : "2px solid transparent",
              color: activeTab === t.id ? plan.color : "#4A5568" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ════════ DASHBOARD ════════ */}
        {activeTab === "dashboard" && <>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { v: `${vl}/6`, l: "Verifikationsstufe", c: plan.color, sub: `${plan.emoji} ${plan.name}`, spark: [1,2,2,3,3,3,vl] },
              { v: `${(totalFollowers/1000).toFixed(1)}K`, l: "Total Follower", c: "#00C853", sub: "↑ alle Plattformen", spark: [22,28,31,35,38,42,48] },
              { v: "98.2", l: "Trust Score", c: GOLD, sub: "⭐ Verifiziert", spark: [88,91,93,94,96,97,98] },
              { v: `${Object.values(connectedSocials).filter(Boolean).length}/6`, l: "Plattformen", c: CYAN, sub: "Social Media", spark: [2,2,3,3,3,4,Object.values(connectedSocials).filter(Boolean).length] },
            ].map((s, i) => (
              <div key={i} style={{ background: "#0B0F18", border: `1px solid ${s.c}22`, borderRadius: 8, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, opacity: .4 }}>
                  <Sparkline data={s.spark} color={s.c}/>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, fontFamily: "DM Mono,monospace", color: "#4A5568", marginTop: 4, letterSpacing: ".08em", textTransform: "uppercase" }}>{s.l}</div>
                <div style={{ fontSize: 9, color: s.c, marginTop: 3, opacity: .8 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {/* Creator Card */}
            <div style={{ background: "#0B0F18", border: `1px solid ${plan.color}30`, borderRadius: 8, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle, ${plan.color}08, transparent 70%)`, pointerEvents: "none" }}/>
              <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>// Creator Card</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: `2px solid ${plan.color}`, background: `${plan.color}15`, flexShrink: 0, animation: "float 3s ease infinite" }}>🎬</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>Dominik Steiner</div>
                  <div style={{ fontSize: 10, fontFamily: "DM Mono,monospace", color: "#4A5568", marginBottom: 6 }}>@dominik_steiner · Tech & Startup</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 2, background: plan.color, color: "#000" }}>{plan.emoji} {plan.name.toUpperCase()}</span>
                    {vl >= 3 && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "#7C3AED22", border: "1px solid #7C3AED50", color: "#A78BFA" }}>⛓ CHAIN</span>}
                    {vl >= 4 && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "#0EA5E922", border: "1px solid #0EA5E950", color: "#38BDF8" }}>C2PA</span>}
                    {vl >= 2 && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "#00C85322", border: "1px solid #00C85350", color: "#00C853" }}>💧 WM</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[["▶ YouTube", "12.4K", "#FF0000"], ["♪ TikTok", "34.7K", "#00F2EA"], ["◈ Instagram", "8.9K", "#E1306C"]].map(([n,v,c]) => (
                  <div key={n} style={{ background: "#141C28", borderRadius: 6, padding: "8px 6px", textAlign: "center", border: `1px solid ${c}25` }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568", marginTop: 2 }}>{n}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, padding: "8px 0 0", borderTop: "1px solid #141C28" }}>
                <span style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>Neuhaus am Rennweg 🇩🇪</span>
                <span style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: plan.color }}>realsyncdynamics.de/creator/dominik</span>
              </div>
            </div>

            {/* QR + Barcode */}
            <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18 }}>
              <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>// Creator Code · Verifikationsnachweis</div>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ background: "white", borderRadius: 8, padding: 8, flexShrink: 0, boxShadow: `0 0 20px ${plan.color}22` }}>
                  <QR size={100} color={plan.color !== "#6B7280" ? "#000" : "#000"}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#4A5568", marginBottom: 8, lineHeight: 1.5 }}>Dein Creator-QR führt direkt zu deinem verifizierten Profil auf allen Plattformen.</div>
                  <div style={{ background: "white", borderRadius: 6, padding: "8px 10px" }}>
                    <Barcode value="RS-2026-D5T8K1" height={44}/>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button className="btn-hover" onClick={() => setShowQR(true)}
                  style={{ padding: "8px 0", borderRadius: 4, fontSize: 9, fontFamily: "DM Mono,monospace", fontWeight: 700, letterSpacing: ".08em", cursor: "pointer", background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>
                  📥 HERUNTERLADEN
                </button>
                <button className="btn-hover"
                  style={{ padding: "8px 0", borderRadius: 4, fontSize: 9, fontFamily: "DM Mono,monospace", fontWeight: 700, letterSpacing: ".08em", cursor: "pointer", background: "#141C28", border: "1px solid #1a2238", color: "#4A5568" }}>
                  📋 KOPIEREN
                </button>
              </div>
            </div>
          </div>

          {/* Social Media Row */}
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase" }}>// Social Media · Aggregiert</div>
              <button className="btn-hover" onClick={() => setActiveTab("social")}
                style={{ fontSize: 8, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "3px 10px", cursor: "pointer", background: "transparent", border: "1px solid #1a2238", color: "#4A5568", borderRadius: 2 }}>
                ALLE VERWALTEN →
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {SOCIAL_PLATFORMS.map(s => {
                const conn = connectedSocials[s.id];
                const locked = vl < 2;
                return (
                  <div key={s.id} className="social-card" onClick={() => !locked && setConnectedSocials(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                    style={{ padding: "12px 8px", borderRadius: 6, textAlign: "center", cursor: locked ? "default" : "pointer",
                      background: conn && !locked ? s.color + "12" : "#141C28",
                      border: `1px solid ${conn && !locked ? s.color + "40" : "#1a2238"}`,
                      opacity: locked ? .35 : 1 }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: conn && !locked ? s.color : "#4A5568", marginBottom: 3 }}>{s.name}</div>
                    {conn && !locked ? (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.followers}</div>
                        <div style={{ fontSize: 7, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>Follower</div>
                        <div style={{ fontSize: 8, color: "#00C853", marginTop: 2 }}>{s.engagement}</div>
                      </>
                    ) : (
                      <div style={{ fontSize: 8, color: locked ? "#1a2238" : "#4A5568", fontFamily: "DM Mono,monospace" }}>{locked ? "🔒" : "+ Verbinden"}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Feed */}
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18 }}>
            <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>// Neuester Content · Alle Plattformen</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {CONTENT_FEED.map((c, i) => {
                const sp = SOCIAL_PLATFORMS.find(s => s.id === c.platform);
                return (
                  <div key={i} style={{ background: "#141C28", borderRadius: 6, overflow: "hidden", border: `1px solid ${sp.color}20`, cursor: "pointer" }} className="social-card">
                    <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, background: sp.color + "10" }}>{c.thumb}</div>
                    <div style={{ padding: "8px 7px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: sp.color }}>{sp.icon}</span>
                        {c.verified && vl >= 2 && <span style={{ fontSize: 7, color: "#00C853", marginLeft: "auto" }}>✓</span>}
                        {c.wm && vl >= 2 && <span style={{ fontSize: 7, color: "#38BDF8" }}>💧</span>}
                      </div>
                      <div style={{ fontSize: 8.5, fontWeight: 700, color: "#E4E6EF", lineHeight: 1.3, marginBottom: 4 }}>{c.title}</div>
                      <div style={{ fontSize: 7.5, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>{c.views} · {c.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>}

        {/* ════════ PLANS ════════ */}
        {activeTab === "plans" && <>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: CYAN, letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 8 }}>// 6 Pakete · Von Gratis bis Enterprise</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Gratis starten. <span style={{ background: `linear-gradient(90deg, ${GOLD}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Skalieren wenn bereit.</span></div>
            <div style={{ fontSize: 12, color: "#4A5568" }}>Jederzeit upgraden · Monatlich kündbar · Kein Vertrag</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }}>
            {PLANS.map(p => (
              <div key={p.id} className="plan-card" onClick={() => setActivePlan(p.id)}
                style={{ "--gc": p.glow, background: p.highlighted || activePlan === p.id ? `linear-gradient(160deg, ${p.color}15, #0B0F18)` : "#0B0F18",
                  border: `1px solid ${p.color}${activePlan === p.id ? "80" : "30"}`,
                  borderRadius: 10, padding: 16, cursor: "pointer", position: "relative",
                  boxShadow: activePlan === p.id ? `0 0 30px ${p.glow}` : "none" }}>
                {p.highlighted && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", fontSize: 8, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "2px 8px", background: p.color, color: "#000", borderRadius: 2, letterSpacing: ".1em", whiteSpace: "nowrap" }}>EMPFOHLEN</div>}
                {activePlan === p.id && <div style={{ position: "absolute", top: -10, right: 8, fontSize: 8, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "2px 8px", background: "#00FF88", color: "#000", borderRadius: 2, letterSpacing: ".1em" }}>AKTIV</div>}

                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 28, marginBottom: 4, animation: activePlan === p.id ? "float 3s ease infinite" : "none" }}>{p.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: p.color, marginBottom: 4 }}>{p.name}</div>
                  {p.price === 0
                    ? <div style={{ fontSize: 22, fontWeight: 800, color: "#E4E6EF" }}>Gratis</div>
                    : <div><span style={{ fontSize: 22, fontWeight: 800, color: "#E4E6EF" }}>€{p.price}</span><span style={{ fontSize: 10, color: "#4A5568" }}>/Mo</span></div>}
                  <div style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568", marginTop: 4, lineHeight: 1.4 }}>{p.tagline}</div>
                </div>

                {/* Verification Level */}
                <div style={{ background: "#141C28", borderRadius: 4, padding: "6px 8px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 7, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>VERIFY LEVEL</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: p.color }}>{p.verifyLevel}/6</span>
                  </div>
                  <div style={{ height: 3, background: "#1a2238", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(p.verifyLevel/6)*100}%`, background: p.color, borderRadius: 2 }}/>
                  </div>
                </div>

                {/* Features */}
                <div style={{ space: 2 }}>
                  {p.features.slice(0, 8).map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 0", fontSize: 8.5 }}>
                      <span style={{ color: f.on ? "#00C853" : "#1a2238", flexShrink: 0 }}>{f.on ? "✓" : "✗"}</span>
                      <span style={{ color: f.on ? "#9BA3AF" : "#2A3348" }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                <button className="btn-hover" onClick={() => setActivePlan(p.id)}
                  style={{ width: "100%", marginTop: 12, padding: "8px 0", borderRadius: 4, fontSize: 9, fontFamily: "DM Mono,monospace", fontWeight: 700, letterSpacing: ".08em", cursor: "pointer", border: "none",
                    background: activePlan === p.id ? p.color : p.color + "22",
                    color: activePlan === p.id ? "#000" : p.color }}>
                  {activePlan === p.id ? "✓ AKTIV" : `${p.name.toUpperCase()} WÄHLEN`}
                </button>
              </div>
            ))}
          </div>

          {/* Feature Comparison Matrix */}
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18, overflowX: "auto" }}>
            <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>// Feature Vergleich</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontFamily: "DM Mono,monospace", color: "#4A5568", fontWeight: 400, borderBottom: "1px solid #141C28" }}>Feature</th>
                  {PLANS.map(p => (
                    <th key={p.id} style={{ padding: "6px 8px", textAlign: "center", fontWeight: 800, color: p.color, borderBottom: "1px solid #141C28", whiteSpace: "nowrap" }}>{p.emoji} {p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Creator-Profil",         true,true,true,true,true,true],
                  ["QR-Code + Barcode",       true,true,true,true,true,true],
                  ["Wasserzeichen",           false,true,true,true,true,true],
                  ["Blockchain-Timestamp",    false,false,true,true,true,true],
                  ["C2PA 2.3",               false,false,false,true,true,true],
                  ["Social APIs (3)",         false,true,false,false,false,false],
                  ["Social APIs (5)",         false,false,true,false,false,false],
                  ["Social APIs (alle 6)",    false,false,false,true,true,true],
                  ["Analytics Dashboard",    false,true,true,true,true,true],
                  ["Custom Domain",          false,false,false,false,true,true],
                  ["White-Label",            false,false,false,false,true,true],
                  ["Polygon NFT-Badge",      false,false,false,false,true,true],
                  ["Custom App (iOS/Android)",false,false,false,false,false,true],
                  ["Dedicated Manager",      false,false,false,false,false,true],
                ].map(([name, ...vals]) => (
                  <tr key={name as string} style={{ borderBottom: "1px solid #0d1117" }}>
                    <td style={{ padding: "7px 8px", fontFamily: "DM Mono,monospace", color: "#7A8498" }}>{name as string}</td>
                    {(vals as boolean[]).map((v, i) => (
                      <td key={i} style={{ padding: "7px 8px", textAlign: "center" }}>
                        <span style={{ fontSize: 11, color: v ? "#00C853" : "#1a2238" }}>{v ? "✓" : "✗"}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ════════ PROFILE ════════ */}
        {activeTab === "profile" && <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Left: Editor */}
            <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18 }}>
              <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>// Profil bearbeiten</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { l: "Anzeigename", v: "Dominik Steiner", t: "text" },
                  { l: "Username", v: "dominik_steiner", t: "text" },
                  { l: "Bio", v: "Creator, Developer & Gründer RealSync Dynamics 🚀", t: "ta" },
                  { l: "Kategorie", v: "Tech & Startup", t: "text" },
                  { l: "Ort", v: "Neuhaus am Rennweg 🇩🇪", t: "text" },
                  { l: "Website", v: "realsyncdynamics.de", t: "url", locked: vl < 2 },
                  { l: "Custom Domain", v: "dominik.creator.de", t: "url", locked: vl < 5 },
                ].map(f => (
                  <div key={f.l}>
                    <label style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".1em", display: "block", marginBottom: 4 }}>
                      {f.l} {f.locked && "🔒"}
                    </label>
                    {f.t === "ta"
                      ? <textarea rows={2} defaultValue={f.v} disabled={f.locked}
                          style={{ width: "100%", background: f.locked ? "#0a0d14" : "#141C28", border: "1px solid #1a2238", borderRadius: 4, padding: "8px 10px", fontSize: 10, color: f.locked ? "#2A3348" : "#E4E6EF", resize: "none", outline: "none", fontFamily: "Syne,sans-serif" }}/>
                      : <input type={f.t} defaultValue={f.v} disabled={f.locked}
                          style={{ width: "100%", background: f.locked ? "#0a0d14" : "#141C28", border: "1px solid #1a2238", borderRadius: 4, padding: "8px 10px", fontSize: 10, color: f.locked ? "#2A3348" : "#E4E6EF", outline: "none", fontFamily: "Syne,sans-serif" }}/>}
                  </div>
                ))}
                <button className="btn-hover"
                  style={{ width: "100%", padding: 10, borderRadius: 4, fontSize: 10, fontFamily: "DM Mono,monospace", fontWeight: 700, letterSpacing: ".1em", cursor: "pointer", background: plan.color, color: "#000", border: "none", marginTop: 4 }}>
                  ✓ PROFIL SPEICHERN
                </button>
              </div>
            </div>

            {/* Right: Live Preview — Public Creator Page */}
            <div style={{ background: "#0B0F18", border: `1px solid ${plan.color}30`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: plan.color, letterSpacing: ".15em", textTransform: "uppercase", padding: "12px 16px", borderBottom: `1px solid ${plan.color}20` }}>// Live Vorschau — Öffentliches Creator-Profil</div>
              {/* Browser Bar */}
              <div style={{ background: "#141C28", padding: "6px 10px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #0d1117" }}>
                {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }}/>)}
                <div style={{ flex: 1, background: "#0B0F18", borderRadius: 10, padding: "3px 10px", fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568", textAlign: "center" }}>realsyncdynamics.de/creator/dominik_steiner</div>
              </div>

              {/* Profile Page Preview */}
              <div style={{ padding: 20, background: `linear-gradient(160deg, ${plan.color}10 0%, #03050A 50%)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: `2px solid ${plan.color}`, background: `${plan.color}15`, flexShrink: 0 }}>🎬</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Dominik Steiner</div>
                    <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>@dominik_steiner</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 7px", background: plan.color, color: "#000", borderRadius: 2 }}>{plan.emoji} {plan.name.toUpperCase()}</span>
                      {vl >= 3 && <span style={{ fontSize: 8, padding: "1px 5px", background: "#7C3AED22", border: "1px solid #7C3AED40", color: "#A78BFA", borderRadius: 2 }}>⛓</span>}
                      {vl >= 4 && <span style={{ fontSize: 8, padding: "1px 5px", background: "#0EA5E922", border: "1px solid #0EA5E940", color: "#38BDF8", borderRadius: 2 }}>C2PA</span>}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#7A8498", marginBottom: 10 }}>Creator · Developer · Gründer RealSync Dynamics 🚀</div>

                {/* Social Buttons */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {SOCIAL_PLATFORMS.filter(s => connectedSocials[s.id]).map(s => (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 4, border: `1px solid ${s.color}30`, background: s.color + "10", fontSize: 9, fontWeight: 700, color: s.color }}>
                      {s.icon} {s.followers}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
                  {[[(totalFollowers/1000).toFixed(1)+"K","Follower"],["98.2","Trust Score"],["7.9M","Views"]].map(([v,l]) => (
                    <div key={l} style={{ textAlign: "center", background: "#0B0F18", borderRadius: 6, padding: "8px 4px", border: "1px solid #141C28" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: plan.color }}>{v}</div>
                      <div style={{ fontSize: 7.5, fontFamily: "DM Mono,monospace", color: "#4A5568", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* QR */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ background: "white", borderRadius: 8, padding: 8 }}>
                    <QR size={72} />
                  </div>
                </div>
                <div style={{ textAlign: "center", fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568", marginTop: 6 }}>realsyncdynamics.de/creator/dominik_steiner</div>
              </div>
            </div>
          </div>
        </>}

        {/* ════════ VERIFY ════════ */}
        {activeTab === "verify" && <>
          {/* Verification Pyramid */}
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 18 }}>// Verifikationsstufen — RealSync Creator Badges</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PLANS.map(p => {
                const active = vl >= p.verifyLevel;
                const current = vl === p.verifyLevel;
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 6, border: `1px solid ${p.color}${active ? "60" : "20"}`,
                    background: active ? `${p.color}08` : "#0a0d14", transition: "all .2s",
                    boxShadow: current ? `0 0 20px ${p.color}15` : "none" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `2px solid ${p.color}${active ? "80" : "20"}`,
                      background: active ? `${p.color}20` : "transparent", flexShrink: 0, animation: current ? "float 3s ease infinite" : "none" }}>
                      {active ? p.emoji : "🔒"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: active ? p.color : "#2A3348" }}>Stufe {p.verifyLevel} — {p.name} Creator</span>
                        {current && <span style={{ fontSize: 8, padding: "2px 8px", background: "#00C85320", border: "1px solid #00C85340", color: "#00C853", borderRadius: 2, fontFamily: "DM Mono,monospace", fontWeight: 700 }}>✓ AKTIV</span>}
                        {!active && <span style={{ fontSize: 8, padding: "2px 8px", background: "#1a2238", color: "#4A5568", borderRadius: 2, fontFamily: "DM Mono,monospace" }}>{p.name} benötigt</span>}
                      </div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {p.features.filter(f => f.on).slice(0, 5).map(f => (
                          <span key={f.text} style={{ fontSize: 8, fontFamily: "DM Mono,monospace", padding: "2px 6px", background: `${p.color}15`, color: p.color, borderRadius: 2 }}>{f.icon} {f.text}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      {active
                        ? <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#000", fontSize: 14 }}>✓</div>
                        : <button className="btn-hover" onClick={() => setActivePlan(p.id)}
                            style={{ fontSize: 8, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "5px 10px", cursor: "pointer", background: "transparent", border: `1px solid ${p.color}40`, color: p.color, borderRadius: 2 }}>
                            UPGRADE →
                          </button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Tech Stack */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { t: "Polygon Blockchain", icon: "⛓", color: "#9333EA", desc: "Unveränderlicher Zeitstempel auf Polygon PoS. Jeder Content erhält einen einzigartigen Block-Hash als Urheberschaftsbeweis.", detail: "0x7a2c4f8d...d8f1 · Block #68.241.009 · Polygon Mumbai", on: vl >= 3 },
              { t: "Unsichtbares Wasserzeichen", icon: "💧", color: "#3B82F6", desc: "Steganografisches Wasserzeichen direkt in deinen Content eingebettet. Unsichtbar für Zuschauer — gerichtsfest für dich.", detail: `WM-ID: RS-2026-D5T8K1 · SHA-256 Hash aktiv`, on: vl >= 2 },
              { t: "C2PA 2.3 Standard", icon: "🔐", color: "#06B6D4", desc: "Coalition for Content Provenance and Authenticity. Ed25519-Signatur + SHA-256 Hash-Chain. EU AI Act konform.", detail: "Ed25519 · SHA-256 · C2PA 2.3 · EU AI Act Ready", on: vl >= 4 },
            ].map(b => (
              <div key={b.t} style={{ background: "#0B0F18", border: `1px solid ${b.on ? b.color + "40" : "#141C28"}`, borderRadius: 8, padding: 16, opacity: b.on ? 1 : .4 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{b.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{b.t}</div>
                <div style={{ fontSize: 9.5, color: "#7A8498", lineHeight: 1.6, marginBottom: 10 }}>{b.desc}</div>
                {b.on
                  ? <div style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: b.color, background: `${b.color}10`, padding: "6px 8px", borderRadius: 4 }}>{b.detail}</div>
                  : <div style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: "#2A3348" }}>🔒 Höheres Paket benötigt</div>}
              </div>
            ))}
          </div>
        </>}

        {/* ════════ SOCIAL ════════ */}
        {activeTab === "social" && <>
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase" }}>// Social Media Integrationen · Alle gratis APIs</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["YT","#FF0000"],["TT","#00F2EA"],["IG","#E1306C"],["FB","#1877F2"],["TW","#9147FF"],["X","#FFF"]].map(([n,c]) => (
                  <div key={n} style={{ width: 20, height: 4, borderRadius: 2, background: c, opacity: .6 }}/>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 9, color: "#2A3348", fontFamily: "DM Mono,monospace", marginBottom: 14 }}>
              YouTube Data API v3 · TikTok Display API · Instagram Basic Display · Facebook Graph API · Twitch Helix API · Twitter v2
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {SOCIAL_PLATFORMS.map(s => {
                const conn = connectedSocials[s.id];
                const planIdx = ["youtube","tiktok","instagram","facebook","twitch","x"].indexOf(s.id);
                const reqLevel = planIdx < 2 ? 1 : planIdx < 5 ? 3 : 4;
                const locked = vl < reqLevel;
                return (
                  <div key={s.id} style={{ border: `1px solid ${conn && !locked ? s.color + "40" : "#1a2238"}`, borderRadius: 8, overflow: "hidden", background: conn && !locked ? s.color + "08" : "#0a0d14", opacity: locked ? .4 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
                      <span style={{ fontSize: 26, width: 36 }}>{s.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: conn && !locked ? s.color : "#4A5568" }}>{s.name}</div>
                        <div style={{ fontSize: 8.5, fontFamily: "DM Mono,monospace", color: "#2A3348" }}>
                          {s.id === "youtube" ? "YouTube Data API v3 (kostenlos)" :
                           s.id === "tiktok" ? "TikTok Display API (kostenlos)" :
                           s.id === "instagram" ? "Instagram Basic Display API" :
                           s.id === "facebook" ? "Facebook Graph API (kostenlos)" :
                           s.id === "twitch" ? "Twitch Helix API (kostenlos)" : "Twitter API v2 Basic (kostenlos)"}
                        </div>
                      </div>
                      <button onClick={() => !locked && setConnectedSocials(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                        style={{ fontSize: 9, fontFamily: "DM Mono,monospace", fontWeight: 700, padding: "5px 10px", cursor: locked ? "default" : "pointer",
                          background: conn && !locked ? `${s.color}20` : "transparent", border: `1px solid ${conn && !locked ? s.color : "#1a2238"}`,
                          color: conn && !locked ? s.color : "#4A5568", borderRadius: 2 }}>
                        {locked ? "🔒" : conn ? "✓ VERBUNDEN" : "+ VERBINDEN"}
                      </button>
                    </div>
                    {conn && !locked && <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "8px 14px", borderTop: `1px solid ${s.color}15`, gap: 4 }}>
                        {[[s.followers,"Follower"],[s.videos,"Posts"],[s.views,"Views"],[s.engagement,"Engage"]].map(([v,l]) => (
                          <div key={l} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: l === "Engage" ? "#00C853" : l === "Follower" ? s.color : "#E4E6EF" }}>{v}</div>
                            <div style={{ fontSize: 7.5, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>{l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 14px 10px" }}>
                        {["Profil anzeigen","Feed einbetten","Analytics","Follower-Growth","Auto-Posting","Kommentar-Management"].slice(0, s.id === "youtube" ? 5 : 4).map(f => (
                          <span key={f} style={{ fontSize: 7.5, fontFamily: "DM Mono,monospace", padding: "2px 6px", background: "#141C28", color: "#4A5568", borderRadius: 2 }}>{f}</span>
                        ))}
                      </div>
                    </>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aggregate */}
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18 }}>
            <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>// Aggregierte Stats · Alle Plattformen kombiniert</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { v: (totalFollowers/1000).toFixed(1)+"K", l: "Total Follower", c: CYAN, spark: [22,28,32,36,40,45,parseInt((totalFollowers/1000).toString())] },
                { v: "7.9M", l: "Total Views", c: "#00C853", spark: [1.2,2.1,2.8,3.9,5.1,6.4,7.9] },
                { v: "8.2%", l: "Ø Engagement", c: GOLD, spark: [6.1,6.8,7.2,7.4,7.8,8.0,8.2] },
                { v: Object.values(connectedSocials).filter(Boolean).length+"/6", l: "Plattformen", c: "#9147FF", spark: [1,1,2,2,2,3,Object.values(connectedSocials).filter(Boolean).length] },
              ].map(s => (
                <div key={s.l} style={{ background: "#141C28", borderRadius: 8, padding: 14, border: `1px solid ${s.c}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", marginTop: 4 }}>{s.l}</div>
                    </div>
                    <Sparkline data={s.spark} color={s.c}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ════════ APPS & TOOLS ════════ */}
        {activeTab === "apps" && <>
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 4 }}>// Freigeschaltete Apps & Tools · {plan.name}-Plan</div>
            <div style={{ fontSize: 9, color: "#2A3348", fontFamily: "DM Mono,monospace", marginBottom: 16 }}>
              {vl >= 4 ? "Alle 16 Apps freigeschaltet" : `${APPS_BY_PLAN[activePlan].length} Apps verfügbar · Upgrade für mehr`}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { n:"CreatorSeal",     i:"🛡", c:"#C9A84C", desc:"Identity & Verifikation",            locked:false },
                { n:"AdEngine",        i:"📺", c:"#FF6888", desc:"KI-Werbung 7 Kanäle",               locked:vl<2 },
                { n:"DataCore",        i:"📊", c:"#00F0FF", desc:"Analytics & BI",                    locked:vl<3 },
                { n:"SocialHub",       i:"📱", c:"#80FFC0", desc:"Social Media Manager",              locked:vl<3 },
                { n:"Creator-Website", i:"🌐", c:"#A78BFA", desc:"Eigene Creator-Page",               locked:false },
                { n:"Optimus",         i:"🤖", c:"#60D0FF", desc:"9 KI-Modelle · Perplexity",         locked:vl<4 },
                { n:"AutoOS",          i:"⚡", c:"#C080FF", desc:"Agenten & Automation",              locked:vl<4 },
                { n:"FlowSync",        i:"🔄", c:"#A78BFA", desc:"Workspace & Datenbanken",           locked:vl<4 },
                { n:"ReviewRadar",     i:"⭐", c:"#F9AB00", desc:"Review Management",                 locked:vl<4 },
                { n:"ChurnRescue",     i:"💳", c:"#FF4444", desc:"Stripe Recovery",                   locked:vl<4 },
                { n:"WaitlistKit",     i:"🚀", c:"#00FF88", desc:"Viral Waitlist",                    locked:vl<4 },
                { n:"EduLab",          i:"🎓", c:"#FFE060", desc:"Bildung & Lernpfade",               locked:vl<4 },
                { n:"Analytics Pro",   i:"📈", c:"#FF6B35", desc:"Enterprise Analytics",             locked:vl<5 },
                { n:"API-Hub",         i:"🔌", c:"#00D4FF", desc:"Unbegrenzte API-Aufrufe",           locked:vl<5 },
                { n:"White-Label",     i:"🎨", c:"#E879F9", desc:"Creator-Brand Tools",               locked:vl<5 },
                { n:"Enterprise",      i:"🏢", c:"#94A3B8", desc:"Team & Custom Integration",         locked:vl<6 },
              ].map(app => (
                <div key={app.n} style={{ padding: "12px 10px", borderRadius: 6, border: `1px solid ${app.locked ? "#1a2238" : app.c + "35"}`,
                  background: app.locked ? "#0a0d14" : app.c + "08", opacity: app.locked ? .35 : 1, cursor: app.locked ? "default" : "pointer",
                  transition: "all .15s" }}
                  className={app.locked ? "" : "social-card"}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{app.i}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: app.locked ? "#2A3348" : app.c, marginBottom: 2 }}>{app.n}</div>
                  <div style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568", lineHeight: 1.4 }}>{app.desc}</div>
                  {app.locked && <div style={{ fontSize: 7, fontFamily: "DM Mono,monospace", color: "#1a2238", marginTop: 4 }}>🔒 Upgrade nötig</div>}
                  {!app.locked && <div style={{ fontSize: 7, fontFamily: "DM Mono,monospace", color: app.c, marginTop: 4 }}>✓ AKTIV</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Unlock per Plan */}
          <div style={{ background: "#0B0F18", border: "1px solid #141C28", borderRadius: 8, padding: 18 }}>
            <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>// Apps je Paket</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {PLANS.map(p => (
                <div key={p.id} style={{ background: "#0a0d14", border: `1px solid ${p.color}30`, borderRadius: 6, padding: 12,
                  boxShadow: activePlan === p.id ? `0 0 20px ${p.color}20` : "none" }}>
                  <div style={{ textAlign: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 18 }}>{p.emoji}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: p.color }}>{p.name}</div>
                    <div style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>
                      {p.price === 0 ? "Gratis" : `€${p.price}/Mo`}
                    </div>
                  </div>
                  <div style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>
                    {APPS_BY_PLAN[p.id].map(a => (
                      <div key={a} style={{ padding: "2px 0", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: p.color }}>▸</span> {a}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}

      </div>

      {/* ── QR MODAL ── */}
      {showQR && (
        <div onClick={() => setShowQR(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(3,5,10,.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#0B0F18", border: `1px solid ${plan.color}50`, borderRadius: 12, padding: 28, maxWidth: 320, width: "100%",
              boxShadow: `0 0 60px ${plan.color}20` }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Creator QR-Code</div>
              <div style={{ fontSize: 9, fontFamily: "DM Mono,monospace", color: "#4A5568" }}>RS-2026-D5T8K1</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, filter: `drop-shadow(0 0 20px ${plan.color}40)` }}>
              <div style={{ background: "white", borderRadius: 10, padding: 10 }}>
                <QR size={180} color="#000"/>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ background: "white", borderRadius: 6, padding: "8px 10px" }}>
                <Barcode value="RS-2026-D5T8K1" height={52}/>
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: 8.5, fontFamily: "DM Mono,monospace", color: "#4A5568", marginBottom: 14 }}>
              realsyncdynamics.de/creator/dominik_steiner
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button className="btn-hover"
                style={{ padding: "10px 0", borderRadius: 4, fontSize: 10, fontFamily: "DM Mono,monospace", fontWeight: 700, cursor: "pointer", background: plan.color, color: "#000", border: "none", letterSpacing: ".07em" }}>
                📥 DOWNLOAD
              </button>
              <button onClick={() => setShowQR(false)}
                style={{ padding: "10px 0", borderRadius: 4, fontSize: 10, fontFamily: "DM Mono,monospace", fontWeight: 700, cursor: "pointer", background: "#141C28", color: "#4A5568", border: "1px solid #1a2238" }}>
                SCHLIESSEN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM TICKER ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 28, background: "rgba(3,5,10,.98)", borderTop: "1px solid #00F0FF0A", display: "flex", alignItems: "center", overflow: "hidden", zIndex: 99 }}>
        <div style={{ flexShrink: 0, padding: "0 10px", borderRight: "1px solid #0F1520", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00FF88", animation: "pulse 1s ease infinite" }}/>
          <span style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: CYAN, letterSpacing: ".15em" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 16px", overflow: "hidden", whiteSpace: "nowrap" }}>
          {[
            `${plan.emoji} ${plan.name} Plan aktiv`,
            `Verifikationsstufe ${vl}/6`,
            `Trust Score 98.2`,
            `⛓ Polygon Block #68.241.009`,
            `💧 Wasserzeichen aktiv`,
            `${Object.values(connectedSocials).filter(Boolean).length} Plattformen verbunden`,
            `${(totalFollowers/1000).toFixed(1)}K Total Follower`,
            `C2PA 2.3 ${vl >= 4 ? "✓" : "—"}`,
            `RS-2026-D5T8K1`,
          ].map((t, i) => (
            <span key={i} style={{ fontSize: 8, fontFamily: "DM Mono,monospace", color: i === 0 ? plan.color : "#2A3348", letterSpacing: ".07em" }}>
              {t} <span style={{ color: "#0F1520", marginLeft: 16 }}>◆</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ height: 28 }}/>
    </div>
  );
}
