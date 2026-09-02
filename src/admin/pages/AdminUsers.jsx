import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Mail, KeyRound, CheckCircle, Clock, X, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { mockAdminUsers } from '../data/mockData';

// ============================================================================
// ADMIN USERS & ROLE PERMISSIONS PAGE (/admin/users)
// ============================================================================
// Manage access credentials, invitations, and administrative roles (Administrator, Editor, Viewer).
//
// NOTE FOR FUTURE SUPABASE AUTH & RBAC INTEGRATION:
// // =========================================================================
// // This page will eventually fetch authenticated users
// // and their roles from Supabase.
// //
// // 1. List Users:
// //    const { data: users, error } = await supabase.from('admin_profiles').select('*');
// // 2. Invite User via Supabase Auth:
// //    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, { data: { role } });
// // =========================================================================
// ============================================================================

export default function AdminUsers({
  users = mockAdminUsers,
  onInviteUser,
  onRevokeUser
}) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [deletingUser, setDeletingUser] = useState(null);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    onInviteUser({
      id: `usr-${Date.now()}`,
      name: inviteName.trim() || inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'pending',
      avatar: '',
      createdDate: new Date().toISOString().split('T')[0],
      lastActive: 'Invited just now',
      permissions: inviteRole === 'Administrator' ? ['Full Access'] : ['Events & Gallery Management']
    });

    setInviteEmail('');
    setInviteName('');
    setIsInviteOpen(false);
  };

  const confirmRevoke = () => {
    if (deletingUser) {
      onRevokeUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Admin User',
      render: (row) => (
        <div className="admin-table-avatar-cell">
          {row.avatar ? (
            <img src={row.avatar} alt={row.name} className="admin-table-avatar-img" />
          ) : (
            <div className="admin-avatar-fallback" style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}>
              {row.name.charAt(0)}
            </div>
          )}
          <div className="admin-table-title-cell">
            <span className="admin-table-main-text">{row.name}</span>
            <span className="admin-table-sub-text">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Access Role',
      render: (row) => (
        <Badge variant="role" label={row.role} showDot={false} />
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
          {row.lastActive}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="admin-table-actions-cell">
          <button
            type="button"
            className="admin-btn-icon"
            style={{ color: '#f87171' }}
            title="Revoke CMS Access"
            onClick={() => setDeletingUser(row)}
            disabled={row.email === 'prabodh@technospark.org'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Admin Users & Permissions"
        subtitle="Manage credentialed administrators, content editors, and role-based permissions"
      >
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus size={16} />
          <span>Invite Admin</span>
        </button>
      </PageHeader>

      {/* Role explanation banner */}
      <div className="admin-card" style={{ padding: '1rem 1.25rem', backgroundColor: 'rgba(37, 99, 235, 0.08)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={20} color="var(--admin-sky-blue)" />
          <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)' }}>
            <strong>Role-Based Access Control (RBAC):</strong> Administrators possess full destructive permissions, while Editors can publish events and media.
          </div>
        </div>
      </div>

      {/* Users DataTable */}
      <DataTable
        columns={columns}
        data={users}
        searchKey={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query)
        }
        searchPlaceholder="Search admin users by name or email..."
        emptyMessage="No administrative users found."
      />

      {/* Invite Admin Modal */}
      {isInviteOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsInviteOpen(false)}>
          <div
            className="admin-modal-container"
            style={{ maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Invite CMS User</h3>
              <button
                type="button"
                className="admin-btn-icon"
                onClick={() => setIsInviteOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Full Name <span className="admin-form-required">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Tanvi Deshmukh"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Email Address <span className="admin-form-required">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@technospark.org"
                  className="admin-form-input"
                />
                <span className="admin-form-hint">
                  Supabase Auth will dispatch a magic login invitation link to this email.
                </span>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Assign Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="admin-form-select"
                >
                  <option value="Administrator">Administrator (Full Access)</option>
                  <option value="Editor">Editor (Events, Media & Organizers)</option>
                  <option value="Viewer">Viewer (Read-only analytics)</option>
                </select>
              </div>

              <div className="admin-modal-footer" style={{ margin: '1.25rem -1.5rem -1.5rem -1.5rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  <Mail size={15} />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Access Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        title="Revoke Admin Access"
        message={`Are you sure you want to revoke CMS access for ${deletingUser?.name} (${deletingUser?.email})?`}
        confirmLabel="Revoke Access"
        isDanger={true}
        onConfirm={confirmRevoke}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  );
}
