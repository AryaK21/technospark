import React from 'react';

// ============================================================================
// ADMIN BADGE COMPONENT
// ============================================================================
// Standardized visual indicator for item statuses, roles, and categories.
//
// Props:
// - variant: 'upcoming' | 'past' | 'draft' | 'active' | 'inactive' | 'role' | 'default'
// - label: Badge text content
// - showDot: Boolean to display status pulse dot
// ============================================================================

export default function Badge({ variant = 'default', label, showDot = true, children }) {
  const text = label || children;
  const variantClass = `admin-badge-${variant.toLowerCase()}`;

  return (
    <span className={`admin-badge ${variantClass}`}>
      {showDot && <span className="admin-badge-dot" />}
      {text}
    </span>
  );
}
