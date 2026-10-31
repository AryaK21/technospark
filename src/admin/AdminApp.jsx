import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Admin Layout
import AdminLayout from './layout/AdminLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Queries from './pages/Queries';
import Organizers from './pages/Organizers';
import Gallery from './pages/Gallery';
import AdminUsers from './pages/AdminUsers';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';

// Supabase Connection & Services
import { supabase } from '../lib/supabaseClient';
import {
  getCurrentSession,
  signOutAdmin,
  getAdminProfile,
  bootstrapFirstAdminIfEmpty,
  getUserAccessRequest,
  createAccessRequest,
  getAllAdminUsers,
  getAllRequests,
  updateAdminUserRole,
  deleteAdminUser,
  approveAccessRequest,
  rejectAccessRequest,
  getCachedAdminProfile,
  setCachedAdminProfile,
  clearCachedAdminProfile
} from '../services/adminAuthService';

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../services/eventsService';
import { getQueries } from '../services/queriesService';
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

// Mock Data Fallbacks (for offline/demo)
import {
  mockEvents as initialEvents,
  mockOrganizers as initialOrganizers,
  mockGallery as initialGallery,
  mockAdminUsers as initialAdminUsers
} from './data/mockData';

// Scoped Admin Stylesheets
import './styles/admin.css';
import './styles/sidebar.css';
import './styles/topbar.css';
import './styles/dashboard.css';
import './styles/tables.css';
import './styles/forms.css';
import './styles/gallery.css';
import './styles/auth.css';

