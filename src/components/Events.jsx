import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { events } from '../data/events';
import EventCard from './EventCard';
import EventModal from './EventModal';

// ============================================================================
// EVENTS COMPONENT
// ============================================================================
// Main Events section rendering filterable event cards.
// Users can toggle between "All Events", "Upcoming", and "Past".
// Clicking any card opens the detailed EventModal.
//
// Animations Local to this Component:
// - EVENTS SCROLL REVEAL:
//   Fades/slides in the events header and filter buttons, followed by a
//   staggered reveal of event cards upon entering the viewport.
// ============================================================================

export default function Events() {
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [selectedEvent, setSelectedEvent] = useState(null);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // Filter events based on active tab
  const filteredEvents = events.filter((evt) => {
    if (filter === 'upcoming') return evt.status === 'upcoming';
    if (filter === 'past') return evt.status === 'past';
    return true;
  });

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const pastCount = events.filter((e) => e.status === 'past').length;

  // ==========================================================================
  // SCROLL REVEAL ANIMATION
  // Runs once when the Events section enters the viewport.
  // ==========================================================================
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.65 } });

            // 1. Events header & filter tabs
            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 }
            )
            // 2. Event cards staggered entrance
            .fromTo(
              gridRef.current?.children || [],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, stagger: 0.1, duration: 0.55 },
              '-=0.35'
            );

            observer.disconnect(); // Trigger only once
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="events-section"
      aria-label="Technospark Events"
    >
      <div className="events-container">
        
        {/* Section Header with Eyebrow and Filter Tabs */}
        <div ref={headerRef} className="events-header-row">
          <div className="events-title-col">
            <span className="section-eyebrow">WHAT'S HAPPENING</span>
            <h2 className="section-title">
              UPCOMING & RECENT <br />
              <span className="text-highlight">EVENTS</span>
            </h2>
            <p className="events-subtitle">
              Participate in hackathons, hands-on masterclasses, and tech conferences organized by Technospark ITSA.
            </p>
          </div>

          {/* Practical Filter Tabs */}
          <div className="events-tabs-group" role="tablist" aria-label="Event Status Filter">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={`events-tab-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events <span className="tab-count">({events.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={filter === 'upcoming'}
              className={`events-tab-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming <span className="tab-count">({upcomingCount})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={filter === 'past'}
              className={`events-tab-btn ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past <span className="tab-count">({pastCount})</span>
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div ref={gridRef} className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={(evt) => setSelectedEvent(evt)}
            />
          ))}
        </div>

        {/* Empty State Fallback */}
        {filteredEvents.length === 0 && (
          <div className="events-empty-state">
            <p>No events found for this filter.</p>
          </div>
        )}

      </div>

      {/* Detail Overlay Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
