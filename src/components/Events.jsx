import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { Sparkles, Clock, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { events as defaultEvents } from '../data/events';
import {
  getEvents,
  isEventPast,
  compareEventDates,
  formatEventDate
} from '../services/eventsService';
import EventCard from './EventCard';
import EventModal from './EventModal';
import '../styles/events.css';

// ============================================================================
// EVENTS COMPONENT — CONTINUOUS CHRONOLOGICAL TIMELINE
// ============================================================================
// Chronological Features:
// - Dynamically evaluates event_date against the present date and time.
// - Past events on the left of NOW marker, chronologically sorted ascending
//   (older dates on far left progressing rightward towards the NOW marker).
// - Central pulsing NOW milestone placed at the present temporal horizon.
// - Upcoming events on the right of NOW marker, chronologically sorted ascending
//   (earliest upcoming event right after NOW progressing into the future).
// - Re-centers view directly on the NOW marker upon data synchronization.
// ============================================================================

export default function Events() {
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState(defaultEvents);
  const [isTimelineReady, setIsTimelineReady] = useState(false);

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
  const hasMountedDbRef = useRef(false);

  // 1. Dynamically evaluate event status against present date and format display dates
  const processedEvents = useMemo(() => {
    return (eventsList || []).map((e) => {
      const dateVal = e.event_date || e.date || '';
      const past = isEventPast(dateVal, e.end_time || e.endTime, e.start_time || e.startTime);
      return {
        ...e,
        status: past ? 'past' : 'upcoming',
        era: past ? 'past' : 'upcoming',
        displayDate: e.displayDate || formatEventDate(dateVal)
      };
    });
  }, [eventsList]);

  // 2. Past events: strictly ascending order (progressing chronologically towards NOW)
  const pastEvents = useMemo(() => {
    return processedEvents
      .filter((e) => e.status === 'past')
      .sort((a, b) => compareEventDates(a, b, true));
  }, [processedEvents]);

  // 3. Upcoming events: strictly ascending order (closest upcoming date right after NOW)
  const futureEvents = useMemo(() => {
    return processedEvents
      .filter((e) => e.status !== 'past')
      .sort((a, b) => compareEventDates(a, b, true));
  }, [processedEvents]);

  const allCount = processedEvents.length;
  const upcomingCount = futureEvents.length;
  const pastCount = pastEvents.length;

  // Filtered lists based on active selection
  const displayPast = filter === 'upcoming' ? [] : pastEvents;
  const displayFuture = filter === 'past' ? [] : futureEvents;

  // Scroll to timeline region using buttery-smooth GSAP interpolation
  const scrollToRegion = (region, smooth = true, duration = 1.3) => {
    // Mobile vertical timeline support
    if (window.innerWidth <= 1024) {
      const behavior = smooth ? 'smooth' : 'auto';
      if (region === 'past') {
        const target = document.getElementById('mobile-past-events');
        if (target) target.scrollIntoView({ behavior, block: 'start' });
      } else if (region === 'upcoming' || region === 'future') {
        const target = document.getElementById('mobile-upcoming-events');
        if (target) target.scrollIntoView({ behavior, block: 'start' });
      } else if (region === 'now') {
        const target = document.querySelector('.mobile-now-divider');
        if (target) target.scrollIntoView({ behavior, block: 'center' });
      }
      return;
    }

    // Desktop horizontal timeline support
    const el = timelineScrollRef.current;
    if (!el) return;

    let targetLeft = 0;
    if (region === 'past') {
      targetLeft = 0;
    } else if (region === 'now') {
      const nowMarker = document.getElementById('technospark-now-marker');
      if (nowMarker) {
        const scrollerRect = el.getBoundingClientRect();
        const markerRect = nowMarker.getBoundingClientRect();
        const currentScroll = el.scrollLeft;
        targetLeft = Math.max(
          0,
          currentScroll +
            (markerRect.left - scrollerRect.left) -
            scrollerRect.width / 2 +
            markerRect.width / 2
        );
      } else {
        targetLeft = Math.max(0, el.scrollWidth / 2 - el.clientWidth / 2);
      }
    } else if (region === 'upcoming' || region === 'future') {
      targetLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    }

    if (smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(el, {
        scrollLeft: targetLeft,
        duration: duration,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    } else {
      el.scrollLeft = targetLeft;
    }
  };

  // Silky smooth entrance animation: gently glides into the NOW marker when section enters view
  const hasAnimatedEntrance = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedEntrance.current) {
            hasAnimatedEntrance.current = true;

            if (headerRef.current) {
              gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
              );
            }

            const el = timelineScrollRef.current;
            if (el) {
              setIsTimelineReady(true);
              const nowMarker = document.getElementById('technospark-now-marker');
              if (nowMarker) {
                const scrollerRect = el.getBoundingClientRect();
                const markerRect = nowMarker.getBoundingClientRect();
                const currentScroll = el.scrollLeft;
                const targetScroll = Math.max(
                  0,
                  currentScroll +
                    (markerRect.left - scrollerRect.left) -
                    scrollerRect.width / 2 +
                    markerRect.width / 2
                );

                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                  // Start with a gentle 160px offset and glide into NOW over 1.4s
                  el.scrollLeft = Math.max(0, targetScroll - 160);
                  gsap.to(el, {
                    scrollLeft: targetScroll,
                    duration: 1.4,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    delay: 0.1
                  });
                } else {
                  el.scrollLeft = targetScroll;
                }
              }
            }

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // When database events arrive, smoothly ease to new target without jarring
  useEffect(() => {
    if (!hasMountedDbRef.current) {
      hasMountedDbRef.current = true;
      return;
    }
    const timer = setTimeout(() => {
      scrollToRegion('now', true, 1.0);
    }, 120);
    return () => clearTimeout(timer);
  }, [eventsList]);

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
            onClick={() => scrollToRegion('past', true, 1.2)}
            className="timeline-nav-btn timeline-nav-btn--past"
            aria-label="Scroll to Past Events"
          >
            <ChevronLeft size={14} />
            <span>Past Events</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToRegion('now', true, 1.2)}
            className="timeline-nav-btn"
            style={{
              borderColor: 'var(--cyber-cyan, #00F0FF)',
              color: '#00F0FF',
              backgroundColor: 'rgba(0, 240, 255, 0.08)'
            }}
            aria-label="Center on Present Timeline Horizon"
          >
            <Clock size={13} />
            <span>Center on NOW</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToRegion('upcoming', true, 1.2)}
            className="timeline-nav-btn timeline-nav-btn--upcoming"
            aria-label="Scroll to Future Events"
          >
            <span>Future Events</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* ================================================================ */}
        {/* DESKTOP ALTERNATING TIMELINE WITH NOW MARKER AT 50% HEIGHT       */}
        {/* ================================================================ */}
        <div className="desktop-timeline-wrapper">
          <div
            ref={timelineScrollRef}
            className={`desktop-timeline-scroller ${isTimelineReady ? 'timeline-ready' : ''}`}
          >
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
                {displayFuture.length > 0 ? (
                  displayFuture.map((event, idx) => {
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
                  })
                ) : (
                  <div className="timeline-node-col timeline-node-col--placeholder">
                    <div className="timeline-card-anchor-top">
                      <div
                        className="retro-comic-card"
                        style={{
                          border: '2.5px dashed var(--cyber-cyan, #00F0FF)',
                          backgroundColor: '#0C0F29',
                          backgroundImage: 'var(--halftone-cyan)',
                          backgroundSize: '12px 12px',
                          padding: '24px 22px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          minWidth: '240px',
                          boxShadow: '4px 4px 0px #000000, 8px 8px 0px rgba(0, 240, 255, 0.35)'
                        }}
                      >
                        <Sparkles size={26} color="var(--cyber-cyan, #00F0FF)" />
                        <h4
                          className="font-heading"
                          style={{
                            fontSize: '1.15rem',
                            color: '#FFFFFF',
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                            margin: 0
                          }}
                        >
                          MORE TO COME
                        </h4>
                        <p
                          className="font-mono"
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary, #94A3B8)',
                            lineHeight: 1.5,
                            margin: 0,
                            maxWidth: '210px'
                          }}
                        >
                          Upcoming hackathons & technical workshops are currently being engineered.
                        </p>
                      </div>
                      <div className="timeline-vertical-stem timeline-vertical-stem--down" />
                    </div>


                    <div
                      className="timeline-milestone-dot timeline-milestone-dot--future"
                      title="More events coming soon!"
                      style={{ borderStyle: 'dashed' }}
                    />


                  </div>
                )}

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
          <div id="mobile-upcoming-events" className="mobile-timeline-section">
            <div className="mobile-timeline-section-title font-mono" style={{ color: 'var(--cyber-cyan)' }}>
              [ // UPCOMING SPRINT HORIZON ]
            </div>
            <div className="mobile-timeline-cards-list">
              {displayFuture.length > 0 ? (
                displayFuture.map((event, idx) => (
                  <div key={event.id} className="mobile-timeline-item">
                    <div className="mobile-timeline-dot mobile-timeline-dot--future" />
                    <EventCard
                      event={event}
                      index={idx + pastEvents.length}
                      onSelect={(evt) => setSelectedEvent(evt)}
                    />
                  </div>
                ))
              ) : (
                <div className="mobile-timeline-item">
                  <div className="mobile-timeline-dot mobile-timeline-dot--future" style={{ borderStyle: 'dashed' }} />
                  <div
                    className="retro-comic-card"
                    style={{
                      border: '2.5px dashed var(--cyber-cyan, #00F0FF)',
                      backgroundColor: '#0C0F29',
                      backgroundImage: 'var(--halftone-cyan)',
                      backgroundSize: '12px 12px',
                      padding: '24px 20px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '4px 4px 0px #000000, 6px 6px 0px rgba(0, 240, 255, 0.35)'
                    }}
                  >
                    <Sparkles size={24} color="var(--cyber-cyan, #00F0FF)" />
                    <h4
                      className="font-heading"
                      style={{
                        fontSize: '1.05rem',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        margin: 0
                      }}
                    >
                      MORE TO COME
                    </h4>
                    <p
                      className="font-mono"
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary, #94A3B8)',
                        lineHeight: 1.5,
                        margin: 0
                      }}
                    >
                      Stay tuned! Upcoming hackathons & technical workshops are currently being engineered.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
