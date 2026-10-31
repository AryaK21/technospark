import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero, { hasSeenHomeIntro } from '../../components/Hero';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import { clubInfo } from '../../data/clubInfo';
import '../../styles/home.css';

// ============================================================================
// PUBLIC WEBSITE HOME PAGE (/)
// ============================================================================
// Exact Sequenced Flow:
// 1. technospark animation: Background video + center 3D title
// 2. blank screen: Video & title dissolve -> clean dark blank pause
// 3. logo and name: Top-left logo + Technospark name slides in
// 4. globe: 3D Celestial Planet with rings & tightly orbiting options emerges
// 5. footer: Dedicated footer section with proper spacing & padding below
// ============================================================================

export default function PublicHome() {
  // If already played this browser session, show logo immediately on mount
  const [showLogo, setShowLogo] = useState(() => hasSeenHomeIntro());

  return (
    <div className="app-root public-home-viewport">
      {/* Custom Desktop Interactive Cursor */}
      <CustomCursor />

      {/* Top-Left Brand Identity (Appears at Step 3: after blank screen, before globe) */}
      {showLogo && (
        <header className="home-top-brand home-top-brand--visible" aria-label="Technospark Home">
          <Link to="/" className="home-brand-anchor" aria-label="Technospark Home">
            <img
              src={clubInfo.logos.whiteTransparent}
              alt="Technospark Logo"
              className="home-brand-logo-img"
            />
            <span className="home-brand-title">{clubInfo.name}</span>
          </Link>
        </header>
      )}

      {/* Main Stage */}
      <main id="main-content" className="home-main-stage">
        <Hero onShowLogo={() => setShowLogo(true)} />
      </main>

      {/* Footer (Preserved with generous breathing room) */}
      <Footer />
    </div>
  );
}
