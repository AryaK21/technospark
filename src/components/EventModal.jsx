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
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className={`event-category-pill category-${event.category.toLowerCase()}`}>
              {event.category}
            </span>

          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal window"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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



          {/* Detailed Narrative */}
          <div className="modal-section">
            <h4 className="modal-section-title">ABOUT THIS EVENT</h4>
            <p className="modal-desc-text">{event.fullDesc}</p>
          </div>

          {/* Schedule / Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section-title">WHEN AND VENUE</h4>
              <div className="modal-timeline">
                <span className="modal-event-date">
                  <span>{event.location}</span>
                  <span> <br></br></span>
                  {event.month} {event.date}, {event.year} • {event.time}
                </span>

              </div>
            </div>
          )}


        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close Window
          </button>
          {event.status === 'upcoming' && (
            <a
              href="mailto:technospark@pccoepune.org?subject=Inquiry regarding Event"
              className="btn btn-primary"
            >
              Contact Coordinators
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
