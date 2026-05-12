// pages/index.js — MyTravelSafety public landing page
// Deployed at: https://mytravelsafety.net
// App lives at: https://app.mytravelsafety.net
// SSR via Next.js — fully indexable by Google

import Head from "next/head";
import styles from "../styles/Home.module.css";

const FEATURES = [
  { icon: "🛡️", title: "Real-Time Safety Scores",    desc: "AI-powered risk analysis for 150+ cities. Updated twice daily with fresh intelligence." },
  { icon: "🗺️", title: "Interactive Risk Map",        desc: "Visual 3D globe showing safety levels worldwide. Spot danger zones before you book." },
  { icon: "🚨", title: "Scam Alerts",                 desc: "City-specific scam database. Know the tactics locals use before you land." },
  { icon: "📡", title: "Live Global Alerts",          desc: "Real-time feeds from USGS, WHO, GDACS, and government travel advisories." },
  { icon: "👥", title: "Community Reports",           desc: "Traveler-submitted safety incidents. Real experiences from people on the ground." },
  { icon: "🔗", title: "Shareable Reports",           desc: "Share safety briefings with travel companions instantly via link or native share." },
];

const STATS = [
  { value: "150+", label: "Cities covered" },
  { value: "2×",   label: "Daily updates"  },
  { value: "$0",   label: "Always free"    },
  { value: "33",   label: "Scam types tracked" },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>MyTravelSafety — Real-Time Travel Safety Intelligence</title>
        <meta name="description" content="Real-time travel safety scores, scam alerts, risk maps, and live advisories for 150+ cities worldwide. Know before you go. Always free." />
        <meta name="keywords" content="travel safety, scam alerts, travel risk, city safety score, is it safe to travel, travel advisory, tourist scams, travel security" />
        <link rel="canonical" href="https://mytravelsafety.net" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://mytravelsafety.net" />
        <meta property="og:title"       content="MyTravelSafety — Real-Time Travel Safety Intelligence" />
        <meta property="og:description" content="Real-time scam alerts, risk maps, and safety scores for 150+ cities. Know before you go." />
        <meta property="og:image"       content="https://mytravelsafety.net/og-image.png" />
        <meta property="og:site_name"   content="MyTravelSafety" />

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="MyTravelSafety — Real-Time Travel Safety Intelligence" />
        <meta name="twitter:description" content="Real-time scam alerts, risk maps, and safety scores for 150+ cities." />
        <meta name="twitter:image"       content="https://mytravelsafety.net/og-image.png" />

        {/* PWA */}
        <meta name="theme-color"                    content="#2E86DE" />
        <meta name="mobile-web-app-capable"         content="yes" />
        <meta name="apple-mobile-web-app-capable"   content="yes" />
        <meta name="apple-mobile-web-app-title"     content="MyTravelSafety" />
        <link rel="icon" href="/favicon.svg" />

        {/* Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "MyTravelSafety",
          "url": "https://app.mytravelsafety.net",
          "description": "Real-time travel safety scores, scam alerts, risk maps, and live advisories for 150+ cities worldwide.",
          "applicationCategory": "TravelApplication",
          "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        })}} />
      </Head>

      <div className={styles.wrap}>

        {/* NAV */}
        <nav className={styles.nav}>
          <div className={styles.navBrand}>🛡️ MyTravelSafety</div>
          <a href="https://app.mytravelsafety.net" className={styles.navCta}>
            Open App →
          </a>
        </nav>

        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>🌍 150+ Cities · Updated 2× Daily · Always Free</div>
          <h1 className={styles.heroH1}>
            Know If It's Safe<br />Before You Go
          </h1>
          <p className={styles.heroSub}>
            Real-time travel safety scores, scam alerts, risk maps, and live advisories
            for destinations worldwide. Powered by AI. Trusted by travelers.
          </p>
          <div className={styles.heroActions}>
            <a href="https://app.mytravelsafety.net" className={styles.btnPrimary}>
              Check Any City Free →
            </a>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.stats}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Everything a traveler needs to stay safe</h2>
          <div className={styles.featureGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.ctaBanner}>
          <h2>Ready to travel smarter?</h2>
          <p>Free. No sign-up. Works on any device.</p>
          <a href="https://app.mytravelsafety.net" className={styles.btnPrimary}>
            Open MyTravelSafety →
          </a>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div>© {new Date().getFullYear()} MyTravelSafety · <a href="https://mytravelsafety.net">mytravelsafety.net</a></div>
          <div className={styles.footerLinks}>
            <a href="https://app.mytravelsafety.net">App</a>
            <a href="mailto:contact@mytravelsafety.net">Contact</a>
          </div>
        </footer>

      </div>
    </>
  );
}
