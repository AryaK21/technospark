import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { organizers } from '../data/organizers';
import OrganizerCard from './OrganizerCard';

// ============================================================================
// ORGANIZERS COMPONENT
// ============================================================================
// Displays the student leads and team coordinators of Technospark.
//
// Layout:
// - Left-aligned header with consistent section typography
// - Horizontal row: 4 on desktop, 2 on tablet, 1-2 on mobile
//
// Animations Local to this Component:
// - ORGANIZERS SCROLL REVEAL:
//   Fades in the section title and staggers the organizer cards when scrolled into view.
// - Card hover animations are styled in index.css on .organizer-card:hover.
// ============================================================================

export default function Organizers() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // ==========================================================================
  // SCROLL REVEAL ANIMATION
  // Runs once when the Organizers section enters the viewport.
  // ==========================================================================
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.65 } });

            // 1. Left-aligned section header reveal
            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 }
            )
            // 2. Organizer cards staggered reveal
            .fromTo(
              gridRef.current?.children || [],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 },
              '-=0.35'
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
      id="organizers"
      ref={sectionRef}
      className="organizers-section"
      aria-label="Club Organizers"
    >
      <div className="organizers-container">

        {/* Left-Aligned Section Header (Matches About & Events) */}
        <div ref={headerRef} className="organizers-header">
          <span className="section-eyebrow">LEADERSHIP & EXECUTION</span>
          <h2 className="section-title">
            ORGANIZERS
          </h2>
          <p className="organizers-subtitle">
            The dedicated student team behind Technospark hackathons, workshops, and technical initiatives.
          </p>
        </div>

        {/* 4 Organizers Grid */}
        <div ref={gridRef} className="organizers-grid">
          {organizers.map((org) => (
            <OrganizerCard key={org.id} organizer={org} />
          ))}
        </div>

      </div>
    </section>
  );
}
