import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Clock, MapPin } from 'lucide-react';
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
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // 1. Replace the local `events` state with a Supabase query:
// //    const { data: events, error } = await supabase.from('events').select('*').order('date', { ascending: true });
// // 2. Replace handleDeleteEvent with:
// //    await supabase.from('events').delete().eq('id', eventToDelete.id);
// // =========================================================================
// ============================================================================

export default function Events({
  events = mockEvents,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
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

  // Table Columns Definition
  const columns = [
    {
      key: 'title',
      label: 'Event Info',
      render: (row) => (
        <div className="admin-table-title-cell">
          <span className="admin-table-main-text">{row.title}</span>
          <span className="admin-table-sub-text">
            {row.badge || row.category}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-sky-blue)' }}>
          {row.category}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Date & Timing',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--admin-text-main)' }}>
            <Calendar size={13} color="var(--admin-sky-blue)" />
            <span>{row.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--admin-text-muted)' }}>
            <Clock size={13} />
            <span>{row.startTime || 'TBD'} - {row.endTime || ''}</span>
          </div>
        </div>
      )
    },
    {
      key: 'venue',
      label: 'Venue',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', maxWidth: '180px', color: 'var(--admin-text-main)' }}>
          <MapPin size={13} color="var(--admin-text-faint)" />
          <span title={row.venue} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.venue}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status} label={row.status} />
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="admin-table-actions-cell">
          {row.registrationLink && (
            <a
              href={row.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-icon"
              title="Open Registration Link"
            >
              <ExternalLink size={14} />
            </a>
          )}
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
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} />
          <span>Add Event</span>
        </button>
      </PageHeader>

      {/* Events Data Table */}
      <DataTable
        columns={columns}
        data={events}
        searchKey={(item, query) =>
          item.title.toLowerCase().includes(query) ||
          item.venue.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        }
        searchPlaceholder="Search events by title, venue, or category..."
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
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This event will be removed from both the public schedule and CMS.`}
        confirmLabel="Delete Event"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEvent(null)}
      />
    </div>
  );
}
