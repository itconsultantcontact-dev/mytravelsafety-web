import Head from "next/head";
import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "safety",
    icon: "🛡️",
    title: "City Safety Score",
    tag: "AI-POWERED",
    tagColor: "#22D3EE",
    desc: "Get an instant risk assessment for any city — safe, moderate, high, or extreme. Updated twice daily with fresh AI intelligence.",
    example: {
      city: "Bangkok, Thailand",
      level: "MODERATE",
      levelColor: "#F59E0B",
      detail: "Petty theft in tourist zones, tuk-tuk scams near Grand Palace, safe for most itineraries with standard precautions.",
    },
    sources: ["Interpol Global Crime Trends", "OSAC Country Reports", "UK FCDO Travel Advisories"],
  },
  {
    id: "scams",
    icon: "🚨",
    title: "Scam Intelligence",
    tag: "CITY-SPECIFIC",
    tagColor: "#F87171",
    desc: "City-by-city scam database covering 33 scam types. Know exactly what to watch for before you land.",
    example: {
      city: "Rome, Italy",
      level: "WATCH",
      levelColor: "#F59E0B",
      detail: "Friendship bracelet trap near Colosseum · Fake ticket sellers at Vatican · Distraction pickpockets on Metro Line A.",
    },
    sources: ["Europol Organised Crime Report", "US State Dept. Travel Alerts", "Interpol Financial Crime Unit"],
  },
  {
    id: "map",
    icon: "🗺️",
    title: "Interactive Risk Map",
    tag: "3D GLOBE",
    tagColor: "#34D399",
    desc: "Visual 3D world map color-coded by risk level. Instantly spot danger zones across all 150+ cities before booking.",
    example: {
      city: "Global Overview",
      level: "LIVE",
      levelColor: "#34D399",
      detail: "Green zones: Tokyo, Copenhagen, Singapore · Amber: Paris, Istanbul, Mumbai · Red: Nairobi, Bogotá, Manila.",
    },
    sources: ["GDACS Disaster Alerts", "ACLED Conflict Data", "WHO Health Advisories"],
  },
  {
    id: "alerts",
    icon: "📡",
    title: "Live Global Alerts",
    tag: "REAL-TIME",
    tagColor: "#A78BFA",
    desc: "Live feeds from USGS earthquakes, WHO health alerts, GDACS disasters, and government travel advisories — all in one place.",
    example: {
      city: "Worldwide",
      level: "ACTIVE",
      levelColor: "#A78BFA",
      detail: "M5.2 earthquake near Tokyo · WHO Yellow Fever advisory Brazil · FCDO advises against travel to NE Mali.",
    },
    sources: ["USGS Earthquake Hazards", "WHO Disease Outbreak News", "GDACS Global Disaster Alert"],
  },
  {
    id: "community",
    icon: "👥",
    title: "Community Reports",
    tag: "CROWDSOURCED",
    tagColor: "#FB923C",
    desc: "Real traveler-submitted incidents from the ground. Scam sightings, unsafe areas, police presence — before it hits the news.",
    example: {
      city: "Paris, France",
      level: "REPORT",
      levelColor: "#FB923C",
      detail: "⚠ Pickpocket gang active near Eiffel Tower (reported 3h ago) · Card skimmer spotted at ATM near Gare du Nord.",
    },
    sources: ["Community verified reports", "Cross-referenced with Europol data", "Local embassy feeds"],
  },
  {
    id: "share",
    icon: "🔗",
    title: "Shareable Briefings",
    tag: "ONE TAP",
    tagColor: "#60A5FA",
    desc: "Generate a safety briefing link for any city. Share with travel companions, family, or colleagues instantly.",
    example: {
      city: "mytravelsafety.net?city=Tokyo",
      level: "SHARE",
      levelColor: "#60A5FA",
      detail: "One URL delivers the full safety report — risk level, scams, dangerous areas, live alerts — no app install needed.",
    },
    sources: ["Powered by MyTravelSafety AI", "Data from 6 global agencies", "Updated every 12 hours"],
  },
];

