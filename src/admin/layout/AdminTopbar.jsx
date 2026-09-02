import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { currentAdminUser } from '../data/mockData';

// ============================================================================
// ADMIN TOPBAR NAVIGATION COMPONENT
// ============================================================================
// Displays the contextual page title, system status, and current administrator profile.
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // This user information will eventually come from Supabase Auth:
// // const { data: { user } } = await supabase.auth.getUser();
// // =========================================================================
// ============================================================================

export default function AdminTopbar({ onOpenMobile }) {
  const location = useLocation();

  // Determine page title from current route
  const getPageTitle = (pathname) => {
    if (pathname === '/admin') return 'Dashboard Overview';
    if (pathname.startsWith('/admin/events')) return 'Events Management';
    if (pathname.startsWith('/admin/organizers')) return 'Organizers & Team';
    if (pathname.startsWith('/admin/gallery')) return 'Gallery & Media';
    if (pathname.startsWith('/admin/users')) return 'Admin Access';
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
        {/* System Status Indicator */}
        <div className="admin-system-status">
          <span className="admin-status-pulse" />
          <span>CMS Ready</span>
        </div>

        {/* Current Admin User Profile Pill */}
        {/* This user information will eventually come from Supabase Auth. */}
        <div className="admin-profile-pill" title={`Logged in as ${currentAdminUser.email}`}>
          <div className="admin-avatar-wrapper">
            {currentAdminUser.avatar ? (
              <img
                src={currentAdminUser.avatar}
                alt={currentAdminUser.name}
                className="admin-avatar-img"
              />
            ) : (
              <div className="admin-avatar-fallback">
                {currentAdminUser.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="admin-user-info">
            <span className="admin-user-name">{currentAdminUser.name}</span>
            <span className="admin-user-role">{currentAdminUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