export default function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------------------------------
  // AUTHENTICATION & ACCESS REQUEST STATE
  // --------------------------------------------------------------------------
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getCachedAdminProfile()); // Instant load from cache
  const [pendingRequest, setPendingRequest] = useState(null); // Row from requests if not approved
  const [authLoading, setAuthLoading] = useState(() => !getCachedAdminProfile());

  // --------------------------------------------------------------------------
  // CONTENT MANAGEMENT STATE
  // --------------------------------------------------------------------------
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [queries, setQueries] = useState([]);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);

  const [organizers, setOrganizers] = useState([]);
  const [isLoadingOrganizers, setIsLoadingOrganizers] = useState(true);

  const [gallery, setGallery] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Admin Users & Requests from live database
  const [adminUsers, setAdminUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [toast, setToast] = useState(null);

  // Visual Theme State (persists in localStorage)
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

  // --------------------------------------------------------------------------
  // 1. RESOLVE USER AUTH & AUTHORIZATION STATUS (OPTIMIZED FOR ZERO-FLICKER)
  // --------------------------------------------------------------------------
  const resolveUserAuth = useCallback(async (existingSession = null, silent = false) => {
    // Only show full-screen blocking loader if user profile is completely unknown
    if (!silent && !currentUser && !getCachedAdminProfile()) {
      setAuthLoading(true);
    }

    try {
      const activeSession = existingSession || (await getCurrentSession()).session;
      setSession(activeSession);

      if (!activeSession?.user) {
        clearCachedAdminProfile();
        setCurrentUser(null);
        setPendingRequest(null);
        setAuthLoading(false);
        return;
      }

      const authUser = activeSession.user;

      // Check if admin_users is totally empty: if so, bootstrap first user as Administrator!
      await bootstrapFirstAdminIfEmpty(authUser);

      // Check if user is in public.admin_users
      const { data: adminProfile } = await getAdminProfile(authUser);

      if (adminProfile) {
        // User is an authorized Administrator or Editor
        setCachedAdminProfile(adminProfile);
        setCurrentUser(adminProfile);
        setPendingRequest(null);
      } else {
        // User has signed into Google, but is NOT in admin_users whitelist yet
        clearCachedAdminProfile();
        setCurrentUser(null);

        // Fetch or create their pending request in public.requests
        const { data: req } = await getUserAccessRequest(authUser);
        if (req) {
          setPendingRequest(req);
        } else {
          // Auto-register request in requests table
          const { data: newReq } = await createAccessRequest(authUser);
          setPendingRequest(newReq);
        }
      }
    } catch (err) {
      console.error('[AdminApp] Error resolving user auth:', err);
    } finally {
      setAuthLoading(false);
    }
  }, [currentUser]);

  // --------------------------------------------------------------------------
  // 2. DATA LOADERS
  // --------------------------------------------------------------------------
  const loadEvents = async (silent = false) => {
    if (!silent) setIsLoadingEvents(true);
    const { data, error } = await getEvents();
    setIsLoadingEvents(false);
    if (error) {
      console.warn('[AdminApp] Supabase fetch error, fallback to initial:', error);
      setEvents(initialEvents);
    } else {
      setEvents(data || []);
    }
  };

  const loadQueries = async (silent = false) => {
    if (!silent) setIsLoadingQueries(true);
    const { data, error } = await getQueries();
    setIsLoadingQueries(false);
    if (error) {
      console.warn('[AdminApp] Supabase queries fetch error:', error);
    } else {
      setQueries(data || []);
    }
  };

  const loadOrganizers = async (silent = false) => {
    if (!silent) setIsLoadingOrganizers(true);
    const { data, error } = await getOrganizers();
    setIsLoadingOrganizers(false);
    if (error) {
      console.warn('[AdminApp] Supabase organizers fetch error:', error);
      if (organizers.length === 0) setOrganizers(initialOrganizers);
    } else {
      setOrganizers(data || []);
    }
  };

  const loadGalleryMedia = async (silent = false) => {
    if (!silent) setIsLoadingGallery(true);
    const { data, error } = await fetchGalleryFromStorage();
    setIsLoadingGallery(false);
    if (error) {
      console.warn('[AdminApp] Supabase gallery fetch error:', error);
      if (gallery.length === 0) setGallery(initialGallery);
    } else {
      setGallery(data || []);
    }
  };

  const loadUsersAndRequests = async (silent = false) => {
    if (!silent) setIsLoadingUsers(true);
    const [usersRes, reqRes] = await Promise.all([
      getAllAdminUsers(),
      getAllRequests()
    ]);
    setIsLoadingUsers(false);

    if (usersRes.error) {
      console.warn('[AdminApp] Supabase admin_users fetch error:', usersRes.error);
      if (adminUsers.length === 0) setAdminUsers(initialAdminUsers);
    } else if (usersRes.data) {
      setAdminUsers(usersRes.data);
    }

    if (reqRes.data) {
      setRequests(reqRes.data);
    }
  };

  // --------------------------------------------------------------------------
  // 3. LIFECYCLE & SUPABASE REALTIME SUBSCRIPTIONS
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Initial silent check if cached profile exists; otherwise full resolution
    const hasCached = Boolean(getCachedAdminProfile());
    resolveUserAuth(null, hasCached);

    // Listen to Supabase Auth state changes (OAuth redirects, logins, logouts)
    // Filtered so tab changes & automatic token refreshes NEVER interrupt UI
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, updatedSession) => {
        if (event === 'SIGNED_OUT') {
          clearCachedAdminProfile();
          setSession(null);
          setCurrentUser(null);
          setPendingRequest(null);
          return;
        }

        if (event === 'TOKEN_REFRESHED') {
          // Token refresh occurs automatically in background; update session silently
          setSession(updatedSession);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setSession(updatedSession);
          const cached = getCachedAdminProfile();
          // If already authenticated as this user, don't run heavy profile re-queries
          if (cached && updatedSession?.user?.id && (cached.userId === updatedSession.user.id || cached.email === updatedSession.user.email)) {
            return;
          }
          resolveUserAuth(updatedSession, true);
        }
      }
    );

    loadEvents();
    loadQueries(true);
    loadOrganizers();
    loadGalleryMedia(true);
    loadUsersAndRequests(true);

    // Auto-refresh data when browser tab regains focus (throttled to max once every 60s)
    let lastFocusRefresh = Date.now();
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusRefresh < 60000) return;
      lastFocusRefresh = now;
      loadEvents(true);
      loadQueries(true);
      loadOrganizers(true);
      loadGalleryMedia(true);
      loadUsersAndRequests(true);
    };
    window.addEventListener('focus', handleFocus);

    // Realtime listener on public.events
    let eventsChannel;
    try {
      eventsChannel = supabase
        .channel('public:events')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          () => {
            loadEvents(true);
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[AdminApp] Events realtime init error:', e);
    }

    // Realtime listener on public.organizers
    let organizersChannel;
    try {
      organizersChannel = supabase
        .channel('public:organizers')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'organizers' },
          () => {
            loadOrganizers(true);
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[AdminApp] Organizers realtime init error:', e);
    }

    // Realtime listener on public.queries
    let queriesChannel;
    try {
      queriesChannel = supabase
        .channel('public:queries')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'queries' },
          () => {
            loadQueries(true);
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[AdminApp] Queries realtime init error:', e);
    }

    // Realtime listener on public.requests
    let requestsChannel;
    try {
      requestsChannel = supabase
        .channel('public:requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'requests' },
          (payload) => {
            loadUsersAndRequests(true);
            // Only re-resolve if current user is actively waiting for approval
            if (!currentUser && session?.user) {
              resolveUserAuth(null, true);
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[AdminApp] Requests realtime init error:', e);
    }

    // Realtime listener on public.admin_users
    let adminUsersChannel;
    try {
      adminUsersChannel = supabase
        .channel('public:admin_users')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'admin_users' },
          (payload) => {
            loadUsersAndRequests(true);
            // Only re-resolve if current user is actively waiting for approval
            if (!currentUser && session?.user) {
              resolveUserAuth(null, true);
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[AdminApp] Admin users realtime init error:', e);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      authListener?.subscription?.unsubscribe();
      if (eventsChannel) supabase.removeChannel(eventsChannel);
      if (organizersChannel) supabase.removeChannel(organizersChannel);
      if (queriesChannel) supabase.removeChannel(queriesChannel);
      if (requestsChannel) supabase.removeChannel(requestsChannel);
      if (adminUsersChannel) supabase.removeChannel(adminUsersChannel);
    };
  }, [resolveUserAuth]);

  // --------------------------------------------------------------------------
  // 4. ACTION HANDLERS
  // --------------------------------------------------------------------------
  const handleLogout = async () => {
    await signOutAdmin();
    setSession(null);
    setCurrentUser(null);
    setPendingRequest(null);
    showToast('Signed out of Technospark CMS.', 'info');
  };

  // Role Changes by Administrator
  const handleRoleChange = async (userId, newRole) => {
    if (currentUser?.role !== 'Administrator') {
      showToast('Only Administrators can change user roles.', 'error');
      return;
    }

    const { data, error } = await updateAdminUserRole(userId, newRole);
    if (error) {
      showToast(`Failed to update role: ${error.message || 'Database error'}`, 'error');
      return;
    }

    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast(`Role updated to ${newRole}!`, 'success');
  };

  // Revoke Admin User
  const handleRevokeUser = async (userId) => {
    if (currentUser?.role !== 'Administrator') {
      showToast('Only Administrators can revoke access.', 'error');
      return;
    }

    const { error } = await deleteAdminUser(userId);
    if (error) {
      showToast(`Failed to revoke user: ${error.message}`, 'error');
      return;
    }

    setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('User permissions revoked.', 'info');
  };

  // Accept / Approve Request (Defaults to Editor)
  const handleApproveRequest = async (request) => {
    if (currentUser?.role !== 'Administrator') {
      showToast('Only Administrators can approve access requests.', 'error');
      return;
    }

    const { success, adminUser, error } = await approveAccessRequest(request, 'Editor');
    if (error) {
      showToast(`Approval failed: ${error.message}`, 'error');
      return;
    }

    if (adminUser) {
      setAdminUsers((prev) => [adminUser, ...prev.filter((u) => u.email !== adminUser.email)]);
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: 'approved' } : r))
    );

    showToast(`Approved "${request.name}" as an Editor!`, 'success');
  };

  // Reject Request
  const handleRejectRequest = async (requestId) => {
    if (currentUser?.role !== 'Administrator') {
      showToast('Only Administrators can reject access requests.', 'error');
      return;
    }

    const { error } = await rejectAccessRequest(requestId);
    if (error) {
      showToast(`Failed to reject request: ${error.message}`, 'error');
      return;
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );

    showToast('Access request rejected.', 'info');
  };

  // Event Handlers
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
      setEvents((prev) => prev.map((e) => (e.id === data.id ? data : e)));
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

  // Organizer Handlers (Administrator only)
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
      setOrganizers((prev) => prev.map((o) => (o.id === data.id ? data : o)));
      showToast(`Organizer "${data.name}" updated!`, 'success');
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
    showToast('Organizer removed.', 'info');
    return true;
  };

  // Gallery Handlers
  const handleAddMedia = (newMediaOrList) => {
    if (Array.isArray(newMediaOrList)) {
      if (newMediaOrList.length === 0) return;
      setGallery((prev) => [...newMediaOrList, ...prev]);
      showToast(
        newMediaOrList.length === 1
          ? `Media "${newMediaOrList[0].title}" added to gallery!`
          : `${newMediaOrList.length} media items added to gallery!`,
        'success'
      );
    } else if (newMediaOrList) {
      setGallery((prev) => [newMediaOrList, ...prev]);
      showToast(`Media "${newMediaOrList.title}" uploaded!`, 'success');
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    const itemToDelete = gallery.find((m) => m.id === mediaId);
    if (itemToDelete?.storagePath && itemToDelete?.fromSupabase) {
      const { error } = await deleteGalleryMediaFromStorage(itemToDelete.storagePath);
      if (error) {
        showToast(`Storage deletion error: ${error.message}`, 'error');
        return;
      }
    }
    setGallery((prev) => prev.filter((m) => m.id !== mediaId));
    showToast('Media file removed from gallery.', 'info');
  };

  const handleSaveSettings = () => {
    showToast('Club & Profile settings saved successfully!');
  };

  // --------------------------------------------------------------------------
  // 5. AUTH VERIFICATION & LOGIN / PENDING REQUEST SCREENS
  // --------------------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="admin-login-screen">
        <div style={{ textAlign: 'center', color: '#FFF' }}>
          <div
            className="admin-status-pulse"
            style={{ width: '16px', height: '16px', margin: '0 auto 1rem auto' }}
          />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            Verifying Admin Access...
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            Checking Google OAuth session and credentials
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated OR has no approved admin_users record yet
  if (!session || !currentUser) {
    return (
      <AdminLogin
        user={session?.user}
        request={pendingRequest}
        onRefreshStatus={() => resolveUserAuth()}
        onLogout={handleLogout}
      />
    );
  }

  // --------------------------------------------------------------------------
  // 6. ROLE-BASED ACCESS CONTROL (RBAC)
  // --------------------------------------------------------------------------
  const isAdministrator = currentUser.role === 'Administrator';

  return (
    <Routes>
      <Route
        element={
          <AdminLayout
            currentUser={currentUser}
            onLogout={handleLogout}
            toast={toast}
            setToast={setToast}
            theme={theme}
            onThemeChange={handleThemeChange}
          />
        }
      >
        {/* Overview Dashboard — Both Editor and Admin */}
        <Route
          index
          element={
            <Dashboard
              currentUser={currentUser}
              events={events}
              organizers={organizers}
              gallery={gallery}
              adminUsers={adminUsers}
              queries={queries}
              onEditEvent={() => navigate('/admin/events')}
            />
          }
        />

        {/* Events Manager — Both Editor and Admin */}
        <Route
          path="events"
          element={
            <Events
              events={events}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onRefresh={loadEvents}
            />
          }
        />

        {/* Public Queries (Read-Only) — ONLY Administrator */}
        <Route
          path="queries"
          element={
            isAdministrator ? (
              <Queries
                queries={queries}
                isLoading={isLoadingQueries}
                onRefresh={() => loadQueries()}
              />
            ) : (
              <Navigate to="/admin/events" replace />
            )
          }
        />

        {/* Gallery Media — Both Editor and Admin */}
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

        {/* Admin Users & Requests — ONLY Administrator */}
        <Route
          path="users"
          element={
            isAdministrator ? (
              <AdminUsers
                currentUser={currentUser}
                users={adminUsers}
                requests={requests}
                isLoading={isLoadingUsers}
                onRoleChange={handleRoleChange}
                onRevokeUser={handleRevokeUser}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                onRefresh={() => loadUsersAndRequests()}
              />
            ) : (
              <Navigate to="/admin/events" replace />
            )
          }
        />

        {/* Organizers Manager — ONLY Administrator */}
        <Route
          path="organizers"
          element={
            isAdministrator ? (
              <Organizers
                organizers={organizers}
                isLoading={isLoadingOrganizers}
                onAddOrganizer={handleAddOrganizer}
                onUpdateOrganizer={handleUpdateOrganizer}
                onDeleteOrganizer={handleDeleteOrganizer}
                onRefresh={loadOrganizers}
              />
            ) : (
              <Navigate to="/admin/events" replace />
            )
          }
        />

        {/* Settings — ONLY Administrator */}
        <Route
          path="settings"
          element={
            isAdministrator ? (
              <Settings
                onSaveSettings={handleSaveSettings}
                theme={theme}
                onThemeChange={handleThemeChange}
              />
            ) : (
              <Navigate to="/admin/events" replace />
            )
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
