import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Users,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import OrganizerForm from './OrganizerForm';
import { mockOrganizers } from '../data/mockData';

// ============================================================================
// ORGANIZERS ADMIN MANAGEMENT PAGE (/admin/organizers)
// ============================================================================
// Administrators can view, create, edit, and delete organizers directly from
// Supabase public.organizers table and organizers storage bucket.
// ============================================================================

export default function Organizers({
  organizers = mockOrganizers,
  isLoading = false,
  onAddOrganizer,
  onUpdateOrganizer,
  onDeleteOrganizer,
  onRefresh
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deletingOrg, setDeletingOrg] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenAdd = () => {
    setEditingOrg(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (org) => {
    setEditingOrg(org);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingOrg) {
      return await onUpdateOrganizer(formData);
    } else {
      return await onAddOrganizer(formData);
    }
  };

  const confirmDelete = async () => {
    if (deletingOrg) {
      await onDeleteOrganizer(deletingOrg.id, deletingOrg.image);
      setDeletingOrg(null);
    }
  };

  const handleRefreshClick = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  // Table Columns Definition (Aligned with PostgreSQL public.organizers schema)
  const columns = [
    {
      key: 'name',
      label: 'Organizer',
      render: (row) => (
        <div className="admin-table-avatar-cell">
          <img
            src={row.image || '/assets/images/akshat.jpg'}
            alt={row.name || row.Name}
            className="admin-table-avatar-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/akshat.jpg';
            }}
          />
          <div className="admin-table-title-cell">
            <span className="admin-table-main-text">{row.name || row.Name}</span>
            <span className="admin-table-sub-text">
              {row.id ? `ID: #${row.id}` : 'Pending Save'}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role / Designation',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--admin-text-title)', fontSize: '0.85rem' }}>
          {row.role || 'Club Lead'}
        </span>
      )
    },
    {
      key: 'linkedin',
      label: 'LinkedIn Profile',
      render: (row) => {
        const link = row.linkedin || row.profile;
        if (!link) {
          return <span style={{ color: 'var(--admin-text-faint)', fontSize: '0.8rem' }}>Not provided</span>;
        }
        return (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: 'var(--admin-blue-primary)',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            <span>View Profile</span>
            <ExternalLink size={12} />
          </a>
        );
      }
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
            title="Edit organizer"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="admin-btn-icon"
            style={{ color: '#f87171' }}
            title="Delete organizer"
            onClick={() => setDeletingOrg(row)}
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
        title="Organizers & Leadership"
        subtitle={`Manage club team profiles stored in Supabase public.organizers (${organizers.length} total organizers)`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {onRefresh && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleRefreshClick}
              disabled={isRefreshing || isLoading}
              title="Refresh from Supabase"
            >
              <RefreshCw size={15} className={isRefreshing || isLoading ? 'admin-spinner' : ''} />
              <span>Refresh</span>
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Add Organizer</span>
          </button>
        </div>
      </PageHeader>

      {/* Database & Storage Status Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={14} color="var(--admin-blue-primary)" />
            <span>Total Team: <strong>{organizers.length}</strong></span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: 'var(--admin-text-muted)',
              backgroundColor: 'var(--admin-bg-table-header)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--admin-border-subtle)'
            }}
          >
            <HardDrive size={13} color="var(--admin-sky-blue)" />
            <span>Storage: <strong>organizers</strong> bucket</span>
          </div>
        </div>
      </div>

      {/* Organizers Data Table */}
      <DataTable
        columns={columns}
        data={organizers}
        searchKey={(item, query) =>
          (item.name || item.Name || '').toLowerCase().includes(query) ||
          (item.role || '').toLowerCase().includes(query)
        }
        searchPlaceholder="Search organizers by name or role..."
        emptyMessage="No organizers found matching your search."
      />

      {/* Reusable Add / Edit Modal Form with Image Intake */}
      <OrganizerForm
        isOpen={isFormOpen}
        initialData={editingOrg}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingOrg)}
        title="Delete Organizer Profile"
        message={`Are you sure you want to remove "${deletingOrg?.name || deletingOrg?.Name}" from the team directory?`}
        confirmLabel="Delete Organizer"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingOrg(null)}
      />
    </div>
  );
}
