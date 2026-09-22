import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Clock, MapPin, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import EventForm from './EventForm';
import { mockEvents } from '../data/mockData';

// ============================================================================
// EVENTS ADMIN MANAGEMENT PAGE (/admin/events)
// ============================================================================
// Administrators can view, search, filter, create, edit, and delete events.
// Synchronized with live Supabase table: public.events
// ============================================================================

export default function Events({
  events = [],
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onRefresh
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingEvent) {
      onUpdateEvent(formData);
    } else {
      onAddEvent(formData);
    }
  };

  const confirmDelete = () => {
    if (deletingEvent) {
      onDeleteEvent(deletingEvent.id);
      setDeletingEvent(null);
    }
  };

  // Table Columns Definition (Aligned with PostgreSQL public.events schema)
  const columns = [
    {
      key: 'name',
      label: 'Event Name',
      render: (row) => (
        <div className="admin-table-title-cell">
          <span className="admin-table-main-text">{row.name || row.title}</span>
          <span className="admin-table-sub-text">
            ID: <code style={{ fontSize: '0.72rem', opacity: 0.8 }}>{String(row.id).slice(0, 8)}...</code>
          </span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-blue-primary)' }}>
          {row.category || 'General'}
        </span>
      )
    },
    {
      key: 'event_date',
      label: 'Date & Time',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--admin-text-main)' }}>
            <Calendar size={13} color="var(--admin-blue-primary)" />
            <span>{row.event_date || row.date || 'No Date'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--admin-text-muted)' }}>
            <Clock size={13} />
            <span>{row.start_time || row.startTime || 'TBD'} - {row.end_time || row.endTime || 'TBD'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'venue',
      label: 'Venue',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', maxWidth: '200px', color: 'var(--admin-text-main)' }}>
          <MapPin size={13} color="var(--admin-text-faint)" />
          <span title={row.venue} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.venue}
          </span>
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
            title="Edit event"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="admin-btn-icon"
            style={{ color: '#f87171' }}
            title="Delete event"
            onClick={() => setDeletingEvent(row)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];


  const filterOptions = [
    { value: 'Hackathon', label: 'Hackathons' },
    { value: 'Workshop', label: 'Workshops' },
    { value: 'Seminar', label: 'Seminars' },
    { value: 'Competition', label: 'Competitions' },
    { value: 'upcoming', label: 'Status: Upcoming' },
    { value: 'past', label: 'Status: Past' },
    { value: 'draft', label: 'Status: Draft' }
  ];

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Events Management"
        subtitle={`Manage club hackathons, workshops, and tech seminars (${events.length} total events)`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {onRefresh && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onRefresh}
              title="Sync with Supabase"
            >
              <RefreshCw size={14} />
              <span>Sync</span>
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        </div>
      </PageHeader>

      {/* Events Data Table */}
      <DataTable
        columns={columns}
        data={events}
        searchKey={(item, query) =>
          (item.name || item.title || '').toLowerCase().includes(query) ||
          (item.venue || '').toLowerCase().includes(query) ||
          (item.category || '').toLowerCase().includes(query)
        }
        searchPlaceholder="Search events by name, venue, or category..."
        filterOptions={filterOptions}
        filterKey="category"
        emptyMessage="No events found matching your filter criteria."
      />

      {/* Reusable Add / Edit Modal Form */}
      <EventForm
        isOpen={isFormOpen}
        initialData={editingEvent}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingEvent)}
        title="Delete Event"
        message={`Are you sure you want to delete "${deletingEvent?.name || deletingEvent?.title}"? This event will be permanently deleted from the records.`}
        confirmLabel="Delete Event"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEvent(null)}
      />
    </div>
  );
}
