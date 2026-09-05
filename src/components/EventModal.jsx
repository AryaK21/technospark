import React, { useEffect } from 'react';

// ============================================================================
// EVENT DETAILS MODAL COMPONENT
// ============================================================================
// Provides a clean, accessible overlay showing complete itinerary,
// speaker/mentor information, venue details, and key event highlights.
// ============================================================================

export default function EventModal({ event, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
    >
      <div
        className="event-modal-content spiderverse-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner - Reference Image 2 Glitch Effect */}
        <div className="modal-zooming-banner">
          <h3 className="glitch-title" data-text={`ZOOMING TO ${event.category.toUpperCase()}`}>
            ZOOMING TO {event.category.toUpperCase()}
          </h3>
          <p className="modal-zooming-subtext">ENTERING THE MULTIVERSE...</p>
        </div>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className="modal-dossier-pill">[ MISSION DOSSIER // {event.id.toUpperCase()} ]</span>
            <span className={`event-card-badge ${event.status === 'past' ? 'event-badge-past' : 'event-badge-upcoming'}`}>
              {event.status === 'past' ? 'ARCHIVED SPRINT' : 'LIVE EVENT'}
            </span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal window"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <h2 id="modal-event-title" className="modal-title">
            {event.title}
          </h2>

          <div className="modal-meta-grid">
            <div className="modal-meta-item">
              <span className="modal-meta-label">[ DATE & TIME ]</span>
              <span className="modal-meta-value">📅 {event.date} {event.month} {event.year} • {event.time}</span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-meta-label">[ VENUE ]</span>
              <span className="modal-meta-value">📍 {event.location}</span>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="modal-section">
            <h4 className="modal-section-title">[ // SPRINT OVERVIEW ]</h4>
            <p className="modal-desc-text">{event.fullDesc}</p>
          </div>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section-title">[ // SPRINT REWARDS & HIGHLIGHTS ]</h4>
              <ul className="modal-highlights-list">
                {event.highlights.map((h, i) => (
                  <li key={i} className="modal-highlight-item">{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Schedule / Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section-title">[ // EXECUTION TIMELINE ]</h4>
              <div className="modal-timeline">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="timeline-row">
                    <span className="timeline-time">{item.time}</span>
                    <span className="timeline-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="events-tab-btn" onClick={onClose}>
            CLOSE DOSSIER
          </button>
          {event.status === 'upcoming' && (
            <a
              href="mailto:technospark@pccoepune.org?subject=Inquiry regarding Event"
              className="events-tab-btn active"
            >
              INFILTRATE & REGISTER NOW →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
