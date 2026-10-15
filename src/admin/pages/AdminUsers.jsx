import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Clock,
  User,
  Users,
  Inbox,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCw,
  Lock
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/auth.css';

export default function AdminUsers({
  currentUser,
  users = [],
  requests = [],
  isLoading = false,
  onRoleChange,
  onRevokeUser,
  onApproveRequest,
  onRejectRequest,
  onRefresh
}) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'requests'
  const [deletingUser, setDeletingUser] = useState(null);
  const [selectedRequestAction, setSelectedRequestAction] = useState(null); // { type: 'approve' | 'reject', request }

  const isAdministrator = currentUser?.role === 'Administrator';

  // Count pending requests for tab badge
  const pendingRequestsCount = requests.filter(
    (r) => (r.status || '').toLowerCase() === 'pending'
  ).length;

  const handleRoleSelect = (userItem, newRole) => {
    if (!isAdministrator) return;
    if (onRoleChange) {
      onRoleChange(userItem.id, newRole);
    }
  };

  const confirmRevoke = () => {
    if (deletingUser && onRevokeUser) {
      onRevokeUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const handleConfirmRequestAction = () => {
    if (!selectedRequestAction) return;
    const { type, request } = selectedRequestAction;

    if (type === 'approve' && onApproveRequest) {
      onApproveRequest(request);
    } else if (type === 'reject' && onRejectRequest) {
      onRejectRequest(request.id);
    }

    setSelectedRequestAction(null);
  };

  // ==========================================================================
  // TABLE 1: ACTIVE ADMIN USERS COLUMNS
  // ==========================================================================
  const userColumns = [
    {
      key: 'name',
      label: 'Admin Member',
      render: (row) => (
        <div className="admin-table-avatar-cell">
          {row.avatarUrl || row.avatar ? (
            <img
              src={row.avatarUrl || row.avatar}
              alt={row.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--admin-border-subtle)'
              }}
            />
          ) : (
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
          )}
          <div className="admin-table-title-cell">
            <span className="admin-table-main-text">{row.name}</span>
            <span className="admin-table-sub-text">{row.email || 'No email attached'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'CMS Role',
      render: (row) => {
        // If current user is Administrator, provide live role dropdown
        if (isAdministrator) {
          const isSelf = row.email === currentUser?.email || row.id === currentUser?.id;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                className="admin-role-select"
                value={row.role}
                onChange={(e) => handleRoleSelect(row, e.target.value)}
                disabled={isSelf}
                title={isSelf ? 'You cannot alter your own role' : 'Change CMS role'}
              >
                <option value="Administrator">Administrator</option>
                <option value="Editor">Editor</option>
              </select>
              {isSelf && (
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-faint)' }}>
                  (You)
                </span>
              )}
            </div>
          );
        }

        // Editors see read-only badge
        return (
          <Badge
            variant={row.role === 'Administrator' ? 'danger' : 'role'}
            label={row.role}
            showDot={false}
          />
        );
      }
    },
    {
      key: 'last_active',
      label: 'Last Active',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
          <Clock size={13} color="var(--admin-text-faint)" />
          <span>{row.lastActive || row.last_active || 'Recently'}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => {
        const isSelf = row.email === currentUser?.email || row.id === currentUser?.id;

        if (!isAdministrator) {
          return (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--admin-text-faint)',
                fontStyle: 'italic',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Lock size={12} /> Read-only
            </span>
          );
        }

        return (
          <div className="admin-table-actions-cell">
            <button
              type="button"
              className="admin-btn-icon"
              style={{ color: '#ef4444' }}
              title={isSelf ? 'Cannot remove yourself' : 'Revoke Access'}
              onClick={() => setDeletingUser(row)}
              disabled={isSelf}
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      }
    }
  ];

  // ==========================================================================
  // TABLE 2: REQUESTS TABLE COLUMNS
  // ==========================================================================
  const requestColumns = [
    {
      key: 'name',
      label: 'Applicant',
      render: (row) => (
        <div className="admin-table-avatar-cell">
          <div
            className="admin-avatar-fallback"
            style={{
              width: '36px',
              height: '36px',
              fontSize: '0.85rem',
              borderRadius: '50%',
              backgroundColor: 'var(--admin-card-subtle)',
              color: 'var(--admin-text-main)',
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
            <span className="admin-table-sub-text">{row.email || row.emai}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const s = (row.status || 'pending').toLowerCase();
        let badgeColor = '#EAB308';
        let badgeBg = 'rgba(234, 179, 8, 0.12)';
        let badgeBorder = 'rgba(234, 179, 8, 0.25)';
        let label = 'Pending Review';

        if (s === 'approved') {
          badgeColor = '#10B981';
          badgeBg = 'rgba(16, 185, 129, 0.12)';
          badgeBorder = 'rgba(16, 185, 129, 0.25)';
          label = 'Approved (Editor)';
        } else if (s === 'rejected') {
          badgeColor = '#EF4444';
          badgeBg = 'rgba(239, 68, 68, 0.12)';
          badgeBorder = 'rgba(239, 68, 68, 0.25)';
          label = 'Rejected';
        }

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: badgeColor,
              backgroundColor: badgeBg,
              border: `1px solid ${badgeBorder}`,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px'
            }}
          >
            {label}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      label: 'Requested Date',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
          <Clock size={13} color="var(--admin-text-faint)" />
          <span>
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'Recent'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'right',
      render: (row) => {
        const isPending = (row.status || '').toLowerCase() === 'pending';

        if (!isPending) {
          return (
            <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-faint)' }}>
              Resolved
            </span>
          );
        }

        // Only Administrator can Accept or Reject
        if (!isAdministrator) {
          return (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--admin-text-faint)',
                fontStyle: 'italic',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Lock size={12} /> Admin Only
            </span>
          );
        }

        return (
          <div className="admin-table-actions-cell" style={{ gap: '0.4rem' }}>
            {/* Accept Button */}
            <button
              type="button"
              className="admin-btn"
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.76rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Accept as Editor"
              onClick={() => setSelectedRequestAction({ type: 'approve', request: row })}
            >
              <CheckCircle2 size={13} />
              <span>Accept</span>
            </button>

            {/* Reject Button */}
            <button
              type="button"
              className="admin-btn"
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.76rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Reject Request"
              onClick={() => setSelectedRequestAction({ type: 'reject', request: row })}
            >
              <XCircle size={13} />
              <span>Reject</span>
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Admin Users & Access"
        subtitle="Manage authorized administrators, content editors, and pending Google access requests"
      >
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onRefresh}
          disabled={isLoading}
          title="Reload users and requests"
        >
          <RotateCw size={15} className={isLoading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </PageHeader>

      {/* Role explanation banner */}
      <div
        className="admin-card"
        style={{
          padding: '0.9rem 1.25rem',
          backgroundColor: isAdministrator ? 'rgba(37, 99, 235, 0.06)' : 'rgba(2, 132, 199, 0.06)',
          borderColor: isAdministrator ? 'rgba(37, 99, 235, 0.2)' : 'rgba(56, 189, 248, 0.2)',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={20} color="var(--admin-blue-primary)" />
          <div style={{ fontSize: '0.84rem', color: 'var(--admin-text-main)', lineHeight: 1.5 }}>
            {isAdministrator ? (
              <>
                <strong>Administrator Console:</strong> You can switch roles between <strong>Administrator</strong> and <strong>Editor</strong>, and approve or decline incoming Google access requests. Accepted members become <strong>Editors</strong> by default.
              </>
            ) : (
              <>
                <strong>Editor Access (Read-Only View):</strong> You have editor privileges to manage <strong>Events</strong> and <strong>Gallery</strong> sections. Only Administrators can modify roles or accept access requests.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tab-nav">
        <button
          type="button"
          className={`admin-tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          <span>Active Team Members</span>
          <span className="admin-tab-badge">{users.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <Inbox size={16} />
          <span>Access Requests</span>
          {pendingRequestsCount > 0 ? (
            <span className="admin-tab-badge warning">{pendingRequestsCount} Pending</span>
          ) : (
            <span className="admin-tab-badge" style={{ background: 'var(--admin-text-faint)' }}>
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ACTIVE ADMIN USERS */}
      {activeTab === 'users' && (
        <DataTable
          columns={userColumns}
          data={users}
          searchKey={(item, query) =>
            (item.name || '').toLowerCase().includes(query) ||
            (item.email || '').toLowerCase().includes(query) ||
            (item.role || '').toLowerCase().includes(query)
          }
          searchPlaceholder="Search admins & editors by name, email, or role..."
          emptyMessage="No active administrative users found."
        />
      )}

      {/* TAB 2: ACCESS REQUESTS */}
      {activeTab === 'requests' && (
        <DataTable
          columns={requestColumns}
          data={requests}
          searchKey={(item, query) =>
            (item.name || '').toLowerCase().includes(query) ||
            (item.email || item.emai || '').toLowerCase().includes(query) ||
            (item.status || '').toLowerCase().includes(query)
          }
          searchPlaceholder="Search access requests by applicant or status..."
          emptyMessage="No access requests have been submitted yet."
        />
      )}

      {/* Revoke Access Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        title="Revoke Admin Access"
        message={`Are you sure you want to remove administrator permissions for "${deletingUser?.name}" (${deletingUser?.email})?`}
        confirmLabel="Revoke Access"
        isDanger={true}
        onConfirm={confirmRevoke}
        onCancel={() => setDeletingUser(null)}
      />

      {/* Approve / Reject Request Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(selectedRequestAction)}
        title={
          selectedRequestAction?.type === 'approve'
            ? 'Approve Access Request'
            : 'Reject Access Request'
        }
        message={
          selectedRequestAction?.type === 'approve'
            ? `Approve "${selectedRequestAction?.request?.name}" as an Editor? They will be granted permission to manage Events and Gallery.`
            : `Are you sure you want to decline the access request for "${selectedRequestAction?.request?.name}"?`
        }
        confirmLabel={
          selectedRequestAction?.type === 'approve' ? 'Approve as Editor' : 'Reject Request'
        }
        isDanger={selectedRequestAction?.type === 'reject'}
        onConfirm={handleConfirmRequestAction}
        onCancel={() => setSelectedRequestAction(null)}
      />
    </div>
  );
}
