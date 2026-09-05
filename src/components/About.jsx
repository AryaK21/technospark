import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { clubInfo } from '../data/clubInfo';
import use3DTilt from '../hooks/use3DTilt';

function StatCard({ number, line1, highlightText }) {
  const cardRef = useRef(null);
  use3DTilt(cardRef, { max: 14, scale: 1.05 });

  return (
    <div ref={cardRef} className="stat-card tilt-3d-card spiderverse-card">
      <div className="stat-number">{number}</div>
      <div className="stat-label">
        {line1} <br />
        <span className="comic-red-highlight">{highlightText}</span>
      </div>
    </div>
  );
}

// ============================================================================
// ABOUT COMPONENT (Spiderverse Comic Panel Overhaul)
// ============================================================================

export default function About() {
  const sectionRef = useRef(null);
  const titleColRef = useRef(null);
  const introColRef = useRef(null);
  const statsRef = useRef(null);
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
                statsRef.current?.children || [],
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
                '-=0.3'
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

  const stats = [
    { number: '1,500+', line1: "BUILT SYSTEMS THAT DON'T JUST LOOK GOOD,", highlightText: 'THEY SCALE.' },
    { number: '25+', line1: 'WORKED WITH MULTIVERSE TECH,', highlightText: 'A LOT OF TECH.' },
    { number: '36 HRS', line1: 'TURNED MESSY IDEAS INTO', highlightText: 'SOMETHING USABLE.' },
    { number: '100%', line1: 'AND YEAH... BROKE THINGS', highlightText: 'ALONG THE WAY TOO.' }
  ];

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

        {/* Reference Image Style Comic Quote Cards */}
        <div ref={statsRef} className="about-stats-grid">
          {stats.map((stat, idx) => (
            <StatCard key={idx} number={stat.number} line1={stat.line1} highlightText={stat.highlightText} />
          ))}
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
