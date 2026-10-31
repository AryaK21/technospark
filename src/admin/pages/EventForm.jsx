import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag, FileText, Link as LinkIcon } from 'lucide-react';

// ============================================================================
// REUSABLE ADD / EDIT EVENT FORM MODAL
// ============================================================================
// Aligned with PostgreSQL Table: public.events
//
// Table Schema (PostgreSQL):
// - id: uuid NOT NULL DEFAULT gen_random_uuid()
// - name: character varying NOT NULL DEFAULT ''
// - category: character varying NULL
// - event_date: date NULL
// - start_time: time without time zone NULL
// - end_time: time without time zone NULL
// - venue: character varying NOT NULL
// - "event_Description": character varying NULL
// - "Registration link": character varying NULL (OPTIONAL)
// ============================================================================

export default function EventForm({
  isOpen,
  initialData = null,
  onClose,
  onSubmit
}) {
  const isEditMode = Boolean(initialData && initialData.id);

  const defaultState = {
    name: '',
    category: 'Workshop',
    event_date: '',
    start_time: '10:00',
    end_time: '16:00',
    venue: '',
    event_Description: '',
    'Registration link': ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.title || '',
        category: initialData.category || 'Workshop',
        event_date: initialData.event_date || initialData.date || '',
        start_time: initialData.start_time || initialData.startTime || '10:00',
        end_time: initialData.end_time || initialData.endTime || '16:00',
        venue: initialData.venue || '',
        event_Description: initialData.event_Description || initialData.description || '',
        'Registration link': initialData['Registration link'] || initialData.registration_link || initialData.registrationLink || ''
      });
    } else {
      setFormData(defaultState);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // PostgreSQL schema validations: name and venue are NOT NULL
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required (NOT NULL)';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required (NOT NULL)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const regLink = formData['Registration link'] ? formData['Registration link'].trim() : null;
    const description = formData.event_Description ? formData.event_Description.trim() : null;

    const eventPayload = {
      ...(isEditMode && initialData?.id ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      category: formData.category || null,
      event_date: formData.event_date || null,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      venue: formData.venue.trim(),
      'event_Description': description,
      'Registration link': regLink,
      // Compatibility aliases
      title: formData.name.trim(),
      date: formData.event_date || '',
      startTime: formData.start_time || '',
      endTime: formData.end_time || '',
      description: description || '',
      registration_link: regLink || ''
    };

    onSubmit(eventPayload);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-container" 
        style={{ maxWidth: '680px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">
            {isEditMode ? 'Edit Event Details' : 'Create New Event'}
          </h3>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="admin-modal-body">
          {/* 1. name (character varying NOT NULL) */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              Event Name <span className="admin-form-required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. TECHNOVA Hackathon 2026"
              className="admin-form-input"
            />
            {errors.name && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.name}</span>}
          </div>

          {/* 2. category (character varying) */}
          <div className="admin-form-group">
            <label className="admin-form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="admin-form-select"
            >
              <option value="Workshop">Workshop</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Seminar">Seminar</option>
              <option value="Competition">Competition</option>
              <option value="Webinar">Webinar</option>
              <option value="Bootcamp">Bootcamp</option>
            </select>
          </div>

          {/* 3. event_date (date) & start_time / end_time (time without time zone) */}
          <div className="admin-form-row-3">
            <div className="admin-form-group">
              <label className="admin-form-label">Event Date</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">End Time</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>
          </div>

          {/* 4. venue (character varying NOT NULL) */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              Venue / Location <span className="admin-form-required">*</span>
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. PCCOE Campus Tech Hub, Pune"
              className="admin-form-input"
            />
            {errors.venue && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.venue}</span>}
          </div>

          {/* 5. event_Description (character varying NULL) */}
          <div className="admin-form-group">
            <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={14} color="var(--admin-blue-primary)" />
              <span>Event Description</span>
            </label>
            <textarea
              name="event_Description"
              rows={3}
              value={formData.event_Description}
              onChange={handleChange}
              placeholder="Brief details about the event, problem statements, domains, or schedule..."
              className="admin-form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* 6. Registration link (character varying NULL, OPTIONAL) */}
          <div className="admin-form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="admin-form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <LinkIcon size={14} color="var(--admin-sky-blue)" />
                <span>Registration Link</span>
              </label>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--admin-text-faint)',
                  backgroundColor: 'var(--admin-bg-table-header)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px'
                }}
              >
                Optional
              </span>
            </div>
            <input
              type="url"
              name="Registration link"
              value={formData['Registration link']}
              onChange={handleChange}
              placeholder="e.g. https://unstop.com/... or https://forms.gle/... (optional)"
              className="admin-form-input"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-faint)', marginTop: '0.2rem', display: 'block' }}>
              Leave blank if registration is closed, on-spot, or not required.
            </span>
          </div>

          {/* Modal Footer */}
          <div className="admin-modal-footer" style={{ margin: '1.25rem -1.5rem -1.5rem -1.5rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
            >
              {isEditMode ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
