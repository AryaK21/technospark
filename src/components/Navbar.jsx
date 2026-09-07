import React, { useState, useEffect } from 'react';
import { clubInfo } from '../data/clubInfo';

// ============================================================================
// NAVBAR COMPONENT (Modern Subtle Glassmorphism)
// ============================================================================
// Translucent sticky navbar with subtle backdrop blur, official Technospark logo
// on the left, and smooth section navigation links.
// ============================================================================

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'HOME', href: '#hero' },
    { label: 'ABOUT', href: '#about' },
    { label: 'EVENTS', href: '#events' },
    { label: 'TEAM', href: '#organizers' },
    { label: 'GALLERY', href: '#gallery' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'events', 'organizers', 'gallery'];
      const scrollPos = window.scrollY + 180;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-header modern-glass comic-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      {/* Top Left Spiderweb Corner Accent */}
      <div className="navbar-spiderweb-corner">
        <svg viewBox="0 0 100 100" width="45" height="45" fill="none" stroke="rgba(0, 240, 255, 0.7)">
          <path d="M0,0 L100,100 M0,0 L100,40 M0,0 L40,100 M0,0 L100,0 M0,0 L0,100" strokeWidth="1" />
          <path d="M20,0 Q20,20 0,20 M40,0 Q40,40 0,40 M70,0 Q70,70 0,70" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      <div className="navbar-container">

        {/* Left Brand Identity: Logo + Title */}
        <a href="#hero" className="navbar-brand" aria-label="Technospark Home">
          <img
            src={clubInfo.logos.whiteTransparent}
            alt="Technospark Logo"
            className="navbar-logo-img"
          />
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">TECHNOSPARK</span>
          </div>
        </a>

        {/* Center / Right Comic Badge Nav Items */}
        <nav className="navbar-nav comic-nav-list" aria-label="Main Navigation">
          {navItems.map((item, index) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <React.Fragment key={item.label}>
                {index > 0 && <span className="comic-nav-connector">---</span>}
                <a
                  href={item.href}
                  className={`comic-nav-badge ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="comic-nav-badge"
            style={{ fontSize: '1rem', padding: '10px 20px', textAlignment: 'center' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
