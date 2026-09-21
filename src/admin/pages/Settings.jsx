import React, { useState } from 'react';
import {
  Save,
  User,
  Globe,
  Bell,
  Database,
  KeyRound,
  CheckCircle2,
  Sun,
  Moon,
  Palette,
  Check,
  ShieldCheck,
  Copy
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { currentAdminUser, mockClubSettings } from '../data/mockData';

// ============================================================================
// CLUB & ADMIN SETTINGS PAGE (/admin/settings)
// ============================================================================
// Configuration panel for:
// 1. Theme & Appearance (Light & Dark theme picker)
// 2. Club Website Metadata (Name, affiliation, institution, registration, socials)
// 3. Admin Profile & Password Credentials
// 4. Notifications & Alerts Preferences
// 5. Project PostgreSQL Backend & Database Schemas
// ============================================================================

export default function Settings({ onSaveSettings, theme = 'light', onThemeChange }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [envCopied, setEnvCopied] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: currentAdminUser.name,
    email: currentAdminUser.email,
    role: currentAdminUser.role,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Website Settings Form State
  const [siteSettings, setSiteSettings] = useState({
    ...mockClubSettings,
    socials: {
      instagram: mockClubSettings.socials?.instagram || '',
      linkedin: mockClubSettings.socials?.linkedin || '',
      github: mockClubSettings.socials?.github || ''
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    notifyRegistrations: true,
    notifyMediaUploads: true,
    notifySecurityAlerts: true,
    weeklyDigest: false
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSiteChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setSiteSettings((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value
      }
    }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (onSaveSettings) {
      onSaveSettings({
        profile: profileData,
        site: siteSettings,
        notifications
      });
    }
    triggerSaveNotification();
  };

  const handleCopyEnv = () => {
    const envSnippet = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;
    navigator.clipboard?.writeText(envSnippet).then(() => {
      setEnvCopied(true);
      setTimeout(() => setEnvCopied(false), 2500);
    }).catch(() => {
      setEnvCopied(true);
      setTimeout(() => setEnvCopied(false), 2500);
    });
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Settings & Configuration"
        subtitle="Manage administrator profile, club metadata, appearance themes, and backend settings"
      >
        {activeTab === 'appearance' && (
          <span
            className="admin-badge admin-badge-active"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem' }}
          >
            <Check size={14} />
            <span>Active: {theme === 'dark' ? 'Dark Theme' : 'Light Theme (Default)'}</span>
          </span>
        )}

        {activeTab === 'integrations' && (
          <span
            className="admin-badge admin-badge-upcoming"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem' }}
          >
            <Database size={14} />
            <span>PostgreSQL Ready</span>
          </span>
        )}

        {['general', 'profile', 'notifications'].includes(activeTab) && (
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        )}
      </PageHeader>

      {/* Inline Save Success Banner */}
      {saveSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--admin-radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: 'var(--admin-success)',
            animation: 'adminFadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Settings have been saved and applied successfully!
          </span>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1px solid var(--admin-border-subtle)',
          paddingBottom: '0.75rem',
          overflowX: 'auto'
        }}
      >
        <button
          type="button"
          className={`admin-btn admin-btn-sm ${activeTab === 'appearance' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('appearance')}
        >
          <Palette size={14} />
          <span>Theme & Appearance</span>
        </button>

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
          className={`admin-btn admin-btn-sm ${activeTab === 'notifications' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={14} />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          className={`admin-btn admin-btn-sm ${activeTab === 'integrations' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('integrations')}
        >
          <Database size={14} />
          <span>PostgreSQL & Schemas</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. APPEARANCE & THEME TAB */}
      {/* ==================================================================== */}
      {activeTab === 'appearance' && (
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--admin-text-title)', margin: 0 }}>
                Admin Panel Color Theme
              </h3>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                Select your preferred visual theme for the Technospark CMS. Your choice is remembered across sessions.
              </p>
            </div>
            <span className="admin-badge admin-badge-active">
              Current: {theme === 'dark' ? 'Dark Theme' : 'Light Theme (Default)'}
            </span>
          </div>

          <div className="admin-theme-grid">
            {/* Light Mode Card */}
            <div
              className={`admin-theme-card ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange && onThemeChange('light')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onThemeChange && onThemeChange('light'); }}
            >
              <div className="admin-theme-preview admin-theme-preview-light">
                <div className="preview-sidebar" />
                <div className="preview-content">
                  <div className="preview-bar" style={{ width: '40%' }} />
                  <div className="preview-box" />
                  <div className="preview-box" />
                </div>
              </div>

              <div className="admin-theme-card-header">
                <div className="admin-theme-card-title">
                  <Sun size={18} color="var(--admin-blue-primary)" />
                  <span>Light Theme (Current Default)</span>
                </div>
                {theme === 'light' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--admin-blue-primary)', fontWeight: 700 }}>
                    <Check size={14} /> Active
                  </span>
                )}
              </div>

              <p className="admin-theme-card-desc">
                Crisp pure white surfaces, soft ice-blue page background, and vibrant Royal Blue accents.
              </p>
            </div>

            {/* Dark Mode Card */}
            <div
              className={`admin-theme-card ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange && onThemeChange('dark')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onThemeChange && onThemeChange('dark'); }}
            >
              <div className="admin-theme-preview admin-theme-preview-dark">
                <div className="preview-sidebar" />
                <div className="preview-content">
                  <div className="preview-bar" style={{ width: '40%' }} />
                  <div className="preview-box" />
                  <div className="preview-box" />
                </div>
              </div>

              <div className="admin-theme-card-header">
                <div className="admin-theme-card-title">
                  <Moon size={18} color="var(--admin-sky-blue)" />
                  <span>Dark Theme</span>
                </div>
                {theme === 'dark' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--admin-sky-blue)', fontWeight: 700 }}>
                    <Check size={14} /> Active
                  </span>
                )}
              </div>

              <p className="admin-theme-card-desc">
                Deep royal navy background with midnight blue cards and high-visibility sky-blue glow highlights.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. CLUB WEBSITE INFO TAB */}
      {/* ==================================================================== */}
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
                value={siteSettings.clubName || ''}
                onChange={handleSiteChange}
                className="admin-form-input"
                placeholder="e.g. TECHNOSPARK"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Full Entity Name</label>
              <input
                type="text"
                name="fullName"
                value={siteSettings.fullName || ''}
                onChange={handleSiteChange}
                className="admin-form-input"
                placeholder="Full official entity title"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Club Tagline</label>
            <input
              type="text"
              name="tagline"
              value={siteSettings.tagline || ''}
              onChange={handleSiteChange}
              className="admin-form-input"
              placeholder="e.g. WHERE IDEAS MEET TECHNOLOGY."
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Parent Affiliation</label>
              <input
                type="text"
                name="affiliation"
                value={siteSettings.affiliation || ''}
                onChange={handleSiteChange}
                className="admin-form-input"
                placeholder="e.g. Information Technology Students Association (ITSA)"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Host Institution</label>
              <input
                type="text"
                name="institution"
                value={siteSettings.institution || ''}
                onChange={handleSiteChange}
                className="admin-form-input"
                placeholder="e.g. Pimpri Chinchwad College of Engineering (PCCOE)"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Official Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={siteSettings.contactEmail || ''}
                onChange={handleSiteChange}
                className="admin-form-input"
                placeholder="technospark@pccoepune.org"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Registration Status</label>
              <select
                name="registrationStatus"
                value={siteSettings.registrationStatus || 'open'}
                onChange={handleSiteChange}
                className="admin-form-select"
              >
                <option value="open">Open (Accepting Registrations)</option>
                <option value="closed">Closed (Event Registrations Paused)</option>
              </select>
            </div>
          </div>

          {/* Social Media Links */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--admin-border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--admin-text-title)', marginTop: 0, marginBottom: '0.75rem' }}>
              Social Media Handles & Links
            </h4>
            <div className="admin-form-row-3">
              <div className="admin-form-group">
                <label className="admin-form-label">Instagram URL</label>
                <input
                  type="url"
                  value={siteSettings.socials?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">LinkedIn URL</label>
                <input
                  type="url"
                  value={siteSettings.socials?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">GitHub URL</label>
                <input
                  type="url"
                  value={siteSettings.socials?.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>

          {/* Maintenance Mode Toggle */}
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--admin-radius-md)', backgroundColor: 'var(--admin-card-subtle)', border: '1px solid var(--admin-border-subtle)' }}>
            <div
              className="admin-toggle-wrapper"
              onClick={() => setSiteSettings((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
            >
              <div className={`admin-toggle-switch ${siteSettings.maintenanceMode ? 'checked' : ''}`}>
                <div className="admin-toggle-knob" />
              </div>
              <div>
                <div className="admin-toggle-label" style={{ fontWeight: 600 }}>
                  Maintenance Mode
                </div>
                <span className="admin-form-hint">
                  Temporarily display a maintenance banner on the public portal.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              <Save size={15} />
              <span>Save Website Details</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* 3. ADMIN PROFILE & CREDENTIALS TAB */}
      {/* ==================================================================== */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="text"
                name="role"
                value={profileData.role}
                disabled
                className="admin-form-input"
                style={{ opacity: 0.7, cursor: 'not-allowed', maxWidth: '300px' }}
              />
              <span className="admin-badge admin-badge-active">
                <ShieldCheck size={12} /> {profileData.role}
              </span>
            </div>
            <span className="admin-form-hint">
              Roles and permissions are managed under the Admin Users screen.
            </span>
          </div>

          {/* Change Password Sub-section */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--admin-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <KeyRound size={16} color="var(--admin-blue-primary)" />
              <h4 style={{ fontSize: '0.95rem', color: 'var(--admin-text-title)', margin: 0 }}>
                Change Password
              </h4>
            </div>

            <div className="admin-form-row-3">
              <div className="admin-form-group">
                <label className="admin-form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleProfileChange}
                  className="admin-form-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleProfileChange}
                  className="admin-form-input"
                  placeholder="Min 8 characters"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleProfileChange}
                  className="admin-form-input"
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              <Save size={15} />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* 4. NOTIFICATIONS & ALERTS TAB */}
      {/* ==================================================================== */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-title)', marginTop: 0, marginBottom: '0.5rem' }}>
            Notifications & System Alerts
          </h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginTop: 0, marginBottom: '1.25rem' }}>
            Configure how and when you receive automated alerts regarding Technospark events and content.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--admin-radius-md)',
                backgroundColor: 'var(--admin-card-subtle)',
                border: '1px solid var(--admin-border-subtle)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--admin-text-title)', fontSize: '0.9rem' }}>
                  Event Registrations
                </div>
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  Send an email alert whenever a participant registers for an upcoming event.
                </div>
              </div>
              <div
                className="admin-toggle-wrapper"
                onClick={() => handleNotificationToggle('notifyRegistrations')}
              >
                <div className={`admin-toggle-switch ${notifications.notifyRegistrations ? 'checked' : ''}`}>
                  <div className="admin-toggle-knob" />
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--admin-radius-md)',
                backgroundColor: 'var(--admin-card-subtle)',
                border: '1px solid var(--admin-border-subtle)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--admin-text-title)', fontSize: '0.9rem' }}>
                  Gallery & Media Submissions
                </div>
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  Notify me when new photos or media clips are uploaded to the event gallery.
                </div>
              </div>
              <div
                className="admin-toggle-wrapper"
                onClick={() => handleNotificationToggle('notifyMediaUploads')}
              >
                <div className={`admin-toggle-switch ${notifications.notifyMediaUploads ? 'checked' : ''}`}>
                  <div className="admin-toggle-knob" />
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--admin-radius-md)',
                backgroundColor: 'var(--admin-card-subtle)',
                border: '1px solid var(--admin-border-subtle)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--admin-text-title)', fontSize: '0.9rem' }}>
                  Security & Admin Logins
                </div>
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  Receive alerts when a new administrator sign-in or permission change occurs.
                </div>
              </div>
              <div
                className="admin-toggle-wrapper"
                onClick={() => handleNotificationToggle('notifySecurityAlerts')}
              >
                <div className={`admin-toggle-switch ${notifications.notifySecurityAlerts ? 'checked' : ''}`}>
                  <div className="admin-toggle-knob" />
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--admin-radius-md)',
                backgroundColor: 'var(--admin-card-subtle)',
                border: '1px solid var(--admin-border-subtle)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--admin-text-title)', fontSize: '0.9rem' }}>
                  Weekly Analytics Digest
                </div>
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  Receive an automated weekly recap of registration totals and web portal activity.
                </div>
              </div>
              <div
                className="admin-toggle-wrapper"
                onClick={() => handleNotificationToggle('weeklyDigest')}
              >
                <div className={`admin-toggle-switch ${notifications.weeklyDigest ? 'checked' : ''}`}>
                  <div className="admin-toggle-knob" />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              <Save size={15} />
              <span>Save Notification Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* 5. POSTGRESQL & BACKEND SCHEMAS TAB */}
      {/* ==================================================================== */}
      {activeTab === 'integrations' && (
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-title)', margin: 0 }}>
              Project PostgreSQL Database Schemas
            </h3>
            <span className="admin-badge admin-badge-active">
              Synced with Forms
            </span>
          </div>

          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            The admin panel forms and data management workflows are fully calibrated to match your project's exact <strong>PostgreSQL</strong> table schemas.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
            {/* Callout 1: Env Variables */}
            <div
              className="admin-callout-box"
              style={{
                padding: '1rem',
                borderRadius: 'var(--admin-radius-md)',
                backgroundColor: 'var(--admin-card-subtle)',
                border: '1px solid var(--admin-border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--admin-blue-primary)', fontSize: '0.9rem' }}>
                  1. Environment Connection Strings (.env)
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  onClick={handleCopyEnv}
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                >
                  {envCopied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{envCopied ? 'Copied!' : 'Copy Snippet'}</span>
                </button>
              </div>

              <pre
                style={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  background: '#07152E',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#BAE6FD',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  overflowX: 'auto',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}
              >
                <code>
                  {`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                </code>
              </pre>
            </div>

            {/* Callout 2: Database Tables */}
            <div
              className="admin-callout-box"
              style={{
                padding: '1rem',
                borderRadius: 'var(--admin-radius-md)',
                backgroundColor: 'var(--admin-card-subtle)',
                border: '1px solid var(--admin-border-subtle)'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--admin-blue-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                2. Active PostgreSQL Table Schemas
              </div>
              <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0, fontSize: '0.85rem', color: 'var(--admin-text-main)', lineHeight: 1.8 }}>
                <li>
                  <code>public.events</code>: (id [uuid, PK], name [varchar NOT NULL], category [varchar], event_date [date], start_time [time], end_time [time], venue [varchar NOT NULL])
                </li>
                <li>
                  <code>public.organizers</code>: (id [bigint, PK], Name [varchar NOT NULL], role [varchar], linkedin [text], image [text])
                </li>
                <li>
                  <code>public.admin_users</code>: (id [bigint, PK], name [varchar NOT NULL], role [varchar NOT NULL], last_active [timestamp])
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
