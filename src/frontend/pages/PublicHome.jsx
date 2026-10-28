import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Events from '../../components/Events';
import Organizers from '../../components/Organizers';
import Gallery from '../../components/Gallery';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ScrollProgress from '../../components/ScrollProgress';
import ComicSkylineBg from '../../components/ComicSkylineBg';

// ============================================================================
// PUBLIC WEBSITE HOME PAGE (/)
// ============================================================================
// Features top scroll progress bar, glassmorphic navigation header, autoplay video
// background strictly scoped to the Hero section, and moving Spiderverse comic
// skyline background across all non-hero sections.
// Integrated with Lenis for buttery-smooth 60fps inertia scrolling.
// ============================================================================

export default function PublicHome() {
  useEffect(() => {
    // Disable smooth scroll if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-root public-website-root">
      {/* Top Scroll Progress Bar */}
      <ScrollProgress />

      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar />

      {/* Main Page Sections */}
      <main id="main-content">
        <Hero />

        {/* Non-Hero Comic Building Skyline Section Wrapper */}
        <div className="non-hero-comic-wrapper">
          <ComicSkylineBg />

          <div className="non-hero-content-layer">
            <About />
            <Events />
            <Organizers />
            <Gallery />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
