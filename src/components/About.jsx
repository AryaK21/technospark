import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { clubInfo } from '../data/clubInfo';

// ============================================================================
// ABOUT COMPONENT (Clean High-Impact Layout)
// ============================================================================

export default function About() {
  const sectionRef = useRef(null);
  const titleColRef = useRef(null);
  const introColRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.7 } });

            tl.fromTo(
              titleColRef.current,
              { opacity: 0, y: 35, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)' }
            )
              .fromTo(
                introColRef.current,
                { opacity: 0, y: 30, filter: 'blur(4px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)' },
                '-=0.45'
              )
              .fromTo(
                quoteRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.2'
              );

            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
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

        {/* Section Header Grid */}
        <div className="about-header-grid">
          <div ref={titleColRef} className="about-title-col">
            <span className="section-eyebrow">[ // 01. MISSION MATRIX ]</span>
            <h2 className="section-title">
              <span className="glitch-title" data-text="THE TECH PULSE">THE TECH PULSE</span> <br />
              <span className="text-highlight">OF ITSA PCCOER</span>
            </h2>
            <div className="about-badge-pill">
              <span>🏛️</span>
              <span>INFORMATION TECHNOLOGY STUDENTS ASSOCIATION</span>
            </div>
          </div>

          <div ref={introColRef} className="about-intro-col">
            <p className="about-lead-text">
              Technospark is the premier student engineering epicenter of the Information Technology Department at PCCOER. We cultivate software architects, hackathon champions, and open-source innovators.
            </p>
            <p className="about-body-text">
              From competitive coding marathons to AI masterclasses and full-stack software sprints, Technospark bridges academic theory with industry-grade software craftsmanship.
            </p>
          </div>
        </div>

        {/* Core Team Quote Callout */}
        <div ref={quoteRef} className="about-quote-box spiderverse-quote">
          <div className="quote-text">
            "ENGINEERING MASTERY ISN'T TAUGHT IN PASSIVE LECTURES... <span className="comic-red-highlight">IT'S FORGED BY SHIPPING CODE, BREAKING BOUNDARIES, AND SCALING TOGETHER.</span>"
          </div>
          <div className="quote-author">
            — TECHNOSPARK CORE LEADERSHIP, ITSA
          </div>
        </div>

      </div>
    </section>
  );
}
