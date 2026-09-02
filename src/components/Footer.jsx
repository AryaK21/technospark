import React from 'react';
import { clubInfo } from '../data/clubInfo';

// ============================================================================
// FOOTER COMPONENT
// ============================================================================
// Clean, professional club footer containing:
// - Official Technospark Logo
// - Club and Department Affiliation
// - Navigation Links
// - Recognizable Social Media Icon Links (Instagram, LinkedIn, GitHub, Email)
// - Copyright Notice
// ============================================================================

export default function Footer() {
  return (
    <footer className="footer-section" aria-label="Page Footer">
      <div className="footer-container">
        
        {/* Main Footer Row */}
        <div className="footer-main-grid">
          
          {/* Brand Col */}
          <div className="footer-brand-col">
            <a href="#hero" className="footer-logo-link" aria-label="Return to top">
              <img
                src={clubInfo.logos.whiteTransparent}
                alt="Technospark Logo"
                className="footer-logo-img"
              />
              <div className="footer-brand-title-wrap">
                <span className="footer-brand-title">TECHNOSPARK</span>
                <span className="footer-brand-subtitle">ITSA TECHNICAL CLUB</span>
              </div>
            </a>
            <p className="footer-description">
              The official technical club of Information Technology Students Association (ITSA) at PCCOE. Empowering student innovators through peer learning, workshops, and hackathons.
            </p>
          </div>

          {/* Navigation Links Col */}
          <div className="footer-nav-col">
            <h4 className="footer-col-heading">NAVIGATION</h4>
            <ul className="footer-link-list">
              {clubInfo.navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons Col */}
          <div className="footer-social-col">
            <h4 className="footer-col-heading">CONNECT WITH US</h4>
            <div className="footer-social-icons-row" role="list" aria-label="Social Media Links">
              
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="Visit Technospark on Instagram"
                title="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="Visit Technospark on LinkedIn"
                title="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="Visit Technospark on GitHub"
                title="GitHub"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:technospark@pccoepune.org"
                className="social-icon-btn"
                aria-label="Send email to Technospark"
                title="Email us"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {clubInfo.currentYear} Technospark – ITSA Technical Club. All rights reserved.
          </p>
          <p className="footer-subtext">
            Department of Information Technology • PCCOE Pune
          </p>
        </div>

      </div>
    </footer>
  );
}
