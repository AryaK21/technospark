import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Users, Mail, ArrowUpDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import OrganizerForm from './OrganizerForm';
import { mockOrganizers } from '../data/mockData';

// ============================================================================
// ORGANIZERS ADMIN MANAGEMENT PAGE (/admin/organizers)
// ============================================================================
// Administrators can view, create, edit, order, and toggle organizers.
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // 1. Fetch organizers:
// //    const { data: organizers, error } = await supabase.from('organizers').select('*').order('display_order');
// // 2. Delete organizer:
// //    await supabase.from('organizers').delete().eq('id', orgToDelete.id);
// // =========================================================================
// ============================================================================

export default function Organizers({
  organizers = mockOrganizers,
  onAddOrganizer,
  onUpdateOrganizer,
  onDeleteOrganizer
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deletingOrg, setDeletingOrg] = useState(null);

  const handleOpenAdd = () => {
    setEditingOrg(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (org) => {
    setEditingOrg(org);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingOrg) {
      onUpdateOrganizer(formData);
    } else {
      onAddOrganizer(formData);
    }
  };

  const confirmDelete = () => {
    if (deletingOrg) {
      onDeleteOrganizer(deletingOrg.id);
      setDeletingOrg(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Organizer',
      render: (row) => (
        <div className="admin-table-avatar-cell">
          <img
            src={row.image || '/assets/images/akshat.jpg'}
            alt={row.name}
            className="admin-table-avatar-img"
          />
          <div className="admin-table-title-cell">
            <span className="admin-table-main-text">{row.name}</span>
            <span className="admin-table-sub-text">{row.email || 'No email specified'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Designation / Role',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--admin-text-title)', fontSize: '0.85rem' }}>
          {row.role}
        </span>
      )
    },
    {
      key: 'displayOrder',
      label: 'Order',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--admin-sky-blue)' }}>
          <ArrowUpDown size={12} />
          <span>#{row.displayOrder || 1}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="admin-table-actions-cell">
          {row.profile && row.profile !== '#' && (
            <a
              href={row.profile}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-icon"
              title="View Profile Link"
            >
              <ExternalLink size={14} />
            </a>
          )}
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
        subtitle={`Manage club team profiles, student leads, and display order (${organizers.length} total organizers)`}
      >
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} />
          <span>Add Organizer</span>
        </button>
      </PageHeader>

      {/* Organizers Data Table */}
      <DataTable
        columns={columns}
        data={organizers}
        searchKey={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query)
        }
        searchPlaceholder="Search organizers by name or role..."
        emptyMessage="No organizers found matching your search."
      />

      {/* Reusable Add / Edit Modal Form */}
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
        message={`Are you sure you want to remove "${deletingOrg?.name}" from the organizers directory?`}
        confirmLabel="Delete Profile"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingOrg(null)}
      />
    </div>
  );
}
