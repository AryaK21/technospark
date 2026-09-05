import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { organizers } from '../data/organizers';
import OrganizerCard from './OrganizerCard';

// ============================================================================
// ORGANIZERS COMPONENT (Spiderverse Cyber Overhaul)
// ============================================================================

export default function Organizers() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.65 } });

            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 }
            )
            .fromTo(
              gridRef.current?.children || [],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 },
              '-=0.35'
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
      id="organizers"
      ref={sectionRef}
      className="organizers-section"
      aria-label="Club Organizers"
    >
      <div className="organizers-container">

        {/* Section Header */}
        <div ref={headerRef} className="organizers-header">
          <span className="section-eyebrow">[ // 03. EXECUTIVE LEADERSHIP ]</span>
          <h2 className="section-title">
            ORGANIZERS & <span className="text-highlight">COORDINATORS</span>
          </h2>
          <p className="organizers-subtitle">
            The dedicated student leads behind Technospark hackathons, workshops, and technical initiatives.
          </p>
        </div>

        {/* Organizers Grid */}
        <div ref={gridRef} className="organizers-grid">
          {organizers.map((org) => (
            <OrganizerCard key={org.id} organizer={org} />
          ))}
        </div>

      </div>
    </section>
  );
}
