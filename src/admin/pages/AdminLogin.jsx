import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Clock,
  RotateCw,
  LogOut,
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { signInWithGoogle, signOutAdmin } from '../../services/adminAuthService';
import { clubInfo } from '../../data/clubInfo';
import '../styles/auth.css';

/**
 * Official Google 'G' multicolored logo SVG.
 */
function GoogleIcon() {
  return (
    <svg className="admin-google-icon" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AdminLogin({
  user,
  request,
  onRefreshStatus,
  onLogout
}) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg('');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google Sign-In Error:', error);
        setErrorMsg(error.message || 'Unable to connect to Google OAuth.');
        setIsSigningIn(false);
      }
    } catch (err) {
      console.error('Sign-In Exception:', err);
      setErrorMsg('An unexpected error occurred during sign-in.');
      setIsSigningIn(false);
    }
  };

  const handleManualCheck = async () => {
    setIsChecking(true);
    if (onRefreshStatus) {
      await onRefreshStatus();
    }
    setTimeout(() => setIsChecking(false), 800);
  };

  const handleSignOutClick = async () => {
    await signOutAdmin();
    if (onLogout) onLogout();
  };

  // --------------------------------------------------------------------------
  // STATE 1: Authenticated with Google, but Access Request is PENDING
  // --------------------------------------------------------------------------
  if (user && (!request || request.status === 'pending')) {
    const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member';

    return (
      <div className="admin-login-screen">
        <div className="admin-auth-card admin-pending-card">
          {/* Status Badge */}
          <div className="admin-status-icon-badge pending">
            <Clock size={28} />
          </div>

          <h2 className="admin-auth-title" style={{ fontSize: '1.45rem' }}>
            Access Request Pending
          </h2>
          <p className="admin-auth-subtitle">
            Your Google account has been registered. An Administrator must approve your access before you can enter the CMS.
          </p>

          {/* User Preview Pill */}
          <div className="admin-user-pill-highlight">
            {avatar ? (
              <img src={avatar} alt={displayName} className="admin-user-pill-avatar" />
            ) : (
              <div
                className="admin-user-pill-avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#2563EB',
                  color: '#FFF',
                  fontWeight: 700
                }}
              >
                {displayName.charAt(0)}
              </div>
            )}
            <div className="admin-user-pill-meta">
              <span className="admin-user-pill-name">{displayName}</span>
              <span className="admin-user-pill-email">{user.email}</span>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#EAB308',
                background: 'rgba(234, 179, 8, 0.15)',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                border: '1px solid rgba(234, 179, 8, 0.3)'
              }}
            >
              Pending Approval
            </span>
          </div>

          <div
            style={{
              fontSize: '0.82rem',
              color: '#94A3B8',
              lineHeight: 1.5,
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.85rem',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            Once accepted, you will receive <strong>Editor</strong> permissions with access to <strong>Events</strong> and <strong>Gallery</strong> management.
          </div>

          {/* RLS Troubleshooting Box for pre-registered admins */}
          <div
            style={{
              fontSize: '0.78rem',
              color: '#38BDF8',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'left',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}
          >
            <strong>Already added your email to <code>admin_users</code>?</strong>
            <div style={{ marginTop: '0.25rem', color: '#CBD5E1', fontSize: '0.74rem', lineHeight: 1.4 }}>
              Supabase blocks client queries if RLS is enabled without policies. Run this in your Supabase SQL Editor:
              <div style={{ margin: '0.35rem 0', padding: '0.35rem 0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', fontFamily: 'monospace', color: '#FACC15' }}>
                ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
              </div>
              Then click <strong>Check Status</strong> below.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="admin-auth-actions-row">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleSignOutClick}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleManualCheck}
              disabled={isChecking}
            >
              <RotateCw size={16} className={isChecking ? 'spin' : ''} />
              <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 2: Authenticated with Google, but Access Request was REJECTED
  // --------------------------------------------------------------------------
  if (user && request && request.status === 'rejected') {
    return (
      <div className="admin-login-screen">
        <div className="admin-auth-card admin-pending-card">
          <div className="admin-status-icon-badge rejected">
            <ShieldAlert size={28} />
          </div>

          <h2 className="admin-auth-title" style={{ fontSize: '1.45rem' }}>
            Request Not Approved
          </h2>
          <p className="admin-auth-subtitle">
            Your request for administrator access was reviewed and declined by a club administrator.
          </p>

          <div className="admin-user-pill-highlight">
            <div className="admin-user-pill-meta">
              <span className="admin-user-pill-name">{user.user_metadata?.full_name || 'User'}</span>
              <span className="admin-user-pill-email">{user.email}</span>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#EF4444',
                background: 'rgba(239, 68, 68, 0.15)',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              Rejected
            </span>
          </div>

          <div className="admin-auth-actions-row">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleSignOutClick}
              style={{ width: '100%' }}
            >
              <LogOut size={16} />
              <span>Sign Out of Google</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 3: Unauthenticated — Standard Google OAuth Login Screen
  // --------------------------------------------------------------------------
  return (
    <div className="admin-login-screen">
      <div className="admin-auth-card">
        {/* Brand Header */}
        <div className="admin-auth-header">
          <div className="admin-auth-logo-wrapper">
            <img
              src={clubInfo.logos?.whiteTransparent || '/assets/logos/logo.jpeg'}
              alt="Technospark"
              className="admin-auth-logo-img"
            />
          </div>
          <h1 className="admin-auth-title">TECHNOSPARK</h1>
          <p className="admin-auth-subtitle">
            Administrative Content Management System. Sign in with your authorized Google account.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#F87171',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <button
          type="button"
          className="admin-google-btn"
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          <GoogleIcon />
          <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
        </button>

        {/* Security & Role Policy Notice */}
        <div className="admin-auth-notice">
          <Shield size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
          <span>
            New accounts undergo administrator approval. Accepted editors can publish events and media.
          </span>
        </div>

        {/* Return to Public Website */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              fontSize: '0.8rem',
              color: '#94A3B8',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.target.style.color = '#38BDF8')}
            onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
          >
            <span>Return to Public Website</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
