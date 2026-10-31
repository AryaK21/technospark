import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Sparkles, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { events as defaultEvents } from '../data/events';
import { getEvents } from '../services/eventsService';
import EventCard from './EventCard';
import EventModal from './EventModal';
import '../styles/events.css';

// ============================================================================
// EVENTS COMPONENT — CONTINUOUS CHRONOLOGICAL TIMELINE
// ============================================================================
// Structural reference from Prototype + 100% Theme Preservation & Card Reuse:
// - Continuous horizontal chronological timeline on desktop.
// - Past events on the left, upcoming events on the right.
// - Radiant NOW marker positioned at the temporal horizon center.
// - Alternating upper/lower card placement relative to the horizontal line.
// - Interactive milestone dots on the line.
// - Vertical connector stem lines linking milestones to event cards.
// - REUSES ORIGINAL Technospark EventCard and EventModal components.
// - Responsive vertical chronological timeline fallback for mobile/tablet.
// ============================================================================

export default function Events() {
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState(defaultEvents);

  useEffect(() => {
    let isMounted = true;
    getEvents().then(({ data, error }) => {
      if (!error && data && data.length > 0 && isMounted) {
        setEventsList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const timelineScrollRef = useRef(null);

  const pastEvents = eventsList.filter((e) => e.status === 'past');
  const futureEvents = eventsList.filter((e) => e.status !== 'past');

  const allCount = eventsList.length;
  const upcomingCount = futureEvents.length;
  const pastCount = pastEvents.length;

  // Filtered lists based on active selection
  const displayPast = filter === 'upcoming' ? [] : pastEvents;
  const displayFuture = filter === 'past' ? [] : futureEvents;

  // Scroll to timeline region using rock-solid getBoundingClientRect coordinate mapping
  const scrollToRegion = (region) => {
    // Mobile vertical timeline support
    if (window.innerWidth <= 1024) {
      if (region === 'past') {
        const target = document.getElementById('mobile-past-events');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (region === 'upcoming' || region === 'future') {
        const target = document.getElementById('mobile-upcoming-events');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // Desktop horizontal timeline support
    const el = timelineScrollRef.current;
    if (!el) return;

    if (region === 'past') {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (region === 'now') {
      const nowMarker = document.getElementById('technospark-now-marker');
      if (nowMarker) {
        const scrollerRect = el.getBoundingClientRect();
        const markerRect = nowMarker.getBoundingClientRect();
        const currentScroll = el.scrollLeft;
        const targetScroll = currentScroll + (markerRect.left - scrollerRect.left) - (scrollerRect.width / 2) + (markerRect.width / 2);
        el.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
      } else {
        el.scrollTo({ left: Math.max(0, el.scrollWidth / 2 - el.clientWidth / 2), behavior: 'smooth' });
      }
    } else if (region === 'upcoming' || region === 'future') {
      el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: 'smooth' });
    }
  };

  // Center timeline on the NOW marker on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToRegion('now');
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  // GSAP Entrance Scroll Animation
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              headerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
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

        {/* ── Section Header with Eyebrow, Title & Subtitle ─────────────── */}
        <div ref={headerRef} className="events-header-row">
          <div className="events-title-col">
            <span className="section-eyebrow">[  WHAT'S HAPPENING ]</span>
            <h2 className="section-title">
              EVENT <br />
              <span className="text-highlight">TIMELINE</span>
            </h2>
            <p className="events-subtitle">
              A continuous chronological progression of technical hackathons, deep-learning laboratories, and engineering masterclasses, centered around our present temporal horizon.
            </p>
          </div>
        </div>

        {/* ── Timeline Navigation Controls Placed Right Above Canvas ──────── */}
        <div className="timeline-canvas-controls-bar">
          <button
            type="button"
            onClick={() => scrollToRegion('past')}
            className="timeline-nav-btn timeline-nav-btn--past"
            aria-label="Scroll to Past Events"
          >
            <ChevronLeft size={14} />
            <span>Past Events ({pastCount})</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToRegion('upcoming')}
            className="timeline-nav-btn timeline-nav-btn--upcoming"
            aria-label="Scroll to Future Events"
          >
            <span>Future Events ({upcomingCount})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* ================================================================ */}
        {/* DESKTOP ALTERNATING TIMELINE WITH NOW MARKER AT 50% HEIGHT       */}
        {/* ================================================================ */}
        <div className="desktop-timeline-wrapper">
          <div ref={timelineScrollRef} className="desktop-timeline-scroller">
            <div className="desktop-timeline-track-inner">
              {/* Continuous Horizontal Gradient Axis Line */}
              <div className="desktop-timeline-continuous-axis" />

              {/* Flex Container with Past Events, NOW Marker, and Upcoming Events */}
              <div className="desktop-timeline-columns-row">

                {/* ── Past Events (Left of NOW Marker) ───────────────────── */}
                {displayPast.map((event, idx) => {
                  const isTop = idx % 2 === 0;
                  return (
                    <div key={event.id} className="timeline-node-col">
                      {/* Card Positioned Top */}
                      {isTop && (
                        <div className="timeline-card-anchor-top">
                          <EventCard
                            event={event}
                            index={idx}
                            onSelect={(evt) => setSelectedEvent(evt)}
                          />
                          <div className="timeline-vertical-stem timeline-vertical-stem--down" />
                        </div>
                      )}

                      {/* Date Label Opposite of Card */}
                      {!isTop && (
                        <div className="timeline-date-anchor-top font-mono">
                          {event.displayDate || event.date} • PAST
                        </div>
                      )}

                      {/* Milestone Dot on the Axis Line */}
                      <div
                        onClick={() => setSelectedEvent(event)}
                        className="timeline-milestone-dot timeline-milestone-dot--past"
                        title={`${event.title} (${event.date}) — Click to view details`}
                        tabIndex={0}
                        role="button"
                        aria-label={`Milestone: ${event.title}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedEvent(event);
                          }
                        }}
                      />

                      {/* Card Positioned Bottom */}
                      {!isTop && (
                        <div className="timeline-card-anchor-bottom">
                          <div className="timeline-vertical-stem timeline-vertical-stem--up" />
                          <EventCard
                            event={event}
                            index={idx}
                            onSelect={(evt) => setSelectedEvent(evt)}
                          />
                        </div>
                      )}

                      {/* Date Label Opposite of Card */}
                      {isTop && (
                        <div className="timeline-date-anchor-bottom font-mono">
                          {event.displayDate || event.date} • PAST
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* ── Central Radiant NOW Milestone Marker ────────────────── */}
                <div id="technospark-now-marker" className="timeline-now-marker-col">
                  {/* Upper Temporal Horizon Badge */}
                  <div className="now-marker-upper-badge">
                    <div className="now-temporal-pill font-mono">
                      <Clock size={13} color="#00F0FF" />
                      <span>TEMPORAL HORIZON</span>
                    </div>
                    <div className="now-stem-guide" />
                  </div>

                  {/* Central Pulsing Milestone Core */}
                  <div className="now-radiant-core" title="NOW — Present Temporal Horizon">
                    <div className="now-inner-dot" />
                    <div className="now-ripple-ring" />
                  </div>

                  {/* Lower Label */}
                  <div className="now-marker-lower-label">
                    <div className="now-stem-guide" />
                    <div className="now-text-title font-heading">NOW</div>
                    <div className="now-text-sub font-mono">CURRENT POSITION</div>
                  </div>
                </div>

                {/* ── Upcoming Events (Right of NOW Marker) ───────────────── */}
                {displayFuture.map((event, idx) => {
                  const isTop = idx % 2 === 1; // Alternating with respect to past events
                  return (
                    <div key={event.id} className="timeline-node-col">
                      {/* Card Positioned Top */}
                      {isTop && (
                        <div className="timeline-card-anchor-top">
                          <EventCard
                            event={event}
                            index={idx + pastEvents.length}
                            onSelect={(evt) => setSelectedEvent(evt)}
                          />
                          <div className="timeline-vertical-stem timeline-vertical-stem--down" />
                        </div>
                      )}

                      {/* Date Label Opposite of Card */}
                      {!isTop && (
                        <div className="timeline-date-anchor-top font-mono">
                          {event.displayDate || event.date} • UPCOMING
                        </div>
                      )}

                      {/* Milestone Dot on Axis Line */}
                      <div
                        onClick={() => setSelectedEvent(event)}
                        className="timeline-milestone-dot timeline-milestone-dot--future"
                        title={`${event.title} (${event.date}) — Click to view details`}
                        tabIndex={0}
                        role="button"
                        aria-label={`Milestone: ${event.title}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedEvent(event);
                          }
                        }}
                      />

                      {/* Card Positioned Bottom */}
                      {!isTop && (
                        <div className="timeline-card-anchor-bottom">
                          <div className="timeline-vertical-stem timeline-vertical-stem--up" />
                          <EventCard
                            event={event}
                            index={idx + pastEvents.length}
                            onSelect={(evt) => setSelectedEvent(evt)}
                          />
                        </div>
                      )}

                      {/* Date Label Opposite of Card */}
                      {isTop && (
                        <div className="timeline-date-anchor-bottom font-mono">
                          {event.displayDate || event.date} • UPCOMING
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* MOBILE / TABLET VERTICAL TIMELINE FALLBACK                       */}
        {/* ================================================================ */}
        <div className="mobile-vertical-timeline">
          {/* Past Events */}
          {displayPast.length > 0 && (
            <div id="mobile-past-events" className="mobile-timeline-section">
              <div className="mobile-timeline-section-title font-mono">
                [ // ARCHIVED & PAST EVENTS ]
              </div>
              <div className="mobile-timeline-cards-list">
                {displayPast.map((event, idx) => (
                  <div key={event.id} className="mobile-timeline-item">
                    <div className="mobile-timeline-dot mobile-timeline-dot--past" />
                    <EventCard
                      event={event}
                      index={idx}
                      onSelect={(evt) => setSelectedEvent(evt)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Central Mobile NOW Indicator */}
          <div className="mobile-now-divider">
            <div className="now-radiant-core mobile-now-core">
              <div className="now-inner-dot" />
              <div className="now-ripple-ring" />
            </div>
            <div className="mobile-now-text font-heading">
              TEMPORAL HORIZON • NOW
            </div>
          </div>

          {/* Upcoming Events */}
          {displayFuture.length > 0 && (
            <div id="mobile-upcoming-events" className="mobile-timeline-section">
              <div className="mobile-timeline-section-title font-mono" style={{ color: 'var(--cyber-cyan)' }}>
                [ // UPCOMING SPRINT HORIZON ]
              </div>
              <div className="mobile-timeline-cards-list">
                {displayFuture.map((event, idx) => (
                  <div key={event.id} className="mobile-timeline-item">
                    <div className="mobile-timeline-dot mobile-timeline-dot--future" />
                    <EventCard
                      event={event}
                      index={idx + pastEvents.length}
                      onSelect={(evt) => setSelectedEvent(evt)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State Fallback */}
        {displayPast.length === 0 && displayFuture.length === 0 && (
          <div className="events-empty-state">
            <p>No events found for this filter criteria.</p>
          </div>
        )}

      </div>

      {/* ── Technospark Event Details Modal ──────────────────────────────── */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