const DEMO_STEPS = [
  { step: "01", title: "Enter your destination", desc: "Type any city name. Our AI recognises 150+ cities across all continents.", visual: "🔍  Bangkok" },
  { step: "02", title: "Pick your travel dates", desc: "Date-aware analysis flags events, seasons, and known risk periods for your exact window.", visual: "📅  12 Jun → 19 Jun" },
  { step: "03", title: "Get your safety briefing", desc: "In seconds: risk level, top threats, dangerous areas, precautions, and live alerts.", visual: "🟡  MODERATE RISK" },
  { step: "04", title: "Share with your group", desc: "One tap shares the full briefing via WhatsApp, email, or link. No account needed.", visual: "🔗  Share Report" },
];

const SOURCES = [
  { name: "Interpol", role: "Global crime & scam data", url: "https://www.interpol.int", logo: "🔵" },
  { name: "Europol", role: "Organised crime reports", url: "https://www.europol.europa.eu", logo: "🇪🇺" },
  { name: "USGS", role: "Earthquake & geological hazards", url: "https://www.usgs.gov", logo: "🌐" },
  { name: "WHO", role: "Health & disease outbreaks", url: "https://www.who.int", logo: "🏥" },
  { name: "GDACS", role: "Global disaster alerts", url: "https://www.gdacs.org", logo: "🚨" },
  { name: "UK FCDO", role: "Foreign travel advisories", url: "https://www.gov.uk/foreign-travel-advice", logo: "🇬🇧" },
  { name: "US State Dept.", role: "American travel warnings", url: "https://travel.state.gov", logo: "🇺🇸" },
  { name: "ACLED", role: "Armed conflict & protest data", url: "https://acleddata.com", logo: "⚔️" },
];

const WHY = [
  { icon: "⚡", title: "Faster than any advisory", desc: "Government advisories lag by weeks. Our AI updates every 12 hours." },
  { icon: "🌍", title: "Truly global coverage", desc: "150+ cities across every continent including emerging and frontier markets." },
  { icon: "🎯", title: "City-level precision", desc: "Not country-level. We tell you which neighbourhood, which metro line, which scam." },
  { icon: "🔒", title: "No account required", desc: "No sign-up. No tracking. No paywall. Open the app and check your city." },
  { icon: "📱", title: "Works on any device", desc: "Mobile-first PWA. Works offline. Installable on iOS and Android." },
  { icon: "🤝", title: "Backed by real data", desc: "8 authoritative global sources including Interpol, Europol, USGS and WHO." },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeService, setActiveService] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const demoRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setDemoStep(s => (s + 1) % DEMO_STEPS.length), 2800);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <Head>
        <title>MyTravelSafety — Real-Time Travel Safety Intelligence</title>
        <meta name="description" content="Real-time travel safety scores, scam alerts, risk maps, and live advisories for 150+ cities worldwide. Powered by Interpol, Europol, WHO and USGS data. Always free." />
        <meta name="keywords" content="travel safety, scam alerts, travel risk, city safety score, is it safe to travel, travel advisory, tourist scams, interpol travel, europol crime" />
        <link rel="canonical" href="https://mytravelsafety.net" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mytravelsafety.net" />
        <meta property="og:title" content="MyTravelSafety — Real-Time Travel Safety Intelligence" />
        <meta property="og:description" content="Real-time scam alerts, risk maps, and safety scores for 150+ cities. Backed by Interpol, Europol, WHO, USGS data." />
        <meta property="og:image" content="https://mytravelsafety.net/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MyTravelSafety — Real-Time Travel Safety Intelligence" />
        <meta name="twitter:description" content="Real-time scam alerts, risk maps, and safety scores for 150+ cities." />
        <meta name="theme-color" content="#060B18" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          "name": "MyTravelSafety", "url": "https://app.mytravelsafety.net",
          "description": "Real-time travel safety intelligence for 150+ cities worldwide.",
          "applicationCategory": "TravelApplication", "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        })}} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', -apple-system, sans-serif;
          background: #060B18;
          color: #C8D6E5;
          line-height: 1.6;
          overflow-x: hidden;
        }
        a { color: inherit; text-decoration: none; }
        ::selection { background: rgba(34,211,238,0.2); }

        /* NOISE OVERLAY */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        /* GRID BACKGROUND */
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .page { position: relative; z-index: 1; }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(20px, 4vw, 60px);
          height: 64px;
          background: rgba(6,11,24,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(34,211,238,0.08);
        }
        .nav-brand {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 17px;
          letter-spacing: -0.3px;
          display: flex; align-items: center; gap: 8px;
          color: #fff;
        }
        .nav-brand span { color: #22D3EE; }
        .nav-links {
          display: flex; align-items: center; gap: 32px;
          font-size: 14px; font-weight: 500; color: #64748B;
        }
        .nav-links button {
          background: none; border: none; cursor: pointer;
          color: #64748B; font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: color .2s;
        }
        .nav-links button:hover { color: #C8D6E5; }
        .nav-cta {
          background: #22D3EE; color: #060B18;
          padding: 9px 20px; border-radius: 8px;
          font-size: 14px; font-weight: 700;
          font-family: 'Syne', sans-serif;
          letter-spacing: -0.2px;
          transition: all .2s; white-space: nowrap;
        }
        .nav-cta:hover { background: #67E8F9; transform: translateY(-1px); }
        .nav-mobile-btn {
          display: none; background: none; border: none;
          cursor: pointer; font-size: 22px; color: #94A3B8;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-mobile-btn { display: block; }
          .nav-cta { display: none; }
        }
        .mobile-menu {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 99;
          background: rgba(6,11,24,0.97); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(34,211,238,0.08);
          padding: 20px; display: flex; flex-direction: column; gap: 4px;
        }
        .mobile-menu button {
          background: none; border: none; cursor: pointer;
          color: #94A3B8; font-size: 16px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          padding: 12px 8px; text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .mobile-menu a {
          display: block; background: #22D3EE; color: #060B18;
          padding: 14px; border-radius: 8px; text-align: center;
          font-weight: 700; font-size: 15px; margin-top: 8px;
        }

        /* SECTIONS */
        .section { padding: clamp(80px, 10vw, 120px) clamp(20px, 4vw, 60px); max-width: 1200px; margin: 0 auto; }
        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: #22D3EE;
          margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -1px; color: #fff;
          margin-bottom: 16px;
        }
        .section-sub {
          font-size: clamp(15px, 1.5vw, 18px);
          color: #64748B; max-width: 560px; line-height: 1.7;
          margin-bottom: 56px;
        }

        /* HERO */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 120px clamp(20px, 4vw, 60px) 80px;
          position: relative;
        }
        .hero-glow {
          position: absolute; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(34,211,238,0.06);
          border: 1px solid rgba(34,211,238,0.2);
          color: #22D3EE; font-size: 12px; font-weight: 600;
          padding: 7px 16px; border-radius: 999px;
          margin-bottom: 32px; letter-spacing: 0.5px;
          animation: fadeUp .6s ease both;
        }
        .hero-badge::before { content: '●'; font-size: 8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.3; } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: none; } }
        .hero-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(44px, 8vw, 88px);
          font-weight: 800; line-height: 1.0; letter-spacing: -3px;
          color: #fff; margin-bottom: 24px;
          animation: fadeUp .6s .1s ease both;
        }
        .hero-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #22D3EE, #818CF8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-size: clamp(16px, 2vw, 20px); color: #64748B;
          max-width: 520px; line-height: 1.7; margin: 0 auto 40px;
          animation: fadeUp .6s .2s ease both;
        }
        .hero-actions {
          display: flex; gap: 16px; align-items: center; justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp .6s .3s ease both;
        }
        .btn-primary {
          background: #22D3EE; color: #060B18;
          padding: 16px 36px; border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700; letter-spacing: -0.3px;
          transition: all .2s; display: inline-block;
          box-shadow: 0 0 40px rgba(34,211,238,0.2);
        }
        .btn-primary:hover { background: #67E8F9; transform: translateY(-2px); box-shadow: 0 0 60px rgba(34,211,238,0.35); }
        .btn-ghost {
          color: #64748B; font-size: 15px; font-weight: 500;
          display: inline-flex; align-items: center; gap: 8px;
          transition: color .2s;
        }
        .btn-ghost:hover { color: #94A3B8; }
        .hero-scroll {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          color: #1E293B; font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          animation: fadeUp .6s .5s ease both;
        }
        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, #22D3EE, transparent);
          animation: scrollPulse 2s infinite;
        }
        @keyframes scrollPulse { 0%,100% { opacity:.3; } 50% { opacity:1; } }

        /* STATS BAR */
        .stats-bar {
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.015);
          padding: 0 clamp(20px, 4vw, 60px);
        }
        .stats-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 640px) { .stats-inner { grid-template-columns: repeat(2, 1fr); } }
        .stat {
          padding: 32px 24px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.04);
        }
        .stat:last-child { border-right: none; }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 36px; font-weight: 800; color: #22D3EE;
          line-height: 1; margin-bottom: 6px;
        }
        .stat-label { font-size: 13px; color: #334155; font-weight: 500; }

        /* SERVICES */
        .services-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
        }
        @media (max-width: 900px) { .services-layout { grid-template-columns: 1fr; } }
        .service-list { display: flex; flex-direction: column; gap: 2px; }
        .service-item {
          padding: 24px 28px; cursor: pointer;
          border: 1px solid transparent;
          border-radius: 12px; transition: all .2s;
          position: relative; overflow: hidden;
        }
        .service-item.active {
          background: rgba(34,211,238,0.04);
          border-color: rgba(34,211,238,0.15);
        }
        .service-item:hover:not(.active) { background: rgba(255,255,255,0.02); }
        .service-item-header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
        .service-icon { font-size: 22px; }
        .service-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700; color: #fff; flex: 1;
        }
        .service-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 1px;
          padding: 3px 8px; border-radius: 4px;
          border: 1px solid; opacity: 0.7;
        }
        .service-desc { font-size: 14px; color: #475569; line-height: 1.6; }
        .service-panel {
          padding: 32px; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; position: sticky; top: 80px;
        }
        .panel-city {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #475569; margin-bottom: 16px;
        }
        .panel-level {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1px;
          padding: 6px 14px; border-radius: 6px; margin-bottom: 20px;
          border: 1px solid;
        }
        .panel-detail {
          font-size: 15px; color: #94A3B8; line-height: 1.7;
          border-left: 2px solid rgba(34,211,238,0.2);
          padding-left: 16px; margin-bottom: 24px;
        }
        .panel-sources { display: flex; flex-direction: column; gap: 8px; }
        .panel-source {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; color: #334155;
        }
        .panel-source::before { content: '↗'; color: #22D3EE; font-size: 11px; }

        /* DEMO */
        .demo-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        @media (max-width: 900px) { .demo-layout { grid-template-columns: 1fr; } }
        .demo-steps { display: flex; flex-direction: column; gap: 0; }
        .demo-step {
          display: flex; gap: 20px; padding: 24px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: all .3s; cursor: pointer;
        }
        .demo-step:last-child { border-bottom: none; }
        .demo-step.active .demo-step-num { color: #22D3EE; border-color: #22D3EE; background: rgba(34,211,238,0.08); }
        .demo-step.active .demo-step-title { color: #fff; }
        .demo-step-num {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1px solid #1E293B; display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
          color: #334155; flex-shrink: 0; transition: all .3s;
        }
        .demo-step-body { flex: 1; }
        .demo-step-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #475569; margin-bottom: 4px; transition: color .3s; }
        .demo-step-desc { font-size: 14px; color: #334155; line-height: 1.6; }
        .demo-screen {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
        }
        .demo-screen-bar {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 14px 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .demo-screen-url {
          flex: 1; background: rgba(255,255,255,0.04);
          border-radius: 6px; padding: 5px 12px;
          font-size: 12px; color: #334155; margin-left: 8px;
        }
        .demo-screen-body { padding: 32px; min-height: 280px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .demo-visual-emoji { font-size: 48px; margin-bottom: 16px; }
        .demo-visual-text {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800; color: #fff;
          letter-spacing: -0.5px;
        }
        .demo-progress { height: 2px; background: rgba(34,211,238,0.1); position: relative; }
        .demo-progress-bar { height: 2px; background: #22D3EE; transition: width 2.8s linear; }

        /* WHY */
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .why-grid { grid-template-columns: 1fr; } }
        .why-card {
          padding: 28px; border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; transition: all .2s;
          background: rgba(255,255,255,0.01);
        }
        .why-card:hover { border-color: rgba(34,211,238,0.15); background: rgba(34,211,238,0.02); }
        .why-icon { font-size: 24px; margin-bottom: 14px; }
        .why-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .why-desc { font-size: 14px; color: #475569; line-height: 1.6; }

        /* SOURCES */
        .sources-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .sources-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .sources-grid { grid-template-columns: repeat(2, 1fr); } }
        .source-card {
          padding: 20px 24px;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; background: rgba(255,255,255,0.015);
          transition: all .2s;
        }
        .source-card:hover { border-color: rgba(34,211,238,0.2); transform: translateY(-2px); }
        .source-logo { font-size: 24px; margin-bottom: 10px; }
        .source-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .source-role { font-size: 12px; color: #334155; line-height: 1.4; }

        /* CTA */
        .cta-section {
          margin: 0 clamp(20px, 4vw, 60px) 80px;
          background: linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(129,140,248,0.06) 100%);
          border: 1px solid rgba(34,211,238,0.15);
          border-radius: 24px; padding: clamp(48px, 6vw, 80px) clamp(24px, 4vw, 60px);
          text-align: center; position: relative; overflow: hidden;
        }
        .cta-glow {
          position: absolute; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cta-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800; letter-spacing: -1px; color: #fff;
          margin-bottom: 12px; position: relative;
        }
        .cta-sub { color: #475569; margin-bottom: 36px; font-size: 16px; position: relative; }
        .cta-note { font-size: 13px; color: #334155; margin-top: 16px; }

        /* FOOTER */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.04);
          padding: 32px clamp(20px, 4vw, 60px);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
          max-width: 1200px; margin: 0 auto;
        }
        .footer-brand { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #1E293B; }
        .footer-links { display: flex; gap: 24px; font-size: 13px; color: #1E293B; flex-wrap: wrap; }
        .footer-links a:hover { color: #475569; }
      `}</style>

      <div className="grid-bg" />

      <div className="page">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-brand">🛡️ My<span>Travel</span>Safety</div>
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
            <a href="https://app.mytravelsafety.net">Open App →</a>
          </div>
        )}

        {/* HERO */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-badge">Live intelligence · 150+ cities</div>
          <h1 className="hero-h1">
            Travel Smart.<br /><em>Stay Safe.</em>
          </h1>
          <p className="hero-sub">
            Real-time safety scores, scam alerts, risk maps and live advisories for destinations worldwide.
            Backed by Interpol, Europol, WHO and USGS data.
          </p>
          <div className="hero-actions">
            <a href="https://app.mytravelsafety.net" className="btn-primary">Check Any City Free →</a>
            <button className="btn-ghost" onClick={() => scrollTo("demo")}>
              See how it works ↓
            </button>
          </div>
          <div className="hero-scroll">
            <div className="scroll-line" />
          </div>
        </section>

        {/* STATS */}
        <div className="stats-bar">
          <div className="stats-inner">
            {[
              { value: "150+", label: "Cities covered" },
              { value: "2×",   label: "Daily AI updates" },
              { value: "8",    label: "Global data sources" },
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
              {SERVICES.map((s, i) => (
                <div
                  key={s.id}
                  className={`service-item ${activeService === i ? "active" : ""}`}
                  onClick={() => setActiveService(i)}
                >
                  <div className="service-item-header">
                    <span className="service-icon">{s.icon}</span>
                    <span className="service-name">{s.title}</span>
                    <span className="service-tag" style={{ color: s.tagColor, borderColor: s.tagColor + "44" }}>
                      {s.tag}
                    </span>
                  </div>
                  {activeService === i && (
                    <p className="service-desc">{s.desc}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="service-panel">
              {(() => {
                const s = SERVICES[activeService];
                return (
                  <>
                    <div className="panel-city">📍 {s.example.city}</div>
                    <div className="panel-level" style={{ color: s.example.levelColor, borderColor: s.example.levelColor + "33", background: s.example.levelColor + "11" }}>
                      ● {s.example.level}
                    </div>
                    <p className="panel-detail">{s.example.detail}</p>
                    <div style={{ fontSize: 11, color: "#22D3EE", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Data sources</div>
                    <div className="panel-sources">
                      {s.sources.map(src => (
                        <div className="panel-source" key={src}>{src}</div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section className="section" id="demo" ref={demoRef}>
          <div className="section-label">How it works</div>
          <h2 className="section-title">From zero to briefed<br />in 30 seconds.</h2>
          <p className="section-sub">No account. No install. Just type a city and go.</p>

          <div className="demo-layout">
            <div className="demo-steps">
              {DEMO_STEPS.map((d, i) => (
                <div
                  key={d.step}
                  className={`demo-step ${demoStep === i ? "active" : ""}`}
                  onClick={() => setDemoStep(i)}
                >
                  <div className="demo-step-num">{d.step}</div>
                  <div className="demo-step-body">
                    <div className="demo-step-title">{d.title}</div>
                    <div className="demo-step-desc">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="demo-screen">
              <div className="demo-screen-bar">
                <div className="dot" style={{ background: "#FF5F57" }} />
                <div className="dot" style={{ background: "#FEBC2E" }} />
                <div className="dot" style={{ background: "#28C840" }} />
                <div className="demo-screen-url">app.mytravelsafety.net</div>
              </div>
              <div className="demo-progress">
                <div className="demo-progress-bar" style={{ width: `${((demoStep + 1) / DEMO_STEPS.length) * 100}%` }} />
              </div>
              <div className="demo-screen-body">
                <div className="demo-visual-emoji">{DEMO_STEPS[demoStep].visual.split("  ")[0]}</div>
                <div className="demo-visual-text">{DEMO_STEPS[demoStep].visual.split("  ")[1]}</div>
                <div style={{ fontSize: 13, color: "#334155", marginTop: 12 }}>{DEMO_STEPS[demoStep].title}</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="section" id="why">
          <div className="section-label">Why MyTravelSafety</div>
          <h2 className="section-title">Built different.</h2>
          <p className="section-sub">What makes us faster, more precise, and more trustworthy than anything else out there.</p>
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
        <section className="section" id="sources">
          <div className="section-label">Trusted data</div>
          <h2 className="section-title">Intelligence backed<br />by real authorities.</h2>
          <p className="section-sub">We don't make up safety data. Every assessment is cross-referenced against 8 authoritative global agencies.</p>
          <div className="sources-grid">
            {SOURCES.map(s => (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="source-card" key={s.name}>
                <div className="source-logo">{s.logo}</div>
                <div className="source-name">{s.name}</div>
                <div className="source-role">{s.role}</div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <div className="cta-glow" />
          <h2 className="cta-h2">Your next trip deserves<br />a safety briefing first.</h2>
          <p className="cta-sub">Free. Instant. No account needed.</p>
          <a href="https://app.mytravelsafety.net" className="btn-primary">Open MyTravelSafety →</a>
          <div className="cta-note">Works on any device · 150+ cities · Updated twice daily</div>
        </div>

        {/* FOOTER */}
        <footer className="footer" id="contact">
          <div className="footer-brand">🛡️ MyTravelSafety</div>
          <div className="footer-links">
            <a href="https://app.mytravelsafety.net">App</a>
            <a href="#services" onClick={e => { e.preventDefault(); scrollTo("services"); }}>Services</a>
            <a href="#sources" onClick={e => { e.preventDefault(); scrollTo("sources"); }}>Sources</a>
            <a href="mailto:travelsafety.noreply@gmail.com">travelsafety.noreply@gmail.com</a>
            <span style={{ color: "#1E293B" }}>© {new Date().getFullYear()} MyTravelSafety</span>
          </div>
        </footer>

      </div>
    </>
  );
}
