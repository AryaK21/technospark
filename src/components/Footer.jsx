import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { clubInfo } from '../data/clubInfo';
import { InstagramIcon, LinkedInIcon } from './SocialIcons';
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
              <Link to="/team" className="footer-link">Team</Link>
              <Link to="/gallery" className="footer-link">Gallery</Link>
              <Link to="/contact" className="footer-link">Contact & Inquiries</Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <div className="footer-col-title">CONNECT</div>
            <div className="footer-social-row" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a
                href="#"
                className="footer-social-btn"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="#"
                className="footer-social-btn"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href="#"
                className="footer-social-btn"
                aria-label="Email"
                title="Email"
              >
                <Mail size={18} />
              </a>
            </div>
            <div style={{ marginTop: '18px' }}>
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
