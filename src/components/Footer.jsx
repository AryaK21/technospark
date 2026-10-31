import React from 'react';
import { Link } from 'react-router-dom';
import { clubInfo } from '../data/clubInfo';
import '../styles/footer.css';

// ============================================================================
// FOOTER COMPONENT
// ============================================================================
// High-tech footer section with branding, separate page links, and social channels.
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

          {/* Navigation Links to Separate Pages */}
          <div>
            <div className="footer-col-title">NAVIGATION</div>
            <div className="footer-links-list">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/events" className="footer-link">Events Timeline</Link>
              <Link to="/team" className="footer-link">Team Hierarchy</Link>
              <Link to="/gallery" className="footer-link">3D Gallery</Link>
              <Link to="/contact" className="footer-link">Contact & Inquiries</Link>
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
            <div style={{ marginTop: '16px' }}>
              <Link to="/admin" className="footer-link" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                🔒 Admin CMS Console
              </Link>
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
