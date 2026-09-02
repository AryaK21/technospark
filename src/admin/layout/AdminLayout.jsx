import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

// ============================================================================
// ADMIN MASTER LAYOUT SHELL
// ============================================================================
// Wraps all admin routes (/admin, /admin/events, etc.) in a consistent layout:
// - Sticky Sidebar with responsive mobile drawer
// - Contextual Topbar
// - Viewport for subroute page content
// - Universal Toast notifications and Confirmation Dialogs
// ============================================================================

export default function AdminLayout({ toast, setToast }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // =========================================================================
    // FUTURE SUPABASE AUTH LOGOUT:
    // await supabase.auth.signOut();
    // navigate('/login');
    // =========================================================================
    if (setToast) {
      setToast({
        id: Date.now(),
        type: 'info',
        message: 'Sign out simulated. In production, Supabase Auth session will terminate.'
      });
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-layout-shell">
        {/* Responsive Sidebar */}
        <AdminSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />

        {/* Main Content Column */}
        <div className="admin-main-wrapper">
          {/* Top Bar */}
          <AdminTopbar
            onOpenMobile={() => setIsMobileOpen(true)}
          />

          {/* Page Content Viewport */}
          <main className="admin-content-viewport">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign Out of Admin Panel"
        message="Are you sure you want to sign out of the Technospark CMS?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        isDanger={false}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* Toast Feedback */}
      {toast && (
        <div className="admin-toast-container">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
