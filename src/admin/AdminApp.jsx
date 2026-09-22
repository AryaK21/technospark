import React, { useState, useEffect } from 'react';
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

// Supabase Connection & Service
import { supabase } from '../lib/supabaseClient';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../services/eventsService';
import {
  fetchGalleryFromStorage,
  deleteGalleryMediaFromStorage
} from '../services/galleryService';
import {
  getOrganizers,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer
} from '../services/organizersService';

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

  // Active state for events (Live Supabase)
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Active state for organizers, gallery, and admin users
  const [organizers, setOrganizers] = useState(initialOrganizers);
  const [isLoadingOrganizers, setIsLoadingOrganizers] = useState(true);
  const [gallery, setGallery] = useState(initialGallery);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [toast, setToast] = useState(null);

  // Visual Theme State (Light theme default as requested, persists in localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('technospark_admin_theme') || 'light';
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('technospark_admin_theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme!`, 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({
      id: Date.now(),
      message,
      type
    });
  };

  // Fetch live events from Supabase
  const loadEvents = async (silent = false) => {
    if (!silent) setIsLoadingEvents(true);
    const { data, error } = await getEvents();
    setIsLoadingEvents(false);
    if (error) {
      console.warn('[AdminApp] Supabase fetch error, fallback to initial:', error);
      setEvents(initialEvents);
    } else {
      console.log('[AdminApp] Loaded events from Supabase:', data);
      setEvents(data || []);
    }
  };

  // Fetch live organizers from Supabase
  const loadOrganizers = async (silent = false) => {
    if (!silent) setIsLoadingOrganizers(true);
    const { data, error } = await getOrganizers();
    setIsLoadingOrganizers(false);
    if (error) {
      console.warn('[AdminApp] Supabase organizers fetch error, fallback to initial:', error);
      setOrganizers((prev) => (prev.length > 0 ? prev : initialOrganizers));
    } else if (data && data.length > 0) {
      console.log('[AdminApp] Loaded organizers from Supabase:', data);
      setOrganizers(data);
    } else {
      setOrganizers((prev) => (prev.length > 0 ? prev : initialOrganizers));
    }
  };

  // Fetch media from Supabase Storage 'gallery' bucket
  const loadGalleryMedia = async (silent = false) => {
    if (!silent) setIsLoadingGallery(true);
    const { data, error } = await fetchGalleryFromStorage();
    setIsLoadingGallery(false);
    if (error) {
      console.warn('[AdminApp] Supabase storage list error, using initial:', error);
      if (gallery.length === 0) setGallery(initialGallery);
    } else if (data && data.length > 0) {
      console.log('[AdminApp] Loaded gallery files from Supabase Storage:', data);
      // Merge: show Supabase files first, followed by any initial demo files not duplicated
      const supabasePaths = new Set(data.map((d) => d.storagePath || d.title));
      const remainingInitial = initialGallery.filter((ig) => !supabasePaths.has(ig.title));
      setGallery([...data, ...remainingInitial]);
    } else {
      // If bucket has no items yet, retain initial demo gallery
      setGallery((prev) => (prev.length > 0 ? prev : initialGallery));
    }
  };

  useEffect(() => {
    loadEvents();
    loadOrganizers();
    loadGalleryMedia(true);

    // 1. Auto-refresh when tab gains focus (e.g. returning from Supabase dashboard)
    const handleFocus = () => {
      loadEvents(true);
      loadOrganizers(true);
      loadGalleryMedia(true);
    };
    window.addEventListener('focus', handleFocus);

    // 2. Realtime listener for Postgres changes on public.events
    let channel;
    try {
      channel = supabase
        .channel('public:events')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
            console.log('[AdminApp] Realtime event update detected:', payload);
            loadEvents(true);
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[AdminApp] Realtime subscription init:', e);
    }

    // 3. Realtime listener for Postgres changes on public.organizers
    let orgChannel;
    try {
      orgChannel = supabase
        .channel('public:organizers')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'organizers' },
          (payload) => {
            console.log('[AdminApp] Realtime organizer update detected:', payload);
            loadOrganizers(true);
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[AdminApp] Realtime organizers subscription init:', e);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (orgChannel) {
        supabase.removeChannel(orgChannel);
      }
    };
  }, []);

  // Event Handlers connected to Supabase
  const handleAddEvent = async (newEvent) => {
    const { data, error } = await createEvent(newEvent);
    if (error) {
      showToast(`Failed to save event: ${error.message || 'Database error'}`, 'error');
      return false;
    }
    if (data) {
      setEvents((prev) => [data, ...prev]);
      showToast(`Event "${data.name}" saved to Supabase!`, 'success');
      return true;
    }
    return false;
  };

  const handleUpdateEvent = async (updatedEvent) => {
    const { data, error } = await updateEvent(updatedEvent.id, updatedEvent);
    if (error) {
      showToast(`Failed to update event: ${error.message || 'Database error'}`, 'error');
      return false;
    }
    if (data) {
      setEvents((prev) =>
        prev.map((e) => (e.id === data.id ? data : e))
      );
      showToast(`Event "${data.name}" updated in Supabase!`, 'success');
      return true;
    }
    return false;
  };

  const handleDeleteEvent = async (eventId) => {
    const { error } = await deleteEvent(eventId);
    if (error) {
      showToast(`Failed to delete event: ${error.message || 'Database error'}`, 'error');
      return false;
    }
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast('Event removed from Supabase.', 'info');
    return true;
  };

  const handleRefreshEvents = async () => {
    await loadEvents();
    showToast('Refreshed events from Supabase!', 'info');
  };

  // Organizer Handlers connected to Supabase
  const handleAddOrganizer = async (newOrg) => {
    const { data, error, isRlsError } = await createOrganizer(newOrg);
    if (error) {
      showToast(
        isRlsError
          ? 'RLS Error: Run "ALTER TABLE public.organizers DISABLE ROW LEVEL SECURITY;" in Supabase'
          : `Failed to save organizer: ${error.message || 'Database error'}`,
        'error'
      );
      return { success: false, error, isRlsError };
    }
    if (data) {
      setOrganizers((prev) => [data, ...prev]);
      showToast(`Organizer "${data.name}" saved to Supabase!`, 'success');
      return { success: true, data };
    }
    return { success: false };
  };

  const handleUpdateOrganizer = async (updatedOrg) => {
    const { data, error, isRlsError } = await updateOrganizer(updatedOrg.id, updatedOrg);
    if (error) {
      showToast(
        isRlsError
          ? 'RLS Error: Run "ALTER TABLE public.organizers DISABLE ROW LEVEL SECURITY;" in Supabase'
          : `Failed to update organizer: ${error.message || 'Database error'}`,
        'error'
      );
      return { success: false, error, isRlsError };
    }
    if (data) {
      setOrganizers((prev) =>
        prev.map((o) => (o.id === data.id ? data : o))
      );
      showToast(`Organizer "${data.name}" profile updated in Supabase!`, 'success');
      return { success: true, data };
    }
    return { success: false };
  };

  const handleDeleteOrganizer = async (orgId, imagePath) => {
    const { error } = await deleteOrganizer(orgId, imagePath);
    if (error) {
      showToast(`Failed to delete organizer: ${error.message || 'Database error'}`, 'error');
      return false;
    }
    setOrganizers((prev) => prev.filter((o) => o.id !== orgId));
    showToast('Organizer removed from Supabase.', 'info');
    return true;
  };

  const handleRefreshOrganizers = async () => {
    await loadOrganizers();
    showToast('Refreshed organizers from Supabase!', 'info');
  };

  // Gallery Handlers
  const handleAddMedia = (newMedia) => {
    setGallery((prev) => [newMedia, ...prev]);
    showToast(`Media "${newMedia.title}" uploaded to Supabase gallery!`);
  };

  const handleDeleteMedia = async (mediaId) => {
    const itemToDelete = gallery.find((m) => m.id === mediaId);
    if (itemToDelete?.storagePath && itemToDelete?.fromSupabase) {
      const { error } = await deleteGalleryMediaFromStorage(itemToDelete.storagePath);
      if (error) {
        showToast(`Storage deletion error: ${error.message || 'Could not delete file'}`, 'error');
        return;
      }
    }
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
      <Route element={<AdminLayout toast={toast} setToast={setToast} theme={theme} onThemeChange={handleThemeChange} />}>
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
              onRefresh={handleRefreshEvents}
            />
          }
        />

        {/* /admin/organizers */}
        <Route
          path="organizers"
          element={
            <Organizers
              organizers={organizers}
              isLoading={isLoadingOrganizers}
              onAddOrganizer={handleAddOrganizer}
              onUpdateOrganizer={handleUpdateOrganizer}
              onDeleteOrganizer={handleDeleteOrganizer}
              onRefresh={handleRefreshOrganizers}
            />
          }
        />

        {/* /admin/gallery */}
        <Route
          path="gallery"
          element={
            <Gallery
              mediaList={gallery}
              isLoading={isLoadingGallery}
              onAddMedia={handleAddMedia}
              onDeleteMedia={handleDeleteMedia}
              onRefresh={loadGalleryMedia}
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
            <Settings
              onSaveSettings={handleSaveSettings}
              theme={theme}
              onThemeChange={handleThemeChange}
            />
          }
        />

        {/* Catch-all fallback inside /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
