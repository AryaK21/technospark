import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicHome from './frontend/pages/PublicHome';
import AboutPage from './frontend/pages/AboutPage';
import EventsPage from './frontend/pages/EventsPage';
import TeamPage from './frontend/pages/TeamPage';
import GalleryPage from './frontend/pages/GalleryPage';
import ContactPage from './frontend/pages/ContactPage';
import AdminApp from './admin/AdminApp';

// ============================================================================
// SCROLL TO TOP ON ROUTE CHANGE HELPER
// ============================================================================
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

// ============================================================================
// TECHNOSPARK ROOT ROUTER — DEDICATED SEPARATE PAGES
// ============================================================================
// 1. PUBLIC WEBSITE SEPARATE PAGES:
//    /                -> Dedicated Home page (Hero with 3D Globe, Orbit Navigation & Portal Hub)
//    /about           -> Dedicated About & Mission Matrix Page
//    /events          -> Dedicated Chronological Events Timeline Page
//    /team            -> Dedicated Hierarchical Team Tree Page
//    /organizers      -> Alias to /team
//    /gallery         -> Dedicated 3D Floating Exhibition Gallery Page
//    /contact         -> Dedicated Contact & Inquiries Page
//
// 2. ADMIN CMS PANEL:
//    /admin           -> Main Overview Dashboard
//    /admin/events    -> Events Manager (Add / Edit / Delete)
//    /admin/organizers-> Organizers & Leadership Manager
//    /admin/gallery   -> Media Pool & Upload Center
//    /admin/users     -> Admin Users & Access Roles
//    /admin/settings  -> Club & Profile Settings
// ============================================================================

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Website Separate Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/organizers" element={<TeamPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin Dashboard & Management Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
