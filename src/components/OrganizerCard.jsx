import React from 'react';

// ============================================================================
// ORGANIZER CARD COMPONENT
// ============================================================================
// Individual organizer profile card.
//
// Features:
// - Circular portrait photo with subtle scale on hover
// - Organizer Name & Role
// - "View profile" link with interactive arrow
// ============================================================================

export default function OrganizerCard({ organizer }) {
  return (
    <div className="organizer-card">
      {/* Circular Profile Image */}
      <div className="organizer-avatar-wrapper">
        <img
          src={organizer.image}
          alt={organizer.name}
          className="organizer-avatar-img"
          loading="lazy"
          onError={(e) => {
            // Fallback placeholder if image fails to load
            e.currentTarget.src = '/assets/images/akshat.jpg';
          }}
        />
        <div className="organizer-avatar-ring" aria-hidden="true" />
      </div>

      {/* Info: Name & Role */}
      <div className="organizer-info">
        <h3 className="organizer-name">{organizer.name}</h3>
        <p className="organizer-role">{organizer.role}</p>
      </div>

      {/* View Profile Action Link */}
      <a
        href={organizer.profile}
        target="_blank"
        rel="noopener noreferrer"
        className="organizer-profile-link"
        aria-label={`View ${organizer.name}'s profile`}
      >
        <span>View profile</span>
        <svg
          className="organizer-link-arrow"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    </div>
  );
}
