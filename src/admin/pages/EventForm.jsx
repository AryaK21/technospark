import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';

// ============================================================================
// REUSABLE ADD / EDIT EVENT FORM MODAL
// ============================================================================
// Aligned with PostgreSQL Table: public.events
//
// Schema:
// - id: uuid NOT NULL DEFAULT gen_random_uuid()
// - name: character varying NOT NULL DEFAULT ''
// - category: character varying
// - event_date: date
// - start_time: time without time zone
// - end_time: time without time zone
// - venue: character varying NOT NULL
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // In handleSubmit:
// // if (isEditMode) {
// //   const { data, error } = await supabase.from('events').update({
// //     name: formData.name,
// //     category: formData.category,
// //     event_date: formData.event_date,
// //     start_time: formData.start_time,
// //     end_time: formData.end_time,
// //     venue: formData.venue
// //   }).eq('id', initialData.id);
// // } else {
// //   const { data, error } = await supabase.from('events').insert([{
// //     name: formData.name,
// //     category: formData.category,
// //     event_date: formData.event_date,
// //     start_time: formData.start_time,
// //     end_time: formData.end_time,
// //     venue: formData.venue
// //   }]);
// // }
// // =========================================================================
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
    venue: ''
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
        venue: initialData.venue || ''
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
    if (!formData.event_date) newErrors.event_date = 'Event date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const eventPayload = {
      ...(isEditMode && initialData?.id ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      category: formData.category,
      event_date: formData.event_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      venue: formData.venue.trim(),
      // Legacy compatibility aliases for existing views
      title: formData.name.trim(),
      date: formData.event_date,
      startTime: formData.start_time,
      endTime: formData.end_time
    };

    onSubmit(eventPayload);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-container" 
        style={{ maxWidth: '640px' }} 
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
              <label className="admin-form-label">
                Event Date <span className="admin-form-required">*</span>
              </label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="admin-form-input"
              />
              {errors.event_date && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.event_date}</span>}
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
