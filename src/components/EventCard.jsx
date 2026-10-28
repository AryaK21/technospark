import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

// ============================================================================
// RETRO-COMIC / NEO-BRUTALIST EVENT CARD COMPONENT (2-SECTION LAYOUT)
// ============================================================================
// - Section 1: Colored header banner with category flags & event title
// - Section 2: Body containing narrative, full location & schedule, black pills,
//              and chunky action button
// - Completely eliminates duplication and ensures full visibility of venue info
// ============================================================================

export const CATEGORY_ACCENT_COLORS = {
  Hackathon: '#EF4444', // Bold Red (matching Image 2)
  Workshop: '#A78BFA', // Lavender Purple (matching Image 1 & 3)
  Competition: '#38BDF8', // Cyan Tactical Blue
  Seminar: '#F59E0B'  // Warm Amber
};

export default function EventCard({ event, index = 0, onSelect }) {
  const isPast = event.status === 'past';
  const categoryKey = event.category || 'Workshop';
  const accentColor = CATEGORY_ACCENT_COLORS[categoryKey] || '#A78BFA';
  const indexFormatted = String(index + 1).padStart(2, '0');

  return (
    <article
      className={`retro-comic-card ${isPast ? 'retro-comic-card--past' : ''}`}
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
      {/* ── Section 1: Colored Top Banner (Title & Flags) ──────────────── */}
      <div
        className="retro-card-banner"
        style={{ backgroundColor: accentColor }}
      >
        <div className="retro-banner-eyebrow">
          {event.category?.toUpperCase()} {event.badge ? `• ${event.badge.toUpperCase()}` : ''}
        </div>
        <h4 className="retro-banner-title">{event.title}</h4>
      </div>

      {/* ── Section 2: Main Body & Actions ─────────────────────────────── */}
      <div className="retro-card-body">
        {/* Short Description */}
        <p className="retro-body-desc">{event.shortDesc}</p>

        {/* Location & Schedule Meta (Prominently placed for full visibility) */}
        <div className="retro-body-meta">
          <div className="retro-meta-item">
            <MapPin size={15} className="retro-meta-icon" />
            <span className="retro-meta-text">{event.location}</span>
          </div>
          <div className="retro-meta-item">
            <Calendar size={15} className="retro-meta-icon" />
            <span className="retro-meta-text">{event.date} • {event.time}</span>
          </div>
        </div>

        {/* Footer Row: Black Pill Tags on Left, Action Button on Right */}
        <div className="retro-footer-row">
          <div className="retro-pills-row">
            <span className="retro-black-pill">{event.category}</span>
            {event.badge && <span className="retro-black-pill">{event.badge}</span>}
            <span className="retro-black-pill">
              {event.status === 'past' ? 'Completed' : 'Upcoming'}
            </span>
          </div>

          <div className="retro-footer-actions">
            <button
              type="button"
              className="retro-btn-action"
              style={{ backgroundColor: accentColor }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event);
              }}
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </button>
            <span className="retro-card-index">{indexFormatted}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
