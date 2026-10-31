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
  ExternalLink,
  Lock,
  MessageSquare
} from 'lucide-react';
import { clubInfo } from '../../data/clubInfo';

// ============================================================================
// ADMIN SIDEBAR NAVIGATION COMPONENT (ROLE-AWARE)
// ============================================================================
// - Administrator: Full access to all modules (including Queries, Admin Users, Settings).
// - Editor: Allowed access to Events, Gallery, and Dashboard.
//   Restricted modules (Queries, Organizers, Admin Users, Settings) are locked with an "Admin" badge.
// ============================================================================

export default function AdminSidebar({
  currentUser,
  queriesCount = 0,
  isMobileOpen,
  onCloseMobile,
  onLogoutClick,
  onRestrictedClick
}) {
  const navigate = useNavigate();
  const isAdministrator = currentUser?.role === 'Administrator';

  const navLinks = [
    {
      label: 'Dashboard',
      path: '/admin',
      end: true,
      icon: LayoutDashboard,
      adminOnly: false
    },
    {
      label: 'Events',
      path: '/admin/events',
      icon: Calendar,
      adminOnly: false
    },
    {
      label: 'Queries',
      path: '/admin/queries',
      icon: MessageSquare,
      adminOnly: true // Only Administrator role
    },
    {
      label: 'Organizers',
      path: '/admin/organizers',
      icon: Users,
      adminOnly: true
    },
    {
      label: 'Gallery',
      path: '/admin/gallery',
      icon: Image,
      adminOnly: false
    },
    {
      label: 'Admin Users',
      path: '/admin/users',
      icon: ShieldCheck,
      adminOnly: true // Only Administrator can view or access
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      adminOnly: true
    }
  ];

  const handleLinkClick = (e, item) => {
    if (item.adminOnly && !isAdministrator) {
      e.preventDefault();
      if (onRestrictedClick) {
        onRestrictedClick(item.label);
      }
      return;
    }
    if (onCloseMobile) onCloseMobile();
  };

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
            <span className="admin-sidebar-brand-badge">
              {isAdministrator ? 'ADMIN CMS' : 'EDITOR CMS'}
            </span>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-label">Management</div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isLocked = item.adminOnly && !isAdministrator;

            if (isLocked) {
              return (
                <div
                  key={item.path}
                  className="admin-nav-item locked"
                  onClick={(e) => handleLinkClick(e, item)}
                  title={`${item.label} requires Administrator privileges`}
                  style={{ cursor: 'not-allowed' }}
                >
                  <Icon className="admin-nav-icon" />
                  <span>{item.label}</span>
                  <span className="admin-lock-badge">
                    <Lock size={10} style={{ marginRight: '2px' }} />
                    Admin
                  </span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={(e) => handleLinkClick(e, item)}
              >
                <Icon className="admin-nav-icon" />
                <span>{item.label}</span>
                {item.label === 'Queries' && isAdministrator && queriesCount > 0 && (
                  <span
                    className="admin-nav-badge"
                    style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.2)',
                      color: '#38BDF8',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      fontWeight: 700
                    }}
                  >
                    {queriesCount}
                  </span>
                )}
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
