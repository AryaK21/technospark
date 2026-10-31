import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BookOpen, Cpu, Users, Sparkles, ShieldCheck, Rocket, Award } from 'lucide-react';
import { clubInfo } from '../data/clubInfo';
import '../styles/about.css';

// ============================================================================
// ABOUT COMPONENT (Migrated Structure in Technospark Cyber Neon Theme)
// ============================================================================
// Features:
// 1. Genesis & Mission Matrix narrative.
// 2. 4 Engineering Pillars (Learn, Build, Collaborate, Innovate) with 3D tilt.
// 3. Institutional Affiliation Matrix with ITSA PCCOER accreditation details.
// 4. Spiderverse Core Leadership Quote callout.
// 5. GSAP entrance reveal animation on scroll.
// ============================================================================

export default function About() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const narrativeRef = useRef(null);
  const pillarsRef = useRef(null);
  const bannerRef = useRef(null);
  const quoteRef = useRef(null);

  const iconMap = {
    BookOpen,
    Cpu,
    Users,
    Sparkles
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.7 } });

            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 35, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)' }
            )
              .fromTo(
                narrativeRef.current,
                { opacity: 0, y: 30, filter: 'blur(4px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)' },
                '-=0.4'
              )
              .fromTo(
                pillarsRef.current?.children || [],
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
                '-=0.3'
              )
              .fromTo(
                bannerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.2'
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
      { threshold: 0.12 }
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

        {/* ── 1. Section Header ────────────────────────────────────────────── */}
        <div ref={headerRef} className="about-header-centered">
          <span className="section-eyebrow">[  MISSION MATRIX ]</span>
          <h2 className="section-title">
            <span className="glitch-title" data-text="THE TECH PULSE">THE TECH PULSE</span> <br />
            <span className="text-highlight">OF ITSA PCCOER</span>
          </h2>
          <div className="about-badge-pill">
            <span>🏛️</span>
            <span>INFORMATION TECHNOLOGY STUDENTS ASSOCIATION • PCCOER</span>
          </div>
          <p className="about-motto-text">
            {clubInfo.motto || 'WHERE IDEAS MEET TECHNOLOGY.'}
          </p>
        </div>

        {/* ── 2. Genesis & Mission Narrative Box ───────────────────────────── */}
        <div ref={narrativeRef} className="about-narrative-box spiderverse-card">
          <h3 className="about-box-title font-heading">
            OUR GENESIS & MISSION
          </h3>
          <p className="about-lead-text">
            {clubInfo.aboutDescription}
          </p>
          <p className="about-body-text">
            Operating under the auspices of the Department of Information Technology at Pimpri Chinchwad College of Engineering and Research, Technospark serves as an incubator for technological curiosity. We believe that true engineering excellence is forged by shipping real code, deploying live distributed systems, and solving complex problems collaboratively.
          </p>
        </div>

        {/* ── 3. Four Core Engineering Pillars ─────────────────────────────── */}


        {/* ── 4. Institutional Affiliation Matrix Banner ──────────────────── */}


        {/* ── 5. Core Team Quote Callout ──────────────────────────────────── */}
        <div ref={quoteRef} className="about-quote-box spiderverse-quote">
          <div className="quote-text">
            "ENGINEERING MASTERY ISN'T TAUGHT IN PASSIVE LECTURES... <span className="comic-red-highlight">IT'S FORGED BY SHIPPING CODE, BREAKING BOUNDARIES, AND SCALING TOGETHER.</span>"
          </div>
          <div className="quote-author font-mono">
            — TECHNOSPARK CORE LEADERSHIP, ITSA
          </div>
        </div>

      </div>
    </section>
  );
}
