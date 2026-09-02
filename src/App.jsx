import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicHome from './frontend/pages/PublicHome';
import AdminApp from './admin/AdminApp';

// ============================================================================
// TECHNOSPARK ROOT ROUTER
// ============================================================================
// Separates the public club website from the administrative CMS:
//
// 1. PUBLIC WEBSITE:
//    /                -> Full Technospark landing page (Hero, About, Events, Organizers, Gallery)
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
      <Routes>
        {/* Public Website Route */}
        <Route path="/" element={<PublicHome />} />

        {/* Admin Dashboard & Management Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );

}
