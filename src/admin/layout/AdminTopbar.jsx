import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { currentAdminUser as fallbackUser } from '../data/mockData';

// ============================================================================
// ADMIN TOPBAR NAVIGATION COMPONENT
// ============================================================================
// Displays contextual page title, system status, active Google profile, and role.
// ============================================================================

export default function AdminTopbar({
  currentUser,
  onOpenMobile,
  theme = 'light',
  onThemeChange,
  onLogoutClick
}) {
  const location = useLocation();

  // Active admin user data
  const admin = currentUser || fallbackUser;
  const avatarUrl = admin.avatarUrl || admin.avatar;
  const displayName = admin.name || 'Admin';
  const roleName = admin.role || 'Editor';

  // Determine page title from current route
  const getPageTitle = (pathname) => {
    if (pathname === '/admin') return 'Dashboard Overview';
    if (pathname.startsWith('/admin/events')) return 'Events Management';
    if (pathname.startsWith('/admin/organizers')) return 'Organizers & Team';
    if (pathname.startsWith('/admin/gallery')) return 'Gallery & Media';
    if (pathname.startsWith('/admin/users')) return 'Admin Access & Requests';
    if (pathname.startsWith('/admin/settings')) return 'Club & Admin Settings';
    return 'Admin Panel';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={onOpenMobile}
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb / Title */}
        <div className="admin-topbar-breadcrumb">
          <span className="admin-breadcrumb-root">Admin</span>
          <span className="admin-breadcrumb-separator">/</span>
          <span className="admin-breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="admin-topbar-right">
        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          className="admin-btn-icon"
          onClick={() => onThemeChange && onThemeChange(theme === 'light' ? 'dark' : 'light')}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle theme mode"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* System Status Indicator */}
        <div className="admin-system-status">
          <span className="admin-status-pulse" />
          <span>{roleName === 'Administrator' ? 'Super Admin' : 'Editor Mode'}</span>
        </div>

        {/* Current Admin User Profile Pill */}
        <div
          className="admin-profile-pill"
          title={`Logged in as ${admin.email || displayName}`}
          onClick={onLogoutClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="admin-avatar-wrapper">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="admin-avatar-img"
              />
            ) : (
              <div className="admin-avatar-fallback">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="admin-user-info">
            <span className="admin-user-name">{displayName}</span>
            <span
              className="admin-user-role"
              style={{
                color: roleName === 'Administrator' ? 'var(--admin-blue-primary)' : 'var(--admin-text-muted)'
              }}
            >
              {roleName}
            </span>
          </div>
          <button
            type="button"
            className="admin-btn-icon"
            style={{ width: '28px', height: '28px', marginLeft: '0.25rem', color: '#94A3B8' }}
            title="Sign Out"
            onClick={(e) => {
              e.stopPropagation();
              if (onLogoutClick) onLogoutClick();
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
