import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Organizers from './components/Organizers';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

// ============================================================================
// APP COMPONENT
// ============================================================================
// Root React component assembling the final Technospark website structure:
// 1. Desktop Custom Cursor (auto-disabled on mobile/touch)
// 2. Sticky Navbar
// 3. Hero Section (cinematic entrance + scoped cursor glow)
// 4. About Section (staggered scroll reveal)
// 5. Events Section (filterable cards + detail modal)
// 6. Organizers Section (leadership profiles with subtle hover)
// 7. Gallery Section (asymmetric event showcase + lightbox)
// 8. Footer (brand details + social icons)
// ============================================================================

export default function App() {
  return (
    <div className="app-root">
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
