import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Organizers from '../../components/Organizers';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ScrollProgress from '../../components/ScrollProgress';
import ComicSkylineBg from '../../components/ComicSkylineBg';
import '../../styles/team.css';

// ============================================================================
// DEDICATED TEAM & ORGANIZERS PAGE (/team & /organizers)
// ============================================================================
// Features:
// 1. Interactive Custom Spider-Verse Cursor & Top Scroll Progress Bar
// 2. Fixed Comic Hard-Inked Navbar with Active Page Pill
// 3. Spider-Verse Twilight Sky Gradient + Parallax Skyline Silhouette Background
// 4. Structured Multi-Tier Command Matrix (Faculty Leadership & Division Trees)
// 5. Spider-Verse Collector Edition Member Trading Cards & Division Tabs
// 6. Responsive Footer with Quick Navigation & Social Nodes
// ============================================================================

export default function TeamPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-root public-website-root">
      {/* Top Scroll Indicator & Spider-Verse Cursor */}
      <ScrollProgress />
      <CustomCursor />

      {/* Main Comic Navigation Header */}
      <Navbar />

      {/* Main Comic Stage */}
      <main id="main-content" style={{ paddingTop: 0 }}>
        <div className="non-hero-comic-wrapper" style={{ minHeight: '85vh' }}>
          {/* Parallax Skyline Silhouette Background */}
          <ComicSkylineBg />

          {/* Foreground Structured Team & Organizers Hierarchy */}
          <div className="non-hero-content-layer">
            <Organizers />
          </div>
        </div>
      </main>

      {/* Comic Footer */}
      <Footer />
    </div>
  );
}

export { TeamPage };
