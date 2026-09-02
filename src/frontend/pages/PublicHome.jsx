import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Events from '../../components/Events';
import Organizers from '../../components/Organizers';
import Gallery from '../../components/Gallery';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';

// ============================================================================
// PUBLIC WEBSITE HOME PAGE (/)
// ============================================================================
// This component renders the public Technospark website for general visitors.
// It is completely separated from the /admin dashboard route.
//
// Sections:
// 1. CustomCursor (desktop subtle follower)
// 2. Navbar (public navigation)
// 3. Hero, About, Events, Organizers, Gallery
// 4. Footer
// ============================================================================

export default function PublicHome() {
  return (
    <div className="app-root public-website-root">
      {/* Subtle Desktop Custom Cursor */}
      <CustomCursor />

      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Page Sections */}
      <main id="main-content">
        <Hero />
        <About />
        <Events />
        <Organizers />
        <Gallery />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
