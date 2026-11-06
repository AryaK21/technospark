import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Globe, Send, CheckCircle, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { InstagramIcon, LinkedInIcon } from '../../components/SocialIcons';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ScrollProgress from '../../components/ScrollProgress';
import ComicSkylineBg from '../../components/ComicSkylineBg';
import { clubInfo } from '../../data/clubInfo';
import { submitContactQuery } from '../../services/queriesService';
import '../../styles/contact.css';

// ============================================================================
// DEDICATED CONTACT & INQUIRIES PAGE (/contact)
// ============================================================================
// Styled in Technospark Cyber Neon & Neo-Brutalist Theme:
// - Campus coordinates and institutional information
// - Interactive message inquiry form connected to Supabase public.queries
// - Direct coordinator email and links
// ============================================================================

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errs.message = 'Message cannot be empty';
    } else if (formData.message.length < 10) {
      errs.message = 'Please provide at least 10 characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const { success, error, isRlsError } = await submitContactQuery({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (!success && error) {
        console.error('[ContactPage] Failed to save query to Supabase:', error);
        setSubmissionError(
          isRlsError
            ? 'Supabase Row Level Security is blocking inserts. Please run: ALTER TABLE public.queries DISABLE ROW LEVEL SECURITY; in your Supabase SQL editor.'
            : (error.message || 'Transmission failed. Please check your network connection or try again.')
        );
        return;
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('[ContactPage] Unexpected error submitting query:', err);
      setSubmissionError('An unexpected transmission error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="app-root public-website-root">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />

      <main id="main-content" style={{ paddingTop: '2rem' }}>
        <div className="non-hero-comic-wrapper" style={{ minHeight: '85vh', paddingBottom: '60px' }}>
          <ComicSkylineBg />

          <div className="non-hero-content-layer">
            <div className="about-container">

              {/* ── Page Header ─────────────────────────────────────────── */}
              <div className="about-header-centered">
                <span className="section-eyebrow">[ COMMUNICATION CHANNEL ]</span>
                <h1 className="section-title">
                  CONNECT WITH <br />
                  <span className="text-highlight">TECHNOSPARK</span>
                </h1>
                <p className="events-subtitle" style={{ maxWidth: '640px', margin: '0 auto' }}>
                  Reach out for hackathon sponsorships, workshop collaborations, student tech inquiries, or inter-collegiate partnerships.
                </p>
              </div>

              {/* ── 2-Column Grid: Campus Info & Interactive Form ───────── */}
              <div className="contact-grid-container">

                {/* Left Card: Verified Coordinates */}
                <div className="contact-info-card spiderverse-card">
                  <h3 className="contact-card-title font-heading">
                    CAMPUS COORDINATES
                  </h3>
                  <p className="contact-card-desc">
                    TechnoSpark operates within the Department of Information Technology at PCCOER, Pune. Students and industry guests are welcome to connect.
                  </p>

                  <div className="contact-items-list">
                    {/* Email */}
                    <div className="contact-item-row">
                      <div className="contact-icon-box" style={{ color: 'black' }}>
                        <Mail size={18} />
                      </div>
                      <div>
                        <div className="contact-item-label font-mono">DIRECT INQUIRIES</div>
                        <a
                          href="mailto:technospark.pccoer.it@gmail.com"
                          className="contact-item-value"
                        >
                          technospark.pccoer.it@gmail.com
                        </a>
                      </div>
                    </div>

                    {/* Institution Address */}
                    <div className="contact-item-row">
                      <div className="contact-icon-box" style={{ color: 'black' }}>
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="contact-item-label font-mono">INSTITUTION ADDRESS</div>
                        <div className="contact-item-value">
                          {clubInfo.institution}
                          <br />
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Plot No. B, Sector no. 110, Gate No.1, Laxminagar, Ravet, Pune 412101
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* College Portal */}
                    <div className="contact-item-row">
                      <div className="contact-icon-box" style={{ color: 'black' }}>
                        <Globe size={18} />
                      </div>
                      <div>
                        <div className="contact-item-label font-mono">COLLEGE WEB PORTAL</div>
                        <a
                          href="https://pccoer.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-item-value"
                          style={{ color: 'var(--neon-blue)', textDecorationColor: 'none' }}
                        >
                          pccoer.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="contact-socials-wrapper">
                    <div className="contact-item-label font-mono" style={{ marginBottom: '10px' }}>
                      OFFICIAL SOCIAL CHANNELS
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <a
                        href="https://www.instagram.com/technospark.pccoer/"
                        className="contact-social-btn"
                        aria-label="Instagram"
                        title="Instagram"
                      >
                        <InstagramIcon size={16} />
                        <span>Instagram</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/company/technospark-pccoe-r/"
                        className="contact-social-btn"
                        aria-label="LinkedIn"
                        title="LinkedIn"
                      >
                        <LinkedInIcon size={16} />
                        <span>LinkedIn</span>
                      </a>
                      <a
                        href="mailto:technospark.pccoer.it@gmail.com"
                        className="contact-social-btn"
                        aria-label="Email"
                        title="Email"
                      >
                        <Mail size={16} />
                        <span>Mail</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Card: Message Form */}
                <div className="contact-form-card spiderverse-card">
                  <h3 className="contact-card-title font-heading">
                    TRANSMIT A MESSAGE
                  </h3>
                  <p className="contact-card-desc">
                    Send an inquiry directly to the student leadership council.
                  </p>

                  {isSubmitted ? (
                    <div className="contact-success-box">
                      <CheckCircle size={40} color="#00F0FF" />
                      <h4 className="font-heading" style={{ fontSize: '1.2rem', color: '#FFFFFF', marginTop: '12px' }}>
                        TRANSMISSION RECEIVED
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
                        Thank you for reaching out. The Technospark coordinating team will review your message and reply via email shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="contact-submit-btn contact-submit-btn--primary"
                        style={{ marginTop: '20px' }}
                      >
                        Transmit Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="contact-form-inner">
                      {/* Name */}
                      <div className="contact-field-group">
                        <label className="contact-label font-mono" htmlFor="contact-name">
                          YOUR FULL NAME *
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Alex Morgan"
                          className={`contact-input ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && <span className="contact-error-text font-mono">{errors.name}</span>}
                      </div>

                      {/* Email */}
                      <div className="contact-field-group">
                        <label className="contact-label font-mono" htmlFor="contact-email">
                          EMAIL ADDRESS *
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="alex@domain.com"
                          className={`contact-input ${errors.email ? 'input-error' : ''}`}
                        />
                        {errors.email && <span className="contact-error-text font-mono">{errors.email}</span>}
                      </div>

                      {/* Subject */}
                      <div className="contact-field-group">
                        <label className="contact-label font-mono" htmlFor="contact-subject">
                          SUBJECT OR DOMAIN *
                        </label>
                        <input
                          id="contact-subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g. Hackathon Sponsorship / Collaboration"
                          className={`contact-input ${errors.subject ? 'input-error' : ''}`}
                        />
                        {errors.subject && <span className="contact-error-text font-mono">{errors.subject}</span>}
                      </div>

                      {/* Message */}
                      <div className="contact-field-group">
                        <label className="contact-label font-mono" htmlFor="contact-message">
                          MESSAGE INQUIRY *
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Provide details on your project, event inquiry, or partnership..."
                          className={`contact-input ${errors.message ? 'input-error' : ''}`}
                        />
                        {errors.message && <span className="contact-error-text font-mono">{errors.message}</span>}
                      </div>

                      {/* Transmission Error Alert */}
                      {submissionError && (
                        <div
                          style={{
                            padding: '12px 14px',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            border: '1.5px solid #EF4444',
                            borderRadius: '4px',
                            color: '#FCA5A5',
                            fontSize: '0.84rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '16px',
                            lineHeight: 1.4
                          }}
                        >
                          <AlertCircle size={17} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>{submissionError}</div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="contact-submit-btn contact-submit-btn--primary"
                        style={{
                          width: '100%',
                          marginTop: '8px'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="admin-spinner" />
                            <span>TRANSMITTING INQUIRY...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>TRANSMIT INQUIRY</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

