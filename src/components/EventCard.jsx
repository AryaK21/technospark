import React, { useRef } from 'react';
import use3DTilt from '../hooks/use3DTilt';

// ============================================================================
// EVENT CARD COMPONENT (Spiderverse Overhaul)
// ============================================================================
// 3D Tilt card with Spiderverse neon borders, category pills, and action arrow.
// ============================================================================

export default function EventCard({ event, onSelect }) {
  const cardRef = useRef(null);
  use3DTilt(cardRef, { max: 12, perspective: 1000, scale: 1.03 });

  return (
    <article
      ref={cardRef}
      className="ref-comic-event-card tilt-3d-card"
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
      {/* 1. Top Header Block with Solid Fill Color */}
      <div
        className="ref-card-header-block"
        style={{ backgroundColor: event.headerColor || '#F59E0B' }}
      >
        <span className="ref-header-eyebrow">
          {event.headerCategory || event.category?.toUpperCase() || 'EVENT SPRINT'}
        </span>
        <h3 className="ref-header-title">
          {event.title}
        </h3>
      </div>

      {/* 2. Middle Media Preview Image Wrapper */}
      <div className="ref-card-media-block">
        <img
          src={event.image || '/assets/images/event_hackathon_banner.jpg'}
          alt={event.title}
          className="ref-card-img"
          loading="lazy"
        />
        <div className="ref-media-matrix-overlay" />
      </div>

      {/* 3. Description Block */}
      <div className="ref-card-desc-block">
        <p className="ref-card-desc-text">
          {event.shortDesc}
        </p>
      </div>

      {/* 4. Bottom Footer Block */}
      <div className="ref-card-footer-panel">
        {/* Tech Stack Pills Row */}
        {event.techStack && event.techStack.length > 0 && (
          <div className="ref-tech-pills-row">
            {event.techStack.map((tech, idx) => (
              <span key={idx} className="ref-tech-pill">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Subtext Label */}
        <div className="ref-subtext-label">
          <span>{event.linkSubtext || 'LIVE + ON THE STORE'}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="ref-action-btn"
          style={{ backgroundColor: event.buttonColor || '#F59E0B' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(event);
          }}
        >
          {event.buttonLabel || 'Infiltrate'}
        </button>

        {/* Bottom Right Card Index Number */}
        <span className="ref-card-index">
          {event.indexNum || '01'}
        </span>
      </div>
    </article>
  );
}
