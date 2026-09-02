import React, { useState, useEffect } from 'react';
import { clubInfo } from '../data/clubInfo';



// ============================================================================
// NAVBAR COMPONENT
// ============================================================================
// Desktop: Technospark Logo, Home, About, Events links.
// Mobile: Clean hamburger button with animated mobile drawer.
//
// Behavior:
// - At top: Subtly translucent.
// - Scrolled down (> 20px): Darker navy background with backdrop-filter blur.
// ============================================================================

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Handle scroll detection to toggle navbar background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      // Track active section for navigation highlight
      const sections = ['hero', 'about', 'events', 'organizers', 'gallery'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Brand Logo & Name */}
        <a href="#hero" className="navbar-brand" aria-label="Technospark Home">
          <img
            src={clubInfo.logos.whiteTransparent}
            alt="Technospark Logo"
            className="navbar-logo-img"
          />
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">TECHNOSPARK</span>
            <span className="navbar-brand-subtitle">ITSA Technical Club</span>
          </div>
        </a>

        {/* Desktop Navigation Links (Home, About, Events) */}
        <nav className="navbar-desktop-nav" aria-label="Main Navigation">
          {clubInfo.navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`navbar-nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
                {isActive && <span className="active-dot" aria-hidden="true" />}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`navbar-hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`navbar-mobile-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-content">
          <nav className="mobile-drawer-links" aria-label="Mobile Navigation">
            {clubInfo.navLinks.map((link, idx) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`mobile-drawer-link ${isActive ? 'active' : ''}`}
                  style={{ animationDelay: `${(idx + 1) * 0.08}s` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile Footer Info */}
          <div className="mobile-drawer-footer">
            <p className="mobile-drawer-affiliation">
              Information Technology Students Association
            </p>
            <p className="mobile-drawer-college">PCCOE, Pune</p>
          </div>
        </div>
      </div>
    </header>
  );


}
