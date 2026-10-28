import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { events } from '../data/events';
import EventCard from './EventCard';
import EventModal from './EventModal';

// ============================================================================
// EVENTS COMPONENT — Matching Image 2 in Current Neon Cyber Theme
// ============================================================================
// Layout:
// - Header with "UPCOMING & RECENT EVENTS" and subtitle
// - Right-aligned horizontal capsule filter switch (All Events / Upcoming / Past)
// - Clean responsive grid of event cards
// - Smooth GSAP entrance animation
// - Event details modal
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

  const allCount = events.length;
  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const pastCount = events.filter((e) => e.status === 'past').length;

  // ==========================================================================
  // SCROLL REVEAL ANIMATION
  // ==========================================================================
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });

            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0 }
            )
              .fromTo(
                gridRef.current?.children || [],
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
                '-=0.3'
              );

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
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
      aria-label="Technospark Events Vault"
    >
      <div className="events-container">

        {/* Section Header with Eyebrow and Filter Tabs */}
        <div ref={headerRef} className="events-header-row">
          <div className="events-title-col">
            <span className="section-eyebrow">[ // 02. WHAT'S HAPPENING ]</span>
            <h2 className="section-title">
              UPCOMING & RECENT <br />
              <span className="text-highlight">EVENTS</span>
            </h2>
            <p className="events-subtitle">
              Participate in hackathons, hands-on masterclasses, and tech conferences organized by Technospark ITSA.
            </p>
          </div>

          {/* Horizontal Filter Capsule Switch (Matching Image 2) */}
          <div className="theme-events-switch-wrap">
            <div
              className="theme-events-switch"
              role="tablist"
              aria-label="Filter events by status"
            >
              <button
                type="button"
                role="tab"
                id="filter-all"
                aria-selected={filter === 'all'}
                className={`theme-switch-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Events <span className="theme-tab-count">({allCount})</span>
              </button>

              <button
                type="button"
                role="tab"
                id="filter-upcoming"
                aria-selected={filter === 'upcoming'}
                className={`theme-switch-tab ${filter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming <span className="theme-tab-count">({upcomingCount})</span>
              </button>

              <button
                type="button"
                role="tab"
                id="filter-past"
                aria-selected={filter === 'past'}
                className={`theme-switch-tab ${filter === 'past' ? 'active' : ''}`}
                onClick={() => setFilter('past')}
              >
                Past <span className="theme-tab-count">({pastCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Events Grid */}
        <div ref={gridRef} className="theme-events-grid retro-events-grid" key={filter}>
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
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

      {/* Details Popup Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
