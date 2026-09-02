import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Admin Layout
import AdminLayout from './layout/AdminLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Organizers from './pages/Organizers';
import Gallery from './pages/Gallery';
import AdminUsers from './pages/AdminUsers';
import Settings from './pages/Settings';

// Mock Data
import {
  mockEvents as initialEvents,
  mockOrganizers as initialOrganizers,
  mockGallery as initialGallery,
  mockAdminUsers as initialAdminUsers,
  mockClubSettings
} from './data/mockData';

// Scoped Admin Stylesheets
import './styles/admin.css';
import './styles/sidebar.css';
import './styles/topbar.css';
import './styles/dashboard.css';
import './styles/tables.css';
import './styles/forms.css';
import './styles/gallery.css';

// ============================================================================
// FUTURE AUTHENTICATION / SUPABASE AUTH GUARD
// ============================================================================
// TODO: Protect all /admin routes using Supabase authentication
// and verify that the logged-in user has admin/editor permissions.
//
// Example AuthGuard implementation:
// function AdminAuthGuard({ children }) {
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setLoading(false);
//     });
//   }, []);
//
//   if (loading) return <div>Loading...</div>;
//   if (!session) return <Navigate to="/login" replace />;
//   return children;
// }
// ============================================================================

export default function AdminApp() {
  const navigate = useNavigate();

  // Active state for events, organizers, gallery, and admin users
  // Initialized with mockData.js so adding/editing/deleting reacts in real-time.
  const [events, setEvents] = useState(initialEvents);
  const [organizers, setOrganizers] = useState(initialOrganizers);
  const [gallery, setGallery] = useState(initialGallery);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({
      id: Date.now(),
      message,
      type
    });
  };

  // Event Handlers
  const handleAddEvent = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`Event "${newEvent.title}" published successfully!`);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    showToast(`Event "${updatedEvent.title}" updated successfully!`);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast('Event deleted from records.', 'info');
  };

  // Organizer Handlers
  const handleAddOrganizer = (newOrg) => {
    setOrganizers((prev) => [...prev, newOrg]);
    showToast(`Organizer "${newOrg.name}" added to directory!`);
  };

  const handleUpdateOrganizer = (updatedOrg) => {
    setOrganizers((prev) =>
      prev.map((o) => (o.id === updatedOrg.id ? updatedOrg : o))
    );
    showToast(`Organizer "${updatedOrg.name}" profile updated!`);
  };

  const handleDeleteOrganizer = (orgId) => {
    setOrganizers((prev) => prev.filter((o) => o.id !== orgId));
    showToast('Organizer removed from directory.', 'info');
  };

  // Gallery Handlers
  const handleAddMedia = (newMedia) => {
    setGallery((prev) => [newMedia, ...prev]);
    showToast(`Media "${newMedia.title}" uploaded to gallery!`);
  };

  const handleDeleteMedia = (mediaId) => {
    setGallery((prev) => prev.filter((m) => m.id !== mediaId));
    showToast('Media file removed from gallery.', 'info');
  };

  // User Handlers
  const handleInviteUser = (newUser) => {
    setAdminUsers((prev) => [newUser, ...prev]);
    showToast(`Invitation sent to ${newUser.email}!`);
  };

  const handleRevokeUser = (userId) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('Admin user permissions revoked.', 'info');
  };

  const handleSaveSettings = () => {
    showToast('Club & Profile settings saved successfully!');
  };

  return (
    <Routes>
      {/* Nested Admin Shell Layout */}
      <Route element={<AdminLayout toast={toast} setToast={setToast} />}>
        {/* /admin Dashboard */}
        <Route
          index
          element={
            <Dashboard
              events={events}
              onEditEvent={(evt) => navigate(`/admin/events`)}
            />
          }
        />

        {/* /admin/events */}
        <Route
          path="events"
          element={
            <Events
              events={events}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          }
        />

        {/* /admin/organizers */}
        <Route
          path="organizers"
          element={
            <Organizers
              organizers={organizers}
              onAddOrganizer={handleAddOrganizer}
              onUpdateOrganizer={handleUpdateOrganizer}
              onDeleteOrganizer={handleDeleteOrganizer}
            />
          }
        />

        {/* /admin/gallery */}
        <Route
          path="gallery"
          element={
            <Gallery
              mediaList={gallery}
              onAddMedia={handleAddMedia}
              onDeleteMedia={handleDeleteMedia}
            />
          }
        />

        {/* /admin/users */}
        <Route
          path="users"
          element={
            <AdminUsers
              users={adminUsers}
              onInviteUser={handleInviteUser}
              onRevokeUser={handleRevokeUser}
            />
          }
        />

        {/* /admin/settings */}
        <Route
          path="settings"
          element={
            <Settings onSaveSettings={handleSaveSettings} />
          }
        />

        {/* Catch-all fallback inside /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
