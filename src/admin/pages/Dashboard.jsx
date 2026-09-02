import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Image as ImageIcon,
  ShieldCheck,
  Plus,
  ArrowRight,
  UploadCloud,
  Edit2,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { mockDashboardStats, mockEvents } from '../data/mockData';

// ============================================================================
// ADMIN DASHBOARD OVERVIEW PAGE (/admin)
// ============================================================================
// Main landing screen for authenticated club administrators.
// Provides a high-level summary of website contents, quick creation actions,
// and a feed of recent events.
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // 1. Replace `mockDashboardStats` with Supabase aggregate RPC / count queries.
// // 2. Replace `mockEvents` with `supabase.from('events').select('*').limit(5)`.
// // =========================================================================
// ============================================================================

export default function Dashboard({ events = mockEvents, onEditEvent }) {
  const navigate = useNavigate();

  // Pick the latest 4 events for the dashboard preview table
  const recentEvents = events.slice(0, 4);

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Admin Dashboard"
        subtitle="Welcome back to Technospark CMS. Here is what is happening across your club portal."
      >
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/admin/events?action=new')}
        >
          <Plus size={16} />
          <span>New Event</span>
        </button>
      </PageHeader>

      {/* 1. Primary Metrics / Stat Cards */}
      {/* These values are centralized in mockData.js and will later come from Supabase queries */}
      <div className="admin-stats-grid">
        <StatCard
          title="TOTAL EVENTS"
          value={mockDashboardStats.events}
          icon={Calendar}
          trend="+2 Upcoming"
          trendType="up"
          subtitle="Flagships, workshops & labs"
        />
        <StatCard
          title="TOTAL ORGANIZERS"
          value={mockDashboardStats.organizers}
          icon={Users}
          trend="Core Team"
          trendType="neutral"
          subtitle="Active leads & facilitators"
        />
        <StatCard
          title="GALLERY ITEMS"
          value={mockDashboardStats.galleryItems}
          icon={ImageIcon}
          trend="Photos & Videos"
          trendType="up"
          subtitle="Event media & highlights"
        />
        <StatCard
          title="ADMIN USERS"
          value={mockDashboardStats.admins}
          icon={ShieldCheck}
          trend="Authorized"
          trendType="neutral"
          subtitle="Manage CMS credentials"
        />
      </div>

      {/* 2. Quick Actions Bar */}
      <div className="admin-quick-actions-bar">
        <div className="admin-quick-actions-label">
          <Sparkles size={18} />
          <span>Quick Actions</span>
        </div>
        <div className="admin-quick-actions-btns">
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => navigate('/admin/events?action=new')}
          >
            <Plus size={14} />
            <span>Add Event</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => navigate('/admin/organizers?action=new')}
          >
            <Users size={14} />
            <span>Add Organizer</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => navigate('/admin/gallery?action=upload')}
          >
            <UploadCloud size={14} />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* 3. Dashboard Split Content (Recent Events & Recent Activity) */}
      <div className="admin-dashboard-split-grid">
        {/* Recent Events Table */}
        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div className="admin-dashboard-section-header">
            <h2 className="admin-dashboard-section-title">
              <Calendar size={18} color="var(--admin-sky-blue)" />
              <span>Recent Events</span>
            </h2>
            <Link
              to="/admin/events"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrapper" style={{ border: 'none' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td>
                      <div className="admin-table-title-cell">
                        <span className="admin-table-main-text">{evt.title}</span>
                        <span className="admin-table-sub-text">{evt.category}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                        <Clock size={13} color="var(--admin-text-faint)" />
                        <span>{evt.date}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <MapPin size={13} color="var(--admin-text-faint)" />
                        <span title={evt.venue}>{evt.venue}</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={evt.status} label={evt.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-icon"
                        title="Edit event"
                        onClick={() => {
                          if (onEditEvent) {
                            onEditEvent(evt);
                          } else {
                            navigate(`/admin/events?edit=${evt.id}`);
                          }
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System & Activity Overview */}
        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div className="admin-dashboard-section-header">
            <h2 className="admin-dashboard-section-title">
              <Sparkles size={18} color="var(--admin-accent-orange)" />
              <span>CMS Activity</span>
            </h2>
          </div>

          <div className="admin-activity-list">
            <div className="admin-activity-item">
              <div className="admin-activity-dot" style={{ backgroundColor: 'var(--admin-sky-blue)' }} />
              <div className="admin-activity-content">
                <span className="admin-activity-text">
                  <strong>TECHNOVA Hackathon</strong> registration link updated by Prabodh.
                </span>
                <span className="admin-activity-time">25 mins ago</span>
              </div>
            </div>

            <div className="admin-activity-item">
              <div className="admin-activity-dot" style={{ backgroundColor: 'var(--admin-accent-orange)' }} />
              <div className="admin-activity-content">
                <span className="admin-activity-text">
                  <strong>2 new video highlights</strong> uploaded to Gallery media pool.
                </span>
                <span className="admin-activity-time">2 hours ago</span>
              </div>
            </div>

            <div className="admin-activity-item">
              <div className="admin-activity-dot" style={{ backgroundColor: 'var(--admin-success)' }} />
              <div className="admin-activity-content">
                <span className="admin-activity-text">
                  <strong>Practical AI Lab</strong> venue set to Computing Lab 3.
                </span>
                <span className="admin-activity-time">Yesterday</span>
              </div>
            </div>

            <div className="admin-activity-item">
              <div className="admin-activity-dot" style={{ backgroundColor: 'var(--admin-blue-primary)' }} />
              <div className="admin-activity-content">
                <span className="admin-activity-text">
                  New organizer <strong>Adarsh Thakare</strong> assigned to Web Facilitator role.
                </span>
                <span className="admin-activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
