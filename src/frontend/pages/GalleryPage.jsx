import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Gallery from '../../components/Gallery';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ScrollProgress from '../../components/ScrollProgress';
import ComicSkylineBg from '../../components/ComicSkylineBg';
import '../../styles/gallery.css';

// ============================================================================
// DEDICATED GALLERY PAGE (/gallery)
// ============================================================================
// Features:
// 1. Interactive Custom Spider-Verse Cursor & Top Scroll Progress Bar
// 2. Fixed Comic Hard-Inked Navbar with Active Page Pill
// 3. Spider-Verse Twilight Sky Gradient + Parallax Skyline Silhouette Background
// 4. Compact Infinite 2D Pan/Zoom Canvas with Tightly Coupled Frames
// 5. Fullscreen Lightbox Modal with Keyboard Navigation
// 6. Responsive Footer with Quick Navigation & Social Nodes
// ============================================================================

export default function GalleryPage() {
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

          {/* Foreground Infinite Drag Canvas & Archive Gallery */}
          <div className="non-hero-content-layer">
            <Gallery />
          </div>
        </div>
      </main>

      {/* Comic Footer */}
      <Footer />
    </div>
  );
}

export { GalleryPage };
