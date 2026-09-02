import React from 'react';

// ============================================================================
// ADMIN STAT CARD COMPONENT
// ============================================================================
// Displays a top-level key performance metric on the /admin dashboard.
//
// Props:
// - title: Label for the statistic (e.g. "TOTAL EVENTS")
// - value: Number or string value (e.g. 12)
// - icon: Lucide Icon component
// - trend: Trend text / percentage (e.g. "+2 this month" or "Live")
// - trendType: 'up' | 'neutral'
// - subtitle: Secondary explanatory detail
// ============================================================================

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up',
  subtitle
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <div className="admin-stat-icon-box">
          {Icon && <Icon size={22} />}
        </div>
        {trend && (
          <div className={`admin-stat-trend ${trendType === 'up' ? 'admin-trend-up' : 'admin-trend-neutral'}`}>
            {trend}
          </div>
        )}
      </div>

      <div className="admin-stat-value">{value}</div>

      <div>
        <div className="admin-stat-label">{title}</div>
        {subtitle && <div className="admin-form-hint" style={{ marginTop: '3px' }}>{subtitle}</div>}
      </div>
    </div>
  );
}
