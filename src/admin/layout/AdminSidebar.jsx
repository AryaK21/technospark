import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { clubInfo } from '../../data/clubInfo';

// ============================================================================
// ADMIN SIDEBAR NAVIGATION COMPONENT
// ============================================================================
// Provides primary desktop and mobile navigation across all admin dashboard modules.
//
// Key Features:
// - Brand identity (Technospark official logo + badge)
// - Active route highlights with brand blue/sky accent indicators
// - Direct link to preview the public website
// - Logout action with confirmation trigger
// ============================================================================

export default function AdminSidebar({ isMobileOpen, onCloseMobile, onLogoutClick }) {
  const navigate = useNavigate();

  const navLinks = [
    {
      label: 'Dashboard',
      path: '/admin',
      end: true,
      icon: LayoutDashboard
    },
    {
      label: 'Events',
      path: '/admin/events',
      icon: Calendar
    },
    {
      label: 'Organizers',
      path: '/admin/organizers',
      icon: Users
    },
    {
      label: 'Gallery',
      path: '/admin/gallery',
      icon: Image
    },
    {
      label: 'Admin Users',
      path: '/admin/users',
      icon: ShieldCheck
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`admin-sidebar-backdrop ${isMobileOpen ? 'mobile-open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <Link to="/admin" className="admin-sidebar-brand" onClick={onCloseMobile}>
          <img
            src={clubInfo.logos?.whiteTransparent || '/assets/logos/logo.jpeg'}
            alt="Technospark Logo"
            className="admin-sidebar-logo-img"
          />
          <div className="admin-sidebar-brand-text">
            <span className="admin-sidebar-brand-title">TECHNOSPARK</span>
            <span className="admin-sidebar-brand-badge">ADMIN CMS</span>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-label">Management</div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onCloseMobile}
              >
                <Icon className="admin-nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          {/* Quick link to preview live public website */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-sidebar-public-link"
            title="Open Public Website in new tab"
          >
            <span>View Public Site</span>
            <ExternalLink size={14} />
          </a>

          {/* Logout Action */}
          {/* // ================================================= */}
          {/* // FUTURE AUTHENTICATION LOGOUT                      */}
          {/* // Later, clicking this will call supabase.auth.signOut() */}
          {/* // ================================================= */}
          <button
            type="button"
            className="admin-sidebar-logout-btn"
            onClick={onLogoutClick}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
