import React, { useState, useEffect } from 'react';
import { ExternalLink, Mail } from 'lucide-react';
import '../styles/team.css';

// ============================================================================
// SPIDER-VERSE COLLECTOR EDITION ORGANIZER & TEAM MEMBER CARD
// ============================================================================

export const DEFAULT_PROFILE_IMAGE = '/assets/images/Default_profile.webp';

const LinkedInIcon = ({ size = 14, className }) => (
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

const GithubIcon = ({ size = 14, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export function OrganizerCard({ organizer = {}, isFaculty = false }) {
  const photoUrl =
    organizer.image || organizer.photo || organizer.fallbackPhoto || DEFAULT_PROFILE_IMAGE;
  const [imgSrc, setImgSrc] = useState(photoUrl);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgSrc(
      organizer.image || organizer.photo || organizer.fallbackPhoto || DEFAULT_PROFILE_IMAGE
    );
    setImgFailed(false);
  }, [organizer.image, organizer.photo, organizer.fallbackPhoto]);

  const accentColor = organizer.accentColor || (isFaculty ? '#F59E0B' : '#00F0FF');
  const roleText = organizer.role || organizer.position || 'Team Member';
  const nameText = organizer.Name || organizer.name || 'Technospark Operative';

  // Generate 2-letter initials for clean comic avatar fallback
  const initials = nameText
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleImgError = () => {
    if (imgSrc !== DEFAULT_PROFILE_IMAGE) {
      setImgSrc(DEFAULT_PROFILE_IMAGE);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <article
      className={`retro-organizer-card ${isFaculty ? 'retro-organizer-card--faculty' : ''}`}
      style={{ '--card-accent': accentColor }}
      tabIndex={0}
      role="article"
      aria-label={`Team Profile: ${nameText}`}
    >
      {/* ── Top Comic Issue Header Strip ─────────────────────────────────── */}
      <div className="org-card-top-bar">
        <span className="org-card-Clearance">
          <span className="org-clearance-dot" />
          {isFaculty ? 'FACULTY ARCHITECT' : organizer.divisionCode || 'CORE OPERATIVE'}
        </span>

        <span className="org-corner-badge">
          #{organizer.indexNum || (organizer.tag ? organizer.tag.slice(0, 4) : 'TS')}
        </span>
      </div>

      {/* ── Card Inner Content ───────────────────────────────────────────── */}
      <div className="org-card-inner-body">
        {/* 1. Centered Circular Profile Picture */}
        <div className="org-center-avatar-wrap">
          <div className="org-center-avatar-ring">
            {!imgFailed && imgSrc ? (
              <img
                src={imgSrc}
                alt={nameText}
                className="org-center-avatar-img"
                loading="lazy"
                onError={handleImgError}
              />
            ) : (
              <div className="org-avatar-fallback">{initials || 'TS'}</div>
            )}
          </div>
        </div>

        {/* 2. Name Underneath */}
        <h3 className="org-center-name">{nameText}</h3>

        {/* 3. Subtle Centered Accent Divider Line */}
        <div className="org-center-divider" />

        {/* 4. Position / Role Underneath */}
        <div className="org-center-role-wrap">
          <span className="org-center-role">{roleText}</span>
          {organizer.team && <span className="org-center-tag-pill">{organizer.team}</span>}
          {organizer.tag && !organizer.team && <span className="org-center-tag-pill">{organizer.tag}</span>}
        </div>

        {/* 5. Action / Social Links */}
        <div className="org-center-btn-wrap">
          {organizer.linkedin && (
            <a
              href={organizer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="org-view-profile-btn"
              aria-label={`View ${nameText}'s profile on LinkedIn`}
            >
              <LinkedInIcon size={14} className="org-btn-icon" />
              <span>Profile</span>
              <ExternalLink size={12} className="org-btn-arrow" />
            </a>
          )}

          {organizer.github && (
            <a
              href={organizer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="org-sub-link-btn"
              aria-label={`${nameText} GitHub`}
              title="GitHub Profile"
            >
              <GithubIcon size={15} />
            </a>
          )}

          {organizer.email && (
            <a
              href={`mailto:${organizer.email}`}
              className="org-sub-link-btn"
              aria-label={`Email ${nameText}`}
              title={`Email ${nameText}`}
            >
              <Mail size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default OrganizerCard;