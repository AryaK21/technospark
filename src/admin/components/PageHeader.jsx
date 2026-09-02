import React from 'react';

// ============================================================================
// ADMIN PAGE HEADER COMPONENT
// ============================================================================
// Consistent header containing page title, subtitle, and primary action buttons.
//
// Props:
// - title: Main page headline (e.g. "Events Management")
// - subtitle: Secondary description or helper text
// - children: Action buttons (e.g. "+ Add Event", filters, export)
// ============================================================================

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header-info">
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>

      {children && (
        <div className="admin-page-header-actions">
          {children}
        </div>
      )}
    </div>
  );
}
