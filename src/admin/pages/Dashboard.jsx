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
// ADMIN DASHBOARD OVERVIEW PAGE (/admin) — ROLE-AWARE
// ============================================================================

export default function Dashboard({ currentUser, events = mockEvents, onEditEvent }) {
  const navigate = useNavigate();
  const isAdministrator = currentUser?.role === 'Administrator';

  // Pick the latest 4 events for the dashboard preview table
  const recentEvents = events.slice(0, 4);

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title={isAdministrator ? "Admin Dashboard" : "Editor Dashboard"}
        subtitle={
          isAdministrator
            ? "Welcome back to Technospark CMS. Full administrative oversight across all club modules."
            : "Welcome back to Technospark CMS. You have Editor permissions to manage Events and Gallery media."
        }
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
      <div className="admin-stats-grid">
        <StatCard
          title="TOTAL EVENTS"
          value={events.length > 0 ? events.length : mockDashboardStats.events}
          icon={Calendar}
          trend="+ Live on Portal"
          trendType="up"
          subtitle="Flagships, workshops & labs"
        />
        {isAdministrator && (
          <StatCard
            title="TOTAL ORGANIZERS"
            value={mockDashboardStats.organizers}
            icon={Users}
            trend="Core Team"
            trendType="neutral"
            subtitle="Active leads & facilitators"
          />
        )}
        <StatCard
          title="GALLERY ITEMS"
          value={mockDashboardStats.galleryItems}
          icon={ImageIcon}
          trend="Photos & Videos"
          trendType="up"
          subtitle="Event media & highlights"
        />
        {isAdministrator ? (
          <StatCard
            title="ADMIN USERS"
            value={mockDashboardStats.admins}
            icon={ShieldCheck}
            trend="Authorized"
            trendType="neutral"
            subtitle="Manage CMS credentials"
          />
        ) : (
          <StatCard
            title="YOUR PERMISSIONS"
            value="Editor"
            icon={ShieldCheck}
            trend="Active"
            trendType="neutral"
            subtitle="Events & Gallery Form Access"
          />
        )}
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
          {isAdministrator && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => navigate('/admin/organizers?action=new')}
            >
              <Users size={14} />
              <span>Add Organizer</span>
            </button>
          )}
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

          <div className="admin-table-container" style={{ border: 'none', margin: '0 -0.5rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td>
                      <div className="admin-table-title-cell">
                        <span className="admin-table-main-text">{evt.name || evt.title}</span>
                        <span className="admin-table-sub-text">
                          <MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          {evt.venue}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge variant="category" label={evt.category} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                        <Clock size={13} color="var(--admin-text-faint)" />
                        <span>{evt.event_date || evt.date}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn-icon"
                        title="Edit Event"
                        onClick={() => navigate('/admin/events')}
                      >
                        <Edit2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Operational Status Panel */}
        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div className="admin-dashboard-section-header">
            <h2 className="admin-dashboard-section-title">
              <Clock size={18} color="var(--admin-blue-primary)" />
              <span>System & Access Status</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  marginTop: '6px'
                }}
              />
              <div>
                <strong style={{ color: 'var(--admin-text-title)' }}>
                  {isAdministrator ? 'Full Admin CMS Mode' : 'Editor Access Mode'}
                </strong>
                <p style={{ margin: '0.15rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                  {isAdministrator
                    ? 'All modules (Events, Organizers, Gallery, Users & Requests, Settings) enabled.'
                    : 'Permitted to add, edit, and publish Events and Gallery media.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--admin-blue-primary)',
                  marginTop: '6px'
                }}
              />
              <div>
                <strong style={{ color: 'var(--admin-text-title)' }}>Google OAuth Connected</strong>
                <p style={{ margin: '0.15rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                  Authenticated via Supabase Google provider session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
