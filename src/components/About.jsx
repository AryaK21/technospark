import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { clubInfo } from '../data/clubInfo';

// ============================================================================
// ABOUT COMPONENT
// ============================================================================
// Narrative and pillars of Technospark ITSA.
//
// Animations Local to this Component:
// - ABOUT SCROLL REVEAL: Runs when the About section scrolls into viewport.
//   Staggers the title, description paragraph, and the 3 pillar cards with
//   a smooth blur-to-focus and gentle upward glide.
// ============================================================================

export default function About() {
  const sectionRef = useRef(null);
  const titleColRef = useRef(null);
  const introColRef = useRef(null);
  const pillarsRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // GSAP Reveal Animation Sequence
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.7 } });

            tl.fromTo(
              titleColRef.current,
              { opacity: 0, y: 35, filter: 'blur(4px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)' }
            )
              .fromTo(
                introColRef.current,
                { opacity: 0, y: 30, filter: 'blur(3px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)' },
                '-=0.45'
              )
              .fromTo(
                pillarsRef.current?.children || [],
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 },
                '-=0.3'
              )
              .fromTo(
                quoteRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.2'
              );

            observer.disconnect(); // Trigger only once
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section"
      aria-label="About Technospark"
    >
      <div className="about-container">

        {/* Header Grid: Eyebrow + Title + Intro Paragraphs */}
        <div className="about-header-grid">
          <div ref={titleColRef} className="about-title-col">
            <h2 className="section-title">
              ABOUT <br />
              <span className="text-highlight">TECHNOSPARK</span>
            </h2>
            <div className="about-badge-pill">
              <span className="about-badge-icon">🏛️</span>
              <span>Information Technology Students Association (ITSA)</span>
            </div>
          </div>

          <div ref={introColRef} className="about-intro-col">
            <p className="about-lead-text">
              Technospark is the premier student-run technical organization of the Information Technology Department at PCCOE. We unite engineering students with a shared passion for software development, cutting-edge technology, and creative problem solving.
            </p>
            <p className="about-body-text">
              Rather than theoretical instruction, our focus is active collaboration. From beginner-friendly coding bootcamps to high-stakes 36-hour hackathons, Technospark empowers every student to turn theoretical knowledge into tangible, real-world projects.
            </p>
          </div>
        </div>

        {/* Bottom Callout Quote */}
        <div ref={quoteRef} className="about-quote-box">
          <div className="quote-text">
            "We believe true technical mastery comes from building together, breaking things, and collaborating across disciplines."
          </div>
          <div className="quote-author">
            — Technospark Core Team, ITSA
          </div>
        </div>

      </div>
    </section>
  );
}
