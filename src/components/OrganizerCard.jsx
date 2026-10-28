import React from 'react';
import { ExternalLink } from 'lucide-react';

// ============================================================================
// CENTERED EXPERIMENTAL RETRO-BRUTALIST ORGANIZER CARD
// ============================================================================
// Supports split testing:
// - variant="tinted"  -> Option 3: Color-Tinted Dark Obsidian with Persona Glow
// - variant="frosted" -> Option 4: Translucent Frosted Cyber Glass
// ============================================================================

const LinkedInIcon = ({ size = 15, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.45 1.45 0 0 0-1.45-1.45 1.45 1.45 0 0 0-1.45 1.45c0 .8.65 1.45 1.45 1.45m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

export default function OrganizerCard({ organizer }) {
  const accentColor = organizer.accentColor || '#00F0FF';

  return (
    <article
      className="retro-organizer-card retro-organizer-card--centered retro-card--frosted"
      style={{
        '--card-accent': accentColor
      }}
      tabIndex={0}
      role="article"
      aria-label={`Organizer Profile: ${organizer.name}`}
    >
      {/* ── Top Corner Index Badge ───────────────────────────────────────── */}
      <span className="org-corner-badge">
        #{organizer.indexNum || '01'}
      </span>

      {/* ── 1. Centered Circular Profile Picture ─────────────────────────── */}
      <div className="org-center-avatar-wrap">
        <div className="org-center-avatar-ring">
          <img
            src={organizer.photo}
            alt={organizer.name}
            className="org-center-avatar-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.classList.add('org-avatar-fallback');
              e.currentTarget.parentElement.innerText = organizer.name.charAt(0);
            }}
          />
        </div>
      </div>

      {/* ── 2. Name Underneath ───────────────────────────────────────────── */}
      <h3 className="org-center-name">{organizer.name}</h3>

      {/* ── 3. Subtle Centered Accent Divider Line ───────────────────────── */}
      <div className="org-center-divider" />

      {/* ── 4. Position / Role Underneath ────────────────────────────────── */}
      <div className="org-center-role-wrap">
        <span className="org-center-role">{organizer.role}</span>
        {organizer.tag && (
          <span className="org-center-tag-pill">{organizer.tag}</span>
        )}
      </div>

      {/* ── 5. Centered "View Profile" Button (To LinkedIn) ─────────────── */}
      <div className="org-center-btn-wrap">
        <a
          href={organizer.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="org-view-profile-btn"
          aria-label={`View ${organizer.name}'s profile on LinkedIn`}
        >
          <LinkedInIcon size={15} className="org-btn-icon" />
          <span>View Profile</span>
          <ExternalLink size={13} className="org-btn-arrow" />
        </a>
      </div>
    </article>
  );
}
