import React, { useRef } from 'react';
import use3DTilt from '../hooks/use3DTilt';

// ============================================================================
// ORGANIZER CARD COMPONENT (Comic Reference Theme - No Images)
// ============================================================================
// Uses the exact reference comic card theme with solid accent header,
// italic titles, comic borders, social buttons, and index numbers!
// ============================================================================

export default function OrganizerCard({ organizer }) {
  const cardRef = useRef(null);
  use3DTilt(cardRef, { max: 12, perspective: 1000, scale: 1.03 });

  const isTBD = organizer.name === "TO BE ANNOUNCED";

  return (
    <article
      ref={cardRef}
      className="ref-comic-event-card tilt-3d-card"
      tabIndex={0}
      role="article"
      aria-label={`Organizer Profile: ${organizer.name}`}
    >
      {/* 1. Top Header Block with Solid Accent Fill Color */}
      <div
        className="ref-card-header-block"
        style={{ backgroundColor: organizer.headerColor || '#00F0FF' }}
      >
        <span className="ref-header-eyebrow">
          {organizer.headerCategory || 'CORE EXECUTIVE'}
        </span>
        <h3 className="ref-header-title">
          {organizer.name}
        </h3>
      </div>

      {/* 2. Middle Role Content Block (No Image) */}
      <div className="ref-card-desc-block">
        <span className="ref-header-eyebrow" style={{ color: '#00F0FF', marginBottom: '6px' }}>
          DESIGNATION / ROLE
        </span>
        <p className="ref-card-desc-text" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
          {organizer.role}
        </p>
      </div>

      {/* 3. Bottom Footer Panel with Social Buttons & Index Number */}
      <div className="ref-card-footer-panel">
        <div className="ref-subtext-label">
          <span>{isTBD ? 'RESERVED SLOT 🔒' : 'SOCIAL PROFILES ↗'}</span>
        </div>

        {!isTBD ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            {organizer.linkedin && (
              <a
                href={organizer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-action-btn"
                style={{ backgroundColor: organizer.buttonColor || '#00F0FF', textDecoration: 'none', padding: '6px 14px', fontSize: '0.78rem' }}
              >
                LinkedIn
              </a>
            )}
            {organizer.github && (
              <a
                href={organizer.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-action-btn"
                style={{ backgroundColor: '#FFFFFF', textDecoration: 'none', padding: '6px 14px', fontSize: '0.78rem' }}
              >
                GitHub
              </a>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="ref-action-btn"
            style={{ backgroundColor: organizer.buttonColor || '#F43F5E', cursor: 'not-allowed', opacity: 0.8 }}
            disabled
          >
            TBA
          </button>
        )}

        {/* Index Number */}
        <span className="ref-card-index">
          {organizer.indexNum || '01'}
        </span>
      </div>
    </article>
  );
}




