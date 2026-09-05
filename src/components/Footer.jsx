import React from 'react';
import { clubInfo } from '../data/clubInfo';

// ============================================================================
// FOOTER COMPONENT
// ============================================================================
// High-tech footer section with branding, quick links, and social media.
// ============================================================================

export default function Footer() {
  return (
    <footer className="footer-section" aria-label="Page Footer">
      <div className="footer-container">

        <div className="footer-top-grid">

          {/* Brand Info */}
          <div>
            <div className="footer-brand-title">TECHNOSPARK</div>
            <p className="footer-brand-desc">
              The official technical club of Information Technology Students Association (ITSA) at PCCOER. Building the future through software, hackathons, and engineering excellence.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <div className="footer-col-title">NAVIGATION</div>
            <div className="footer-links-list">
              <a href="#hero" className="footer-link">Home</a>
              <a href="#about" className="footer-link">About</a>
              <a href="#events" className="footer-link">Events</a>
              <a href="#organizers" className="footer-link">Organizers</a>
              <a href="#gallery" className="footer-link">Gallery</a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <div className="footer-col-title">CONNECT</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {clubInfo.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="organizer-social-btn"
                  aria-label={social.name}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{social.name[0]}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>© {clubInfo.currentYear} TECHNOSPARK — ITSA Technical Club.</div>
          <div>PCCOER Department of Information Technology</div>
        </div>

      </div>
    </footer>
  );
}
