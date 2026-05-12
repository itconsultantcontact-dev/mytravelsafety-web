import Head from "next/head";
import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "safety",
    icon: "🛡️",
    title: "City Safety Score",
    tag: "AI-POWERED",
    tagColor: "#2E86DE",
    desc: "Get an instant risk assessment for any city — safe, moderate, high, or extreme. Updated with fresh AI intelligence from 20+ global sources.",
    example: {
      city: "Bangkok, Thailand",
      level: "MODERATE",
      levelColor: "#CA8A04",
      detail: "Petty theft in tourist zones, tuk-tuk scams near Grand Palace, safe for most itineraries with standard precautions.",
    },
    sources: ["US State Dept. Travel Advisories", "UK FCDO Travel Advice", "OSAC Country Reports"],
  },
  {
    id: "scams",
    icon: "🚨",
    title: "Scam Intelligence",
    tag: "CITY-SPECIFIC",
    tagColor: "#EA580C",
    desc: "City-by-city scam database covering 33 scam types. Know exactly what to watch for before you land.",
    example: {
      city: "Rome, Italy",
      level: "WATCH",
      levelColor: "#CA8A04",
      detail: "Friendship bracelet trap near Colosseum · Fake ticket sellers at Vatican · Distraction pickpockets on Metro Line A.",
    },
    sources: ["EUROPOL Organised Crime Report", "US State Dept. Travel Alerts", "INTERPOL Financial Crime Unit"],
  },
  {
    id: "map",
    icon: "🗺️",
    title: "Interactive Risk Map",
    tag: "3D GLOBE",
    tagColor: "#16A34A",
    desc: "Visual 3D world map color-coded by risk level. Instantly spot danger zones across 150+ cities before booking.",
    example: {
      city: "Global Overview",
      level: "LIVE",
      levelColor: "#16A34A",
      detail: "Green zones: Tokyo, Copenhagen, Singapore · Amber: Paris, Istanbul, Mumbai · Red: Nairobi, Bogotá, Manila.",
    },
    sources: ["GDACS Disaster Alerts", "ACLED Conflict Data", "WHO Health Advisories"],
  },
  {
    id: "alerts",
    icon: "📡",
    title: "Live Global Alerts",
    tag: "REAL-TIME",
    tagColor: "#7C3AED",
    desc: "Live feeds from USGS earthquakes, WHO health alerts, GDACS disasters, and government travel advisories — all in one place.",
    example: {
      city: "Worldwide",
      level: "ACTIVE",
      levelColor: "#7C3AED",
      detail: "M5.2 earthquake near Tokyo · WHO Yellow Fever advisory Brazil · FCDO advises against travel to NE Mali.",
    },
    sources: ["USGS Earthquake Hazards", "WHO Disease Outbreak News", "GDACS Global Disaster Alert"],
  },
  {
    id: "community",
    icon: "👥",
    title: "Community Reports",
    tag: "CROWDSOURCED",
    tagColor: "#EA580C",
    desc: "Real traveler-submitted incidents from the ground. Scam sightings, unsafe areas, police presence — before it hits the news.",
    example: {
      city: "Paris, France",
      level: "REPORT",
      levelColor: "#EA580C",
      detail: "⚠ Pickpocket gang active near Eiffel Tower (reported 3h ago) · Card skimmer spotted at ATM near Gare du Nord.",
    },
    sources: ["Community verified reports", "Cross-referenced with EUROPOL data", "Local embassy feeds"],
  },
  {
    id: "share",
    icon: "🔗",
    title: "Shareable Briefings",
    tag: "ONE TAP",
    tagColor: "#2E86DE",
    desc: "Generate a safety briefing link for any city. Share with travel companions, family, or colleagues instantly.",
    example: {
      city: "mytravelsafety.net?city=Tokyo",
      level: "SHARE",
      levelColor: "#2E86DE",
      detail: "One URL delivers the full safety report — risk level, scams, dangerous areas, live alerts — no app install needed.",
    },
    sources: ["Powered by MyTravelSafety AI", "Data from 20+ global agencies", "Updated every 12 hours"],
  },
];

const DEMO_STEPS = [
  { step: "01", title: "Enter your destination", desc: "Type any city name. Our AI recognises 150+ cities across all continents.", visual: "🔍  Bangkok" },
  { step: "02", title: "Choose Live or Scan", desc: "Live fetches real-time data right now. Scan shows stored intelligence for that city.", visual: "🔴  Live" },
  { step: "03", title: "Get your safety briefing", desc: "In seconds: risk level, top threats, dangerous areas, precautions, and live alerts.", visual: "🟡  MODERATE RISK" },
  { step: "04", title: "Share with your group", desc: "One tap shares the full briefing via WhatsApp, email, or link. No account needed.", visual: "🔗  Share Report" },
];

