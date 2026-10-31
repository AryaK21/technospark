import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { clubInfo } from '../data/clubInfo';
import '../styles/navbar.css';

// ============================================================================
// NAVBAR COMPONENT (Spiderverse Comic Badges & Modern Glassmorphism)
// ============================================================================
// Translucent sticky navbar with subtle backdrop blur, official Technospark logo
// on the left, and separate page navigation badges:
// HOME (/) | ABOUT (/about) | EVENTS (/events) | TEAM (/team) | GALLERY (/gallery) | CONTACT (/contact)
// ============================================================================

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'EVENTS', path: '/events' },
    { label: 'TEAM', path: '/team' },
    { label: 'GALLERY', path: '/gallery' },
    { label: 'CONTACT', path: '/contact' }
  ];

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if a nav item is currently active
  const isItemActive = (itemPath) => {
    if (itemPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(itemPath) || (itemPath === '/team' && location.pathname === '/organizers');
  };

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
        <Link to="/" className="navbar-brand" aria-label="Technospark Home">
          <img
            src={clubInfo.logos.whiteTransparent}
            alt="Technospark Logo"
            className="navbar-logo-img"
          />
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">TECHNOSPARK</span>
          </div>
        </Link>

        {/* Center / Right Comic Badge Nav Items */}
        <nav className="navbar-nav comic-nav-list" aria-label="Main Navigation">
          {navItems.map((item, index) => {
            const isActive = isItemActive(item.path);

            return (
              <React.Fragment key={item.label}>
                {index > 0 && <span className="comic-nav-connector">---</span>}
                <Link
                  to={item.path}
                  className={`comic-nav-badge ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
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
        {navItems.map((item) => {
          const isActive = isItemActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`comic-nav-badge ${isActive ? 'active' : ''}`}
              style={{ fontSize: '1rem', padding: '10px 20px', textAlign: 'center' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
