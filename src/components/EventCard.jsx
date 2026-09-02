import React from 'react';

// ============================================================================
// EVENT CARD COMPONENT
// ============================================================================
// Displays an individual event in a clean, high-readability card.
//
// Props:
// - event: Object containing id, title, category, date, month, location, etc.
// - onSelect: Callback function invoked when user clicks "View Details"
// ============================================================================

export default function EventCard({ event, onSelect }) {
  const isPast = event.status === 'past';

  return (
    <article
      className={`event-card ${isPast ? 'event-card-past' : ''}`}
      onClick={() => onSelect(event)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${event.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(event);
        }
      }}
    >
      {/* Top Meta Header: Date badge + Category pill */}
      <div className="event-card-top">
        <div className="event-date-badge">
          <span className="event-date-day">{event.date}</span>
          <span className="event-date-month">{event.month}</span>
        </div>

        <div className="event-tags-row">
          <span className={`event-category-pill category-${event.category.toLowerCase()}`}>
            {event.category}
          </span>
          {event.badge && (
            <span className="event-status-badge">
              {event.badge}
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-description">{event.shortDesc}</p>
      </div>

      {/* Footer Meta: Location & Action link */}
      <div className="event-card-footer">
        <div className="event-card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{event.location}</span>
        </div>

        <div className="event-card-action">
          <span>View Details</span>
          <svg className="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </article>
  );
}
