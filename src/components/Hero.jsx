import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { clubInfo } from '../data/clubInfo';

// ============================================================================
// HERO COMPONENT
// ============================================================================
// Main landing section introducing Technospark and ITSA.
//
// Animations Local to this Component:
// 1. HERO ENTRANCE ANIMATION: Staggered sequence for logo, badge, title, desc, CTAs.
// 2. HERO MOUSE GLOW: Smooth radial light following the cursor ONLY within the Hero.
// 3. SUBTLE AMBIENT MOVEMENT: Gentle drift on the decorative logo rings.
// ============================================================================

export default function Hero() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const headingLine1Ref = useRef(null);
  const headingLine2Ref = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const metaRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const glowRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  // ==========================================================================
  // HERO ENTRANCE ANIMATION
  // Runs once on page load to reveal the hero elements in a cinematic sequence.
  // ==========================================================================
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // If user prefers reduced motion, display everything immediately without delay
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Logo appears with gentle scale and fade
      tl.fromTo(
        logoWrapperRef.current,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' }
      )
        // 2. Club affiliation badge slides down
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.6'
        )
        // 3. Heading line 1 reveal
        .fromTo(
          headingLine1Ref.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        // 4. Heading line 2 (accent) reveal
        .fromTo(
          headingLine2Ref.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.45'
        )
        // 5. Supporting narrative
        .fromTo(
          descriptionRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55 },
          '-=0.35'
        )
        // 6. Action buttons
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        // 7. Location metadata tag
        .fromTo(
          metaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.2'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // ==========================================================================
  // HERO CURSOR-FOLLOWING LIGHT GLOW
  // Tracks mouse movements only when cursor is inside the Hero boundary.
  // ==========================================================================
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-section"
      aria-label="Technospark Hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Cursor Glow (Scoped strictly to Hero) */}
      <div
        ref={glowRef}
        className="hero-cursor-glow"
        style={{
          transform: `translate3d(${mousePos.x - 225}px, ${mousePos.y - 225}px, 0)`,
          opacity: mousePos.opacity
        }}
        aria-hidden="true"
      />

      {/* Ambient background light & subtle technical grid */}
      <div className="hero-bg-glow" aria-hidden="true" />
      <div className="hero-grid-pattern" aria-hidden="true" />

      <div className="hero-container">

        {/* Left Column: Typography & CTAs */}
        <div className="hero-content">


          {/* Main Heading with 2 distinct lines */}
          <h1 className="hero-title">
            <span ref={headingLine1Ref} className="hero-title-line">
              WHERE IDEAS
            </span>
            <br />
            <span ref={headingLine2Ref} className="hero-title-line hero-title-accent">
              MEET TECHNOLOGY.
            </span>
          </h1>

          {/* Supporting Narrative */}
          <p ref={descriptionRef} className="hero-description">
            {clubInfo.shortDescription}
          </p>

          {/* Action Buttons */}
          <div ref={buttonsRef} className="hero-actions">
            <a href="#events" className="btn btn-primary">
              <span>EXPLORE EVENTS</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          {/* Location / College Tag */}
          <div ref={metaRef} className="hero-meta">
            <span className="hero-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Pimpri Chinchwad College of Engineering And Research , Ravet Pune
            </span>
          </div>
        </div>

        {/* Right Column: Official Technospark Logo Presentation */}
        <div className="hero-visual">
          <div ref={logoWrapperRef} className="hero-logo-wrapper">
            {/* Subtle decorative concentric rings */}
            <div className="hero-ring hero-ring-outer" aria-hidden="true" />
            <div className="hero-ring hero-ring-inner" aria-hidden="true" />

            {/* Main Official Technospark Logo Emblem */}
            <img
              src={clubInfo.logos.blueTransparent}
              alt="Technospark Official Emblem"
              className="hero-logo-img"
              loading="eager"
            />

          </div>
        </div>

      </div>
    </section>
  );
}
