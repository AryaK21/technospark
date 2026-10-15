import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

// ============================================================================
// ADMIN MASTER LAYOUT SHELL (ROLE & AUTH AWARE)
// ============================================================================

export default function AdminLayout({
  currentUser,
  onLogout,
  toast,
  setToast,
  theme = 'light',
  onThemeChange
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      await onLogout();
    }
  };

  const handleRestrictedClick = (sectionName) => {
    if (setToast) {
      setToast({
        id: Date.now(),
        type: 'error',
        message: `Access Restricted: Only Administrators can view and edit ${sectionName}.`
      });
    }
  };

  return (
    <div className="admin-root" data-theme={theme}>
      <div className="admin-layout-shell">
        {/* Responsive Sidebar */}
        <AdminSidebar
          currentUser={currentUser}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogoutClick={() => setShowLogoutConfirm(true)}
          onRestrictedClick={handleRestrictedClick}
        />

        {/* Main Content Column */}
        <div className="admin-main-wrapper">
          {/* Top Bar */}
          <AdminTopbar
            currentUser={currentUser}
            onOpenMobile={() => setIsMobileOpen(true)}
            theme={theme}
            onThemeChange={onThemeChange}
            onLogoutClick={() => setShowLogoutConfirm(true)}
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
        title="Sign Out of Admin CMS"
        message="Are you sure you want to sign out of your Google administrative session?"
        confirmLabel="Sign Out"
        cancelLabel="Stay Logged In"
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
