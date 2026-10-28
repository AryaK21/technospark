import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Calendar } from 'lucide-react';
import { CATEGORY_ACCENT_COLORS } from './EventCard';

// ============================================================================
// RETRO-COMIC / NEO-BRUTALIST EVENT MODAL POPUP
// ============================================================================
// Aligned with the retro-comic card styling:
// - Mounted directly to document.body via createPortal so it is 100% viewport-centered
// - Completely transparent backdrop (no blur, no dark wash)
// - Warm cream paper container (#FAF7F2) with 3px solid black border & 6px hard shadow
// - Header banner with accent color, black pills, and chunky retro close button
// - Retro venue box and chunky black-bordered action buttons
// - 100% content preserved from original modal
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

  const isPast = event.status === 'past';
  const categoryKey = event.category || 'Workshop';
  const accentColor = CATEGORY_ACCENT_COLORS[categoryKey] || '#A78BFA';

  return createPortal(
    <div
      className="retro-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
    >
      <div
        className="retro-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header Banner: Accent Background & Retro Close ─────────── */}
        <div
          className="retro-modal-header"
          style={{ backgroundColor: accentColor }}
        >
          <div className="retro-modal-header-tags">
            <span className="retro-black-pill">{event.category}</span>
            {event.badge && (
              <span className="retro-black-pill">{event.badge}</span>
            )}
            <span className="retro-black-pill">
              {isPast ? 'Past Event' : 'Upcoming'}
            </span>
          </div>

          <button
            type="button"
            className="retro-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal window"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Modal Body: Title, About, When & Venue ─────────────────────── */}
        <div className="retro-modal-body">
          <h2 id="modal-event-title" className="retro-modal-title">
            {event.title}
          </h2>

          {/* Section: ABOUT THIS EVENT */}
          <div className="retro-modal-section">
            <h4 className="retro-modal-subtitle">ABOUT THIS EVENT</h4>
            <p className="retro-modal-desc">{event.fullDesc || event.shortDesc}</p>
          </div>

          {/* Section: WHEN AND VENUE */}
          <div className="retro-modal-section">
            <h4 className="retro-modal-subtitle">WHEN AND VENUE</h4>
            <div className="retro-modal-venue-box">
              <div className="retro-venue-line">
                <MapPin size={15} className="retro-venue-icon" />
                <span>{event.location}</span>
              </div>
              <div className="retro-date-line">
                <Calendar size={15} className="retro-venue-icon" />
                <span>{event.date} • {event.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal Footer: Action Buttons ───────────────────────────────── */}
        <div className="retro-modal-footer">
          <button
            type="button"
            className="retro-btn-modal retro-btn-modal-close"
            onClick={onClose}
          >
            Close Window
          </button>
          {!isPast && (
            <a
              href="mailto:technospark@pccoepune.org?subject=Inquiry regarding Event"
              className="retro-btn-modal retro-btn-modal-action"
              style={{ backgroundColor: accentColor }}
            >
              Contact Coordinators
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