const SOURCES = [
  { name: "INTERPOL", role: "Global crime & scam data", logo: "🔵" },
  { name: "EUROPOL", role: "Organised crime reports", logo: "🇪🇺" },
  { name: "UN OCHA", role: "Humanitarian emergency data", logo: "🆘" },
  { name: "USGS", role: "Earthquake & geological hazards", logo: "🌐" },
  { name: "WHO", role: "Health & disease outbreaks", logo: "🏥" },
  { name: "GDACS", role: "Global disaster alerts", logo: "🌀" },
  { name: "UK FCDO", role: "Foreign travel advisories", logo: "🇬🇧" },
  { name: "US State Dept.", role: "American travel warnings", logo: "🇺🇸" },
  { name: "Australian DFAT", role: "Australian travel advisories", logo: "🇦🇺" },
  { name: "Canada Global Affairs", role: "Canadian travel advisories", logo: "🇨🇦" },
  { name: "CDC Travel Health", role: "US health travel advisories", logo: "🦠" },
  { name: "ReliefWeb", role: "Humanitarian crisis reports", logo: "📡" },
];

const WHY = [
  { icon: "⚡", title: "Faster than any advisory", desc: "Government advisories lag by weeks. Our AI updates in real-time." },
  { icon: "🌍", title: "Truly global coverage", desc: "150+ cities across every continent including emerging and frontier markets." },
  { icon: "🎯", title: "City-level precision", desc: "Not country-level. We tell you which neighbourhood, which metro line, which scam." },
  { icon: "🔒", title: "No account required", desc: "No sign-up. No tracking. No paywall. Open the app and check your city." },
  { icon: "📱", title: "Works on any device", desc: "Mobile-first PWA. Works offline. Installable on iOS and Android." },
  { icon: "🤝", title: "Backed by real data", desc: "12+ authoritative global sources including INTERPOL, WHO, USGS and GDACS." },
];

