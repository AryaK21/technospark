import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { events } from '../data/events';
import EventCard from './EventCard';
import EventModal from './EventModal';

// ============================================================================
// EVENTS COMPONENT (Spiderverse Multiverse Vault)
// ============================================================================

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

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
              { opacity: 1, y: 0, stagger: 0.1, duration: 0.55 },
              '-=0.35'
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
      id="events"
      ref={sectionRef}
      className="events-section"
      aria-label="Technospark Events Vault"
    >
      <div className="events-container">
        
        {/* Section Header */}
        <div ref={headerRef} className="events-header-row">
          <div className="events-title-col">
            <span className="section-eyebrow">[ // 02. UPCOMING EVENTS ]</span>
            <h2 className="section-title">
              <span className="glitch-title" data-text="UPCOMING EVENTS">UPCOMING EVENTS</span> <br />
              <span className="text-highlight">CODE & HACK SPRINTS</span>
            </h2>
            <p className="events-subtitle">
              36-HOUR HACKATHONS, NEURAL AI LABS, DEFCON CTF SHOWDOWNS, AND SYSTEM ARCHITECTURE SPRINTS. <span className="comic-red-highlight">THEY CODE. THEY SCALE.</span>
            </p>
          </div>
        </div>

        {/* Spiderverse Event Cards Grid */}
        <div ref={gridRef} className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={(evt) => setSelectedEvent(evt)}
            />
          ))}
        </div>

      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
