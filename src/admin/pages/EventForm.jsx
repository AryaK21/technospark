import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag, Link2, Image, Sparkles } from 'lucide-react';

// ============================================================================
// REUSABLE ADD / EDIT EVENT FORM MODAL
// ============================================================================
// A single, unified form component used for both creating new events and
// updating existing events in the Technospark CMS.
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // In handleSubmit:
// // If editing:
// //   const { data, error } = await supabase.from('events').update(formData).eq('id', initialData.id);
// // If creating:
// //   const { data, error } = await supabase.from('events').insert([formData]);
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
    title: '',
    category: 'Workshop',
    date: '',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: '',
    status: 'upcoming',
    registrationLink: '',
    coverImage: '/assets/images/event_hackathon_banner.jpg',
    description: '',
    highlights: '',
    badge: 'Open for Registration'
  };

  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Workshop',
        date: initialData.date || '',
        startTime: initialData.startTime || '10:00 AM',
        endTime: initialData.endTime || '04:00 PM',
        venue: initialData.venue || '',
        status: initialData.status || 'upcoming',
        registrationLink: initialData.registrationLink || '',
        coverImage: initialData.coverImage || '/assets/images/event_hackathon_banner.jpg',
        description: initialData.description || '',
        highlights: initialData.highlights || '',
        badge: initialData.badge || 'Featured'
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

    // Basic validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // =========================================================================
    // FUTURE SUPABASE INTEGRATION POINT
    // Replace the local onSubmit callback with a direct Supabase mutation.
    // Example:
    // if (isEditMode) {
    //   await supabase.from('events').update(formData).eq('id', initialData.id);
    // } else {
    //   await supabase.from('events').insert([{ ...formData, id: crypto.randomUUID() }]);
    // }
    // =========================================================================

    onSubmit({
      ...formData,
      id: isEditMode ? initialData.id : `evt-${Date.now()}`
    });
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-container" 
        style={{ maxWidth: '720px' }} 
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
          {/* Title */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              Event Title <span className="admin-form-required">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. TECHNOVA Hackathon 2026"
              className="admin-form-input"
            />
            {errors.title && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.title}</span>}
          </div>

          {/* Category & Status */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="admin-form-select"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Competition">Competition</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="admin-form-select"
              >
                <option value="upcoming">Upcoming (Active)</option>
                <option value="past">Past / Completed</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Date & Timings */}
          <div className="admin-form-row-3">
            <div className="admin-form-group">
              <label className="admin-form-label">
                Date <span className="admin-form-required">*</span>
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="e.g. 2026-10-24 or 24 Oct"
                className="admin-form-input"
              />
              {errors.date && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.date}</span>}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Start Time</label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="09:00 AM"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">End Time</label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="06:00 PM"
                className="admin-form-input"
              />
            </div>
          </div>

          {/* Venue & Registration Link */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">
                Venue / Location <span className="admin-form-required">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Computing Lab 3 • PCCOE"
                className="admin-form-input"
              />
              {errors.venue && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.venue}</span>}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Registration Link</label>
              <input
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleChange}
                placeholder="https://technospark.in/register/..."
                className="admin-form-input"
              />
            </div>
          </div>

          {/* Cover Image & Highlight Badge */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Cover Image Path</label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="/assets/images/event_hackathon_banner.jpg"
                className="admin-form-input"
              />
              <span className="admin-form-hint">Path in public/ or Supabase Storage URL later</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Highlight Badge Text</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. Flagship Event, Hands-on Lab"
                className="admin-form-input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="admin-form-group">
            <label className="admin-form-label">Event Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive summary of the event schedule, target audience, and prerequisites..."
              className="admin-form-textarea"
              rows={3}
            />
          </div>

          {/* Highlights */}
          <div className="admin-form-group">
            <label className="admin-form-label">Highlights / Key Perks</label>
            <input
              type="text"
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              placeholder="e.g. Cash prizes worth ₹50k, 1-on-1 mentorship, certificates"
              className="admin-form-input"
            />
          </div>

          {/* Modal Footer */}
          <div className="admin-modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
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
              {isEditMode ? 'Save Changes' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
