import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Trash2, X, Clock, User } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { mockAdminUsers } from '../data/mockData';

// ============================================================================
// ADMIN USERS & ROLE PERMISSIONS PAGE (/admin/users)
// ============================================================================
// Aligned with PostgreSQL Table: public.admin_users
//
// Schema:
// - id: bigint GENERATED ALWAYS AS IDENTITY NOT NULL
// - name: character varying NOT NULL
// - role: character varying NOT NULL
// - last_active: timestamp without time zone
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // 1. List Users:
// //    const { data: users, error } = await supabase.from('admin_users').select('*');
// // 2. Add User:
// //    const { data, error } = await supabase.from('admin_users').insert([{ name, role, last_active: new Date().toISOString() }]);
// // 3. Delete User:
// //    await supabase.from('admin_users').delete().eq('id', userToDelete.id);
// // =========================================================================
// ============================================================================

export default function AdminUsers({
  users = mockAdminUsers,
  onInviteUser,
  onRevokeUser
}) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminRole, setAdminRole] = useState('Editor');
  const [deletingUser, setDeletingUser] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!adminName.trim()) return;

    const newUserPayload = {
      id: Date.now(),
      name: adminName.trim(),
      role: adminRole,
      last_active: new Date().toLocaleString(),
      // Legacy aliases
      lastActive: 'Just now'
    };

    onInviteUser(newUserPayload);

    setAdminName('');
    setIsInviteOpen(false);
  };

  const confirmRevoke = () => {
    if (deletingUser) {
      onRevokeUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  // Table Columns Definition (Aligned with PostgreSQL public.admin_users schema)
  const columns = [
    {
      key: 'name',
      label: 'Admin User',
      render: (row) => (
        <div className="admin-table-avatar-cell">
          <div
            className="admin-avatar-fallback"
            style={{
              width: '36px',
              height: '36px',
              fontSize: '0.85rem',
              borderRadius: '50%',
              backgroundColor: 'var(--admin-blue-light)',
              color: 'var(--admin-blue-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              border: '1px solid var(--admin-border-subtle)'
            }}
          >
            {row.name ? row.name.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <div className="admin-table-title-cell">
            <span className="admin-table-main-text">{row.name}</span>
            <span className="admin-table-sub-text">User ID: #{row.id}</span>
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
      key: 'last_active',
      label: 'Last Active',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
          <Clock size={13} color="var(--admin-text-faint)" />
          <span>{row.last_active || row.lastActive || 'Recently'}</span>
        </div>
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
            disabled={row.name === 'Prabodh' || row.id === 'usr-001'}
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
        title="Admin Users & Access"
        subtitle="Manage authenticated administrators and content editors"
      >
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus size={16} />
          <span>Add Admin User</span>
        </button>
      </PageHeader>

      {/* Role explanation banner */}
      <div className="admin-card" style={{ padding: '1rem 1.25rem', backgroundColor: 'rgba(37, 99, 235, 0.08)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={20} color="var(--admin-blue-primary)" />
          <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)' }}>
            <strong>Role-Based Access Control:</strong> Administrators possess full management permissions, while Editors can publish events, media, and organizers.
          </div>
        </div>
      </div>

      {/* Users DataTable */}
      <DataTable
        columns={columns}
        data={users}
        searchKey={(item, query) =>
          (item.name || '').toLowerCase().includes(query) ||
          (item.role || '').toLowerCase().includes(query)
        }
        searchPlaceholder="Search admin users by name or role..."
        emptyMessage="No administrative users found."
      />

      {/* Add Admin User Modal Form */}
      {isInviteOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsInviteOpen(false)}>
          <div
            className="admin-modal-container"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Add Admin User</h3>
              <button
                type="button"
                className="admin-btn-icon"
                onClick={() => setIsInviteOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="admin-modal-body">
              {/* 1. name (character varying NOT NULL) */}
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Full Name <span className="admin-form-required">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Tanvi Deshmukh"
                  className="admin-form-input"
                />
              </div>

              {/* 2. role (character varying NOT NULL) */}
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Assign Role <span className="admin-form-required">*</span>
                </label>
                <select
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value)}
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
                  <UserPlus size={15} />
                  <span>Add User</span>
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
        message={`Are you sure you want to remove administrator permissions for "${deletingUser?.name}"?`}
        confirmLabel="Revoke Access"
        isDanger={true}
        onConfirm={confirmRevoke}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  );
}
