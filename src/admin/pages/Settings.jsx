import React, { useState } from 'react';
import { Save, User, Globe, Bell, Database, KeyRound, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { currentAdminUser, mockClubSettings } from '../data/mockData';

// ============================================================================
// CLUB & ADMIN SETTINGS PAGE (/admin/settings)
// ============================================================================
// Configuration panel for admin profile, website general information,
// and future Supabase API endpoint indicators.
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // 1. Save profile: await supabase.auth.updateUser({ data: { full_name } });
// // 2. Save site settings: await supabase.from('site_settings').upsert(settings);
// // =========================================================================
// ============================================================================

export default function Settings({ onSaveSettings }) {
  const [activeTab, setActiveTab] = useState('general');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: currentAdminUser.name,
    email: currentAdminUser.email,
    role: currentAdminUser.role
  });

  // Website Settings Form State
  const [siteSettings, setSiteSettings] = useState(mockClubSettings);

  // Notifications State
  const [notifyRegistrations, setNotifyRegistrations] = useState(true);
  const [notifyMediaUploads, setNotifyMediaUploads] = useState(true);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSiteChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings({
        profile: profileData,
        site: siteSettings
      });
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Settings & Configuration"
        subtitle="Manage administrator profile, club metadata, and future database integration"
      >
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
        >
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </PageHeader>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          className={`admin-btn admin-btn-sm ${activeTab === 'general' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('general')}
        >
          <Globe size={14} />
          <span>Club Website Info</span>
        </button>
        <button
          type="button"
          className={`admin-btn admin-btn-sm ${activeTab === 'profile' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={14} />
          <span>Admin Profile</span>
        </button>
        <button
          type="button"
          className={`admin-btn admin-btn-sm ${activeTab === 'integrations' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('integrations')}
        >
          <Database size={14} />
          <span>Backend & Database</span>
        </button>
      </div>

      {/* 1. General Club Settings Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-title)', marginTop: 0, marginBottom: '1.25rem' }}>
            Technospark Club Information
          </h3>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Club Short Name</label>
              <input
                type="text"
                name="clubName"
                value={siteSettings.clubName}
                onChange={handleSiteChange}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Full Entity Name</label>
              <input
                type="text"
                name="fullName"
                value={siteSettings.fullName}
                onChange={handleSiteChange}
                className="admin-form-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Club Tagline</label>
            <input
              type="text"
              name="tagline"
              value={siteSettings.tagline}
              onChange={handleSiteChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Parent Affiliation</label>
              <input
                type="text"
                name="affiliation"
                value={siteSettings.affiliation}
                onChange={handleSiteChange}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Host Institution</label>
              <input
                type="text"
                name="institution"
                value={siteSettings.institution}
                onChange={handleSiteChange}
                className="admin-form-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Official Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={siteSettings.contactEmail}
              onChange={handleSiteChange}
              className="admin-form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              <Save size={15} />
              <span>Save Website Details</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. Admin Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-title)', marginTop: 0, marginBottom: '1.25rem' }}>
            Administrator Profile & Credentials
          </h3>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Administrator Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Login Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="admin-form-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Role / Clearance</label>
            <input
              type="text"
              name="role"
              value={profileData.role}
              disabled
              className="admin-form-input"
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
            <span className="admin-form-hint">
              Roles are managed under the Admin Users screen.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              <Save size={15} />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. Future Backend & Supabase Integration Helper */}
      {activeTab === 'integrations' && (
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-title)', marginTop: 0, marginBottom: '0.75rem' }}>
            Future Supabase Backend Integration Guide
          </h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            The admin panel has been intentionally designed to seamlessly plug into <strong>Supabase</strong> for authentication and relational database storage without requiring UI refactoring.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--admin-navy-card)', border: '1px solid var(--admin-border-subtle)' }}>
              <div style={{ fontWeight: 600, color: 'var(--admin-sky-blue)', marginBottom: '0.35rem' }}>
                1. Required Environment Variables (.env)
              </div>
              <code style={{ display: 'block', padding: '0.5rem', background: '#061229', borderRadius: '6px', fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
              </code>
            </div>

            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--admin-navy-card)', border: '1px solid var(--admin-border-subtle)' }}>
              <div style={{ fontWeight: 600, color: 'var(--admin-accent-orange)', marginBottom: '0.35rem' }}>
                2. Target Database Tables
              </div>
              <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, fontSize: '0.85rem', color: 'var(--admin-text-main)', lineHeight: 1.6 }}>
                <li><code>events</code> (id, title, category, date, venue, status, cover_image)</li>
                <li><code>organizers</code> (id, name, role, bio, image_url, display_order, is_active)</li>
                <li><code>gallery</code> (id, title, media_type, url, associated_event, upload_date)</li>
                <li><code>admin_users</code> / Supabase Auth (email, role, permissions)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