// ── SHIELD LOGO SVG ───────────────────────────────────────────────────────────
function ShieldLogo({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} style={{ display:"block", flexShrink:0 }}>
      <defs>
        <linearGradient id="wsg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E86DE"/>
          <stop offset="100%" stopColor="#1565C0"/>
        </linearGradient>
      </defs>
      <path d="M16 2 L28 7 L28 17 C28 23.5 22.5 28.8 16 31 C9.5 28.8 4 23.5 4 17 L4 7 Z" fill="url(#wsg)"/>
      <polyline points="10,16 14,20 22,12" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeService, setActiveService] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setDemoStep(s => (s + 1) % DEMO_STEPS.length), 2800);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const s = SERVICES[activeService];

  return (
    <>
      <Head>
        <title>MyTravelSafety — Real-Time Travel Safety Intelligence</title>
        <meta name="description" content="Real-time travel safety scores, scam alerts, risk maps, and live advisories for 150+ cities worldwide. Powered by INTERPOL, EUROPOL, WHO and USGS data. Always free." />
        <meta name="keywords" content="travel safety, scam alerts, travel risk, city safety score, is it safe to travel, travel advisory, tourist scams, interpol travel, europol crime" />
        <link rel="canonical" href="https://mytravelsafety.net" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mytravelsafety.net" />
        <meta property="og:title" content="MyTravelSafety — Real-Time Travel Safety Intelligence" />
        <meta property="og:description" content="Real-time scam alerts, risk maps, and safety scores for 150+ cities. Backed by INTERPOL, EUROPOL, WHO, USGS data." />
        <meta property="og:image" content="https://mytravelsafety.net/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#F0F7FF" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', -apple-system, sans-serif;
          background: #F0F7FF;
          color: #1A3355;
          line-height: 1.6;
          overflow-x: hidden;
        }
        a { color: inherit; text-decoration: none; }
        ::selection { background: rgba(46,134,222,0.15); }

        :root {
          --bg: #F0F7FF;
          --surface: #FFFFFF;
          --surface2: #E3F0FB;
          --border: rgba(56,120,200,0.13);
          --accent: #2E86DE;
          --navy: #1565C0;
          --danger: #E53935;
          --text: #1A3355;
          --muted: #6B8CAE;
          --shadow: 0 1px 8px rgba(46,134,222,0.08), 0 2px 16px rgba(46,134,222,0.05);
          --shadow-lg: 0 4px 24px rgba(46,134,222,0.12), 0 8px 40px rgba(46,134,222,0.07);
        }

        /* NAV */
        .nav {
          position: sticky; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(16px, 4vw, 48px);
          height: 58px;
          background: rgba(240,247,255,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 1px 0 rgba(46,134,222,0.10);
        }
        .nav-brand {
          display: flex; align-items: center; gap: 8px;
        }
        .nav-logo-box {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #2E86DE, #1565C0);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(46,134,222,0.30);
        }
        .nav-logo-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #2E86DE; color: #FFFFFF;
          border-radius: 6px; padding: 4px 10px;
          font-size: 15px; font-weight: 800;
          letter-spacing: -0.2px;
          box-shadow: 0 2px 10px rgba(46,134,222,0.30);
        }
        .nav-links {
          display: flex; align-items: center; gap: 28px;
        }
        .nav-links button {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          transition: color .2s; letter-spacing: 0.2px;
        }
        .nav-links button:hover { color: var(--accent); }
        .nav-cta {
          background: var(--accent); color: #fff;
          padding: 8px 18px; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 3px 10px rgba(46,134,222,0.28);
          transition: all .2s; white-space: nowrap;
        }
        .nav-cta:hover { background: var(--navy); transform: translateY(-1px); }
        .nav-mobile-btn {
          display: none; background: none; border: none;
          cursor: pointer; font-size: 22px; color: var(--muted);
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-mobile-btn { display: block; }
          .nav-cta { display: none; }
        }
        .mobile-menu {
          position: fixed; top: 58px; left: 0; right: 0; z-index: 99;
          background: rgba(240,247,255,0.98); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 16px; display: flex; flex-direction: column; gap: 4px;
          box-shadow: var(--shadow-lg);
        }
        .mobile-menu button {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          padding: 12px 8px; text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .mobile-menu a {
          display: block; background: var(--accent); color: #fff;
          padding: 14px; border-radius: 10px; text-align: center;
          font-weight: 700; font-size: 15px; margin-top: 8px;
          box-shadow: 0 3px 10px rgba(46,134,222,0.28);
        }

        /* LIVE badge */
        .live-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--accent); color: #fff;
          border-radius: 6px; padding: 4px 10px;
          font-size: 10px; font-weight: 700; letter-spacing: 1.4px;
          box-shadow: 0 2px 10px rgba(46,134,222,0.35);
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.85); flex-shrink: 0;
          position: relative;
        }
        .live-dot::after {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          background: rgba(255,255,255,0.35);
          animation: liveRing 1.6s ease-out infinite;
        }
        @keyframes liveRing {
          0% { opacity:.8; transform: scale(1); }
          100% { opacity:0; transform: scale(2.8); }
        }

        /* SECTIONS */
        .section { padding: clamp(64px, 8vw, 100px) clamp(16px, 4vw, 48px); max-width: 1160px; margin: 0 auto; }
        .section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
        }
        .section-label::before {
          content: ''; width: 16px; height: 2px;
          background: var(--accent); border-radius: 1px;
        }
        .section-title {
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -0.8px; color: var(--text);
          margin-bottom: 12px;
        }
        .section-sub {
          font-size: clamp(14px, 1.4vw, 16px);
          color: var(--muted); max-width: 520px; line-height: 1.7;
          margin-bottom: 48px;
        }

        /* HERO */
        .hero {
          padding: clamp(48px, 8vw, 90px) clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px);
          max-width: 1160px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
        }
        @media (max-width: 860px) {
          .hero { grid-template-columns: 1fr; gap: 36px; }
          .hero-visual { display: none; }
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 700; letter-spacing: 1.4px;
          text-transform: uppercase; color: var(--accent);
          background: rgba(46,134,222,0.07);
          border: 1px solid rgba(46,134,222,0.18);
          border-radius: 20px; padding: 5px 12px;
          margin-bottom: 20px;
        }
        .hero-h1 {
          font-size: clamp(36px, 5.5vw, 60px);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -1.5px; color: var(--text);
          margin-bottom: 18px;
        }
        .hero-h1 .accent { color: var(--accent); }
        .hero-sub {
          font-size: clamp(14px, 1.5vw, 17px);
          color: var(--muted); line-height: 1.75;
          margin-bottom: 32px; max-width: 460px;
        }
        .hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .btn-primary {
          background: var(--accent); color: #fff;
          padding: 14px 28px; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          transition: all .2s; display: inline-block;
          box-shadow: 0 4px 16px rgba(46,134,222,0.28);
        }
        .btn-primary:hover { background: var(--navy); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(46,134,222,0.38); }
        .btn-ghost {
          color: var(--muted); font-size: 14px; font-weight: 600;
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--surface); border: 1.5px solid var(--border);
          padding: 13px 20px; border-radius: 12px;
          transition: all .2s;
        }
        .btn-ghost:hover { color: var(--accent); border-color: var(--accent); }
        .hero-trust {
          margin-top: 24px; display: flex; align-items: center; gap: 10px;
          font-size: 11px; color: var(--muted); font-weight: 600;
        }
        .trust-dots { display: flex; gap: 4px; }
        .trust-dot {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid var(--bg);
          background: linear-gradient(135deg, #2E86DE, #1565C0);
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; color: #fff; font-weight: 700;
          margin-left: -6px;
        }
        .trust-dot:first-child { margin-left: 0; }

        /* HERO VISUAL (app mockup) */
        .hero-visual {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-lg);
          position: relative;
        }
        .mock-hdr {
          height: 48px; background: rgba(240,247,255,0.97);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px;
        }
        .mock-body { padding: 18px; }
        .mock-input {
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 12px 14px;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 12px;
        }
        .mock-city { font-size: 13px; font-weight: 600; color: var(--text); flex: 1; }
        .mock-btns { display: flex; gap: 10px; margin-bottom: 14px; }
        .mock-btn-live {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          gap: 4px; padding: 12px 8px; border-radius: 12px;
          border: 2px solid #16A34A; background: rgba(22,163,74,0.07);
        }
        .mock-btn-scan {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          gap: 4px; padding: 12px 8px; border-radius: 12px;
          border: 2px solid #7C3AED; background: rgba(124,58,237,0.07);
        }
        .mock-btn-label { font-size: 13px; font-weight: 800; }
        .mock-btn-sub { font-size: 9px; color: var(--muted); text-align: center; }
        .mock-result {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 12px; padding: 14px; margin-bottom: 10px;
        }
        .mock-result-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .mock-city-name { font-size: 16px; font-weight: 800; color: var(--text); }
        .mock-badge {
          font-size: 10px; font-weight: 700; padding: 4px 10px;
          border-radius: 20px; border: 1px solid;
        }
        .mock-risk-bar { margin-bottom: 8px; }
        .mock-risk-label { font-size: 10px; color: var(--muted); font-weight:600; margin-bottom: 4px; }
        .mock-bar-bg { height: 4px; background: var(--surface2); border-radius: 2px; }
        .mock-bar-fill { height: 4px; border-radius: 2px; }
        .mock-tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .mock-tag {
          font-size: 10px; padding: 3px 8px; border-radius: 20px;
          background: rgba(46,134,222,0.08); color: var(--accent);
          border: 1px solid rgba(46,134,222,0.15); font-weight: 600;
        }
        .mock-nav {
          display: flex; border-top: 1px solid var(--border);
          background: rgba(255,255,255,0.98);
        }
        .mock-nav-item {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          padding: 8px 4px; gap: 2px;
        }
        .mock-nav-icon { font-size: 14px; }
        .mock-nav-lbl { font-size: 8px; font-weight: 700; color: var(--muted); }
        .mock-nav-item.active .mock-nav-lbl { color: var(--accent); }

        /* STATS BAR */
        .stats-bar {
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: var(--surface);
          box-shadow: var(--shadow);
        }
        .stats-inner {
          max-width: 1160px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 640px) { .stats-inner { grid-template-columns: repeat(2, 1fr); } }
        .stat {
          padding: 28px 20px; text-align: center;
          border-right: 1px solid var(--border);
        }
        .stat:last-child { border-right: none; }
        .stat-value {
          font-size: clamp(28px, 3vw, 36px); font-weight: 800;
          color: var(--accent); line-height: 1; margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .stat-label { font-size: 12px; color: var(--muted); font-weight: 600; }

        /* SERVICES */
        .services-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        @media (max-width: 900px) { .services-layout { grid-template-columns: 1fr; } }
        .service-list { display: flex; flex-direction: column; gap: 6px; }
        .service-item {
          padding: 16px 18px; cursor: pointer;
          border: 1.5px solid transparent;
          border-radius: 14px; transition: all .2s;
          background: var(--surface);
        }
        .service-item.active {
          background: var(--surface); border-color: var(--border);
          box-shadow: var(--shadow);
        }
        .service-item:hover:not(.active) { background: var(--surface); border-color: var(--border); }
        .service-item-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .service-icon { font-size: 20px; }
        .service-name { font-size: 14px; font-weight: 700; color: var(--text); flex: 1; }
        .service-tag {
          font-size: 9px; font-weight: 700; letter-spacing: 1px;
          padding: 3px 8px; border-radius: 20px; border: 1px solid;
        }
        .service-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .service-panel {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 16px; overflow: hidden;
          box-shadow: var(--shadow); position: sticky; top: 72px;
        }
        .panel-hdr {
          padding: 14px 18px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px;
          background: rgba(46,134,222,0.04);
        }
        .panel-hdr-icon {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #2E86DE, #1565C0);
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; font-size: 13px; flex-shrink: 0;
        }
        .panel-hdr-title { font-size: 11px; font-weight: 800; letter-spacing: .8px; color: var(--accent); text-transform: uppercase; }
        .panel-body { padding: 18px; }
        .panel-city {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
        }
        .panel-level {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: .5px;
          padding: 5px 12px; border-radius: 20px; margin-bottom: 14px;
          border: 1px solid;
        }
        .panel-detail {
          font-size: 13px; color: var(--text); line-height: 1.7;
          border-left: 3px solid rgba(46,134,222,0.20);
          padding-left: 13px; margin-bottom: 16px;
        }
        .panel-sources-lbl { font-size: 9px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
        .panel-sources { display: flex; flex-direction: column; gap: 6px; }
        .panel-source {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: var(--muted); font-weight: 600;
        }
        .panel-source::before { content: '↗'; color: var(--accent); font-size: 10px; font-weight: 800; }

        /* DEMO */
        .demo-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        @media (max-width: 900px) { .demo-layout { grid-template-columns: 1fr; } }
        .demo-steps { display: flex; flex-direction: column; }
        .demo-step {
          display: flex; gap: 16px; padding: 20px 0;
          border-bottom: 1px solid var(--border);
          transition: all .3s; cursor: pointer;
        }
        .demo-step:last-child { border-bottom: none; }
        .demo-step.active .demo-step-num {
          background: var(--accent); color: #fff; border-color: var(--accent);
          box-shadow: 0 2px 10px rgba(46,134,222,0.28);
        }
        .demo-step.active .demo-step-title { color: var(--text); }
        .demo-step-num {
          width: 34px; height: 34px; border-radius: 10px;
          border: 1.5px solid var(--border); background: var(--surface);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: var(--muted);
          flex-shrink: 0; transition: all .3s; letter-spacing: 0;
        }
        .demo-step-title { font-size: 15px; font-weight: 700; color: var(--muted); margin-bottom: 3px; transition: color .3s; }
        .demo-step-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .demo-screen {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-lg);
        }
        .demo-screen-bar {
          background: rgba(240,247,255,0.97); border-bottom: 1px solid var(--border);
          padding: 12px 16px; display: flex; align-items: center; gap: 6px;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .demo-screen-url {
          flex: 1; background: var(--bg); border-radius: 6px;
          padding: 4px 11px; font-size: 11px; color: var(--muted);
          margin-left: 6px; font-weight: 600;
        }
        .demo-progress { height: 2px; background: var(--surface2); position: relative; }
        .demo-progress-bar { height: 2px; background: var(--accent); transition: width 2.8s linear; }
        .demo-screen-body {
          padding: 28px; min-height: 240px;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center; text-align: center;
        }
        .demo-visual-emoji { font-size: 44px; margin-bottom: 14px; }
        .demo-visual-text { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; }
        .demo-visual-sub { font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 600; }

        /* WHY */
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 900px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .why-grid { grid-template-columns: 1fr; } }
        .why-card {
          padding: 22px; border: 1.5px solid var(--border);
          border-radius: 14px; background: var(--surface);
          transition: all .2s; box-shadow: var(--shadow);
        }
        .why-card:hover { border-color: rgba(46,134,222,0.30); box-shadow: var(--shadow-lg); transform: translateY(-2px); }
        .why-icon { font-size: 22px; margin-bottom: 12px; }
        .why-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .why-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

        /* SOURCES */
        .sources-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 900px) { .sources-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 560px) { .sources-grid { grid-template-columns: repeat(2, 1fr); } }
        .source-card {
          padding: 16px 18px; border: 1.5px solid var(--border);
          border-radius: 12px; background: var(--surface);
          transition: all .2s; box-shadow: var(--shadow);
        }
        .source-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .source-logo { font-size: 22px; margin-bottom: 8px; }
        .source-name { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
        .source-role { font-size: 11px; color: var(--muted); line-height: 1.4; }

        /* CTA */
        .cta-wrap { padding: 0 clamp(16px, 4vw, 48px) 80px; max-width: 1160px; margin: 0 auto; }
        .cta-section {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 24px; padding: clamp(40px, 5vw, 72px) clamp(20px, 4vw, 60px);
          text-align: center;
          box-shadow: var(--shadow-lg);
          position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #2E86DE, #1565C0);
        }
        .cta-h2 {
          font-size: clamp(24px, 4vw, 38px);
          font-weight: 800; letter-spacing: -0.8px; color: var(--text);
          margin-bottom: 10px;
        }
        .cta-sub { color: var(--muted); margin-bottom: 28px; font-size: 15px; }
        .cta-note { font-size: 12px; color: var(--muted); margin-top: 14px; font-weight: 600; }

        /* FOOTER */
        .footer-wrap { border-top: 1px solid var(--border); background: var(--surface); }
        .footer {
          max-width: 1160px; margin: 0 auto;
          padding: 28px clamp(16px, 4vw, 48px);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-brand { font-size: 13px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px; }
        .footer-links { display: flex; gap: 20px; font-size: 12px; color: var(--muted); font-weight: 600; flex-wrap: wrap; }
        .footer-links a:hover { color: var(--accent); }

        @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: none; } }
        .fadeup { animation: fadeUp .5s ease both; }
      `}</style>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* NAV */}
        <nav className="nav">
          <div className="nav-brand">
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:32, height:32, background:"linear-gradient(135deg,#2E86DE,#1565C0)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 10px rgba(46,134,222,0.30)" }}>
                <ShieldLogo size={18} />
              </div>
              <span style={{ fontSize:15, fontWeight:800, color:"#1A3355", letterSpacing:"-.2px", fontFamily:"'DM Sans',sans-serif" }}>MyTravelSafety</span>
            </div>
          </div>
          <div className="nav-links">
            <button onClick={() => scrollTo("services")}>Services</button>
            <button onClick={() => scrollTo("demo")}>How it works</button>
            <button onClick={() => scrollTo("sources")}>Sources</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
          </div>
          <a href="https://app.mytravelsafety.net" className="nav-cta">Open App →</a>
          <button className="nav-mobile-btn" onClick={() => setMenuOpen(m => !m)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => scrollTo("services")}>Services</button>
            <button onClick={() => scrollTo("demo")}>How it works</button>
            <button onClick={() => scrollTo("sources")}>Sources</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
            <a href="https://app.mytravelsafety.net" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"var(--accent)", color:"#fff", padding:14, borderRadius:10, textAlign:"center", fontWeight:700, fontSize:15, marginTop:8, boxShadow:"0 3px 10px rgba(46,134,222,0.28)", textDecoration:"none" }}>
              <ShieldLogo size={16} />Open App →
            </a>
          </div>
        )}

        {/* HERO */}
        <div className="hero">
          <div>
            <div className="hero-eyebrow fadeup">
              <div className="live-dot" />
              LIVE INTELLIGENCE · 150+ CITIES
            </div>
            <h1 className="hero-h1 fadeup" style={{ animationDelay:".05s" }}>
              Travel Smart.<br />
              <span className="accent">Stay Safe.</span>
            </h1>
            <p className="hero-sub fadeup" style={{ animationDelay:".1s" }}>
              Real-time safety scores, scam alerts, risk maps and live advisories
              for destinations worldwide. Backed by INTERPOL, EUROPOL, WHO, USGS and 8 more global agencies.
            </p>
            <div className="hero-actions fadeup" style={{ animationDelay:".15s" }}>
              <a href="https://app.mytravelsafety.net" className="btn-primary">Check Any City Free →</a>
              <button className="btn-ghost" onClick={() => scrollTo("demo")}>How it works ↓</button>
            </div>
            <div className="hero-trust fadeup" style={{ animationDelay:".2s" }}>
              <div className="trust-dots">
                {["I","E","U","W","G"].map((l,i) => (
                  <div className="trust-dot" key={i} style={{ zIndex:5-i }}>{l}</div>
                ))}
              </div>
              Trusted data from 12+ official global agencies
            </div>
          </div>

          {/* App Mockup */}
          <div className="hero-visual fadeup" style={{ animationDelay:".2s" }}>
            <div className="mock-hdr">
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:24, height:24, background:"linear-gradient(135deg,#2E86DE,#1565C0)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 1px 6px rgba(46,134,222,0.30)" }}>
                  <ShieldLogo size={13} />
                </div>
                <span style={{ fontSize:12, fontWeight:800, color:"#1A3355", letterSpacing:"-.1px" }}>MyTravelSafety</span>
              </div>
              <div className="live-badge">
                <div className="live-dot" />LIVE
              </div>
            </div>
            <div className="mock-body">
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:.8, color:"var(--accent)", textTransform:"uppercase", marginBottom:10 }}>Real-Time Safety Check</div>
              <div className="mock-input">
                <span style={{ fontSize:16 }}>🔍</span>
                <span className="mock-city">Paris, France</span>
              </div>
              <div className="mock-btns">
                <div className="mock-btn-live">
                  <span style={{ fontSize:18 }}>🔴</span>
                  <span className="mock-btn-label" style={{ color:"#16A34A" }}>Live</span>
                  <span className="mock-btn-sub">Real-time data<br />fetched now</span>
                </div>
                <div className="mock-btn-scan">
                  <span style={{ fontSize:18 }}>📦</span>
                  <span className="mock-btn-label" style={{ color:"#7C3AED" }}>Scan</span>
                  <span className="mock-btn-sub">Stored data<br />for this city</span>
                </div>
              </div>
              <div className="mock-result">
                <div className="mock-result-hdr">
                  <div>
                    <div className="mock-city-name">Paris</div>
                    <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>France</div>
                  </div>
                  <div className="mock-badge" style={{ color:"#CA8A04", borderColor:"rgba(202,138,4,0.3)", background:"rgba(202,138,4,0.08)" }}>MODERATE</div>
                </div>
                <div className="mock-risk-bar">
                  <div className="mock-risk-label">Safety Score — 71/100</div>
                  <div className="mock-bar-bg">
                    <div className="mock-bar-fill" style={{ width:"71%", background:"#CA8A04" }} />
                  </div>
                </div>
                <div className="mock-tags">
                  <span className="mock-tag">⚠ Pickpockets</span>
                  <span className="mock-tag">🚇 Metro Strike</span>
                  <span className="mock-tag">🚕 Taxi Scams</span>
                </div>
              </div>
              <div className="mock-nav">
                {[{e:"🛡️",l:"Safety",a:true},{e:"🗺️",l:"Map"},{e:"🔍",l:"Scams"},{e:"📡",l:"Alerts"},{e:"👥",l:"Reports"}].map((n,i) => (
                  <div key={i} className={`mock-nav-item ${n.a?"active":""}`}>
                    <span className="mock-nav-icon">{n.e}</span>
                    <span className="mock-nav-lbl" style={n.a?{color:"var(--accent)"}:{}}>{n.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-bar">
          <div className="stats-inner">
            {[
              { value: "150+", label: "Cities covered" },
              { value: "12+",  label: "Official sources" },
              { value: "Live", label: "Real-time updates" },
              { value: "$0",   label: "Always free" },
            ].map(s => (
              <div className="stat" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section className="section" id="services">
          <div className="section-label">What we offer</div>
          <h2 className="section-title">Six tools.<br />One mission.</h2>
          <p className="section-sub">Every feature built around one question: is it safe to go there?</p>

          <div className="services-layout">
            <div className="service-list">
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.id}
                  className={`service-item ${activeService === i ? "active" : ""}`}
                  onClick={() => setActiveService(i)}
                >
                  <div className="service-item-header">
                    <span className="service-icon">{svc.icon}</span>
                    <span className="service-name">{svc.title}</span>
                    <span className="service-tag" style={{ color: svc.tagColor, borderColor: svc.tagColor + "44", background: svc.tagColor + "10" }}>
                      {svc.tag}
                    </span>
                  </div>
                  {activeService === i && <p className="service-desc">{svc.desc}</p>}
                </div>
              ))}
            </div>

            <div className="service-panel">
              <div className="panel-hdr">
                <div className="panel-hdr-icon">{s.icon}</div>
                <span className="panel-hdr-title">{s.title}</span>
              </div>
              <div className="panel-body">
                <div className="panel-city">📍 {s.example.city}</div>
                <div className="panel-level" style={{ color: s.example.levelColor, borderColor: s.example.levelColor + "44", background: s.example.levelColor + "12" }}>
                  ● {s.example.level}
                </div>
                <p className="panel-detail">{s.example.detail}</p>
                <div className="panel-sources-lbl">Data Sources</div>
                <div className="panel-sources">
                  {s.sources.map(src => (
                    <div className="panel-source" key={src}>{src}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section className="section" id="demo" style={{ background:"var(--surface)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", maxWidth:"100%", padding:`clamp(64px,8vw,100px) 0` }}>
          <div style={{ maxWidth:1160, margin:"0 auto", padding:`0 clamp(16px,4vw,48px)` }}>
            <div className="section-label">How it works</div>
            <h2 className="section-title">From zero to briefed<br />in 30 seconds.</h2>
            <p className="section-sub">No account. No install. Just type a city and choose Live or Scan.</p>

            <div className="demo-layout">
              <div className="demo-steps">
                {DEMO_STEPS.map((d, i) => (
                  <div key={d.step} className={`demo-step ${demoStep === i ? "active" : ""}`} onClick={() => setDemoStep(i)}>
                    <div className="demo-step-num">{d.step}</div>
                    <div>
                      <div className="demo-step-title">{d.title}</div>
                      <div className="demo-step-desc">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="demo-screen">
                <div className="demo-screen-bar">
                  <div className="dot" style={{ background:"#FF5F57" }} />
                  <div className="dot" style={{ background:"#FEBC2E" }} />
                  <div className="dot" style={{ background:"#28C840" }} />
                  <div className="demo-screen-url">app.mytravelsafety.net</div>
                </div>
                <div className="demo-progress">
                  <div className="demo-progress-bar" style={{ width:`${((demoStep+1)/DEMO_STEPS.length)*100}%` }} />
                </div>
                <div className="demo-screen-body">
                  <div className="demo-visual-emoji">{DEMO_STEPS[demoStep].visual.split("  ")[0]}</div>
                  <div className="demo-visual-text">{DEMO_STEPS[demoStep].visual.split("  ")[1]}</div>
                  <div className="demo-visual-sub">{DEMO_STEPS[demoStep].title}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="section" id="why">
          <div className="section-label">Why MyTravelSafety</div>
          <h2 className="section-title">Built different.</h2>
          <p className="section-sub">Faster, more precise, and more trustworthy than any other travel advisory.</p>
          <div className="why-grid">
            {WHY.map(w => (
              <div className="why-card" key={w.title}>
                <div className="why-icon">{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SOURCES */}
        <section className="section" id="sources" style={{ background:"var(--surface)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", maxWidth:"100%", padding:`clamp(64px,8vw,100px) 0` }}>
          <div style={{ maxWidth:1160, margin:"0 auto", padding:`0 clamp(16px,4vw,48px)` }}>
            <div className="section-label">Trusted data</div>
            <h2 className="section-title">Intelligence backed<br />by real authorities.</h2>
            <p className="section-sub">Every assessment is cross-referenced against 12+ authoritative global agencies. No made-up data, ever.</p>
            <div className="sources-grid">
              {SOURCES.map(s => (
                <div className="source-card" key={s.name}>
                  <div className="source-logo">{s.logo}</div>
                  <div className="source-name">{s.name}</div>
                  <div className="source-role">{s.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-wrap" style={{ paddingTop:72 }}>
          <div className="cta-section">
            <h2 className="cta-h2">Your next trip deserves<br />a safety briefing first.</h2>
            <p className="cta-sub">Free. Instant. No account needed.</p>
            <a href="https://app.mytravelsafety.net" className="btn-primary">Open MyTravelSafety →</a>
            <div className="cta-note">Works on any device · 150+ cities · Real-time intelligence</div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer-wrap" id="contact">
          <div className="footer">
            <div className="footer-brand">
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:28, height:28, background:"linear-gradient(135deg,#2E86DE,#1565C0)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 1px 6px rgba(46,134,222,0.25)" }}>
                  <ShieldLogo size={15} />
                </div>
                <span style={{ fontSize:14, fontWeight:800, color:"#1A3355" }}>MyTravelSafety</span>
              </div>
            </div>
            <div className="footer-links">
              <a href="https://app.mytravelsafety.net">App</a>
              <a href="#services" onClick={e => { e.preventDefault(); scrollTo("services"); }}>Services</a>
              <a href="#sources" onClick={e => { e.preventDefault(); scrollTo("sources"); }}>Sources</a>
              <a href="mailto:travelsafety.noreply@gmail.com">travelsafety.noreply@gmail.com</a>
              <span>© {new Date().getFullYear()} MyTravelSafety</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
