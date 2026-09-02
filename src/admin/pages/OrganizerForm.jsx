import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Link as LinkIcon, Image, Check } from 'lucide-react';

// ============================================================================
// REUSABLE ADD / EDIT ORGANIZER FORM MODAL
// ============================================================================
// A single, unified form component for creating and editing club leads,
// facilitators, and core team organizers.
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // In handleSubmit:
// // if (isEditMode) {
// //   await supabase.from('organizers').update(formData).eq('id', initialData.id);
// // } else {
// //   await supabase.from('organizers').insert([formData]);
// // }
// // =========================================================================
// ============================================================================

export default function OrganizerForm({
  isOpen,
  initialData = null,
  onClose,
  onSubmit
}) {
  const isEditMode = Boolean(initialData && initialData.id);

  const defaultState = {
    name: '',
    role: 'Core Team',
    bio: '',
    image: '/assets/images/akshat.jpg',
    profile: 'https://linkedin.com',
    displayOrder: 1,
    status: 'active',
    email: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || 'Core Team',
        bio: initialData.bio || '',
        image: initialData.image || '/assets/images/akshat.jpg',
        profile: initialData.profile || 'https://linkedin.com',
        displayOrder: initialData.displayOrder || 1,
        status: initialData.status || 'active',
        email: initialData.email || ''
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

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Organizer name is required';
    if (!formData.role.trim()) newErrors.role = 'Role / designation is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // =========================================================================
    // FUTURE SUPABASE INTEGRATION POINT
    // Replace with Supabase insert / update:
    // supabase.from('organizers').upsert(...)
    // =========================================================================

    onSubmit({
      ...formData,
      id: isEditMode ? initialData.id : `org-${Date.now()}`
    });
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-container" 
        style={{ maxWidth: '600px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">
            {isEditMode ? 'Edit Organizer Profile' : 'Add New Organizer'}
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
          {/* Name & Role */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">
                Full Name <span className="admin-form-required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Akshat Shrivastava"
                className="admin-form-input"
              />
              {errors.name && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.name}</span>}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                Role / Designation <span className="admin-form-required">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. GDGoC Organizer, Lead"
                className="admin-form-input"
              />
              {errors.role && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.role}</span>}
            </div>
          </div>

          {/* Email & Profile URL */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@technospark.org"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Profile / LinkedIn URL</label>
              <input
                type="url"
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="admin-form-input"
              />
            </div>
          </div>

          {/* Profile Image & Display Order */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Profile Image Path</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/assets/images/akshat.jpg"
                className="admin-form-input"
              />
              <span className="admin-form-hint">Path in public/assets/images/ or Supabase URL</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Display Order</label>
              <input
                type="number"
                name="displayOrder"
                min="1"
                max="99"
                value={formData.displayOrder}
                onChange={handleChange}
                className="admin-form-input"
              />
              <span className="admin-form-hint">Order in which card appears on the site</span>
            </div>
          </div>

          {/* Bio */}
          <div className="admin-form-group">
            <label className="admin-form-label">Short Bio / Responsibilities</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Coordinates technical bootcamps, manages partnerships..."
              className="admin-form-textarea"
              rows={2}
            />
          </div>

          {/* Active Status Toggle */}
          <div className="admin-form-group">
            <label className="admin-form-label">Visibility Status</label>
            <div 
              className="admin-toggle-wrapper"
              onClick={toggleStatus}
            >
              <div className={`admin-toggle-switch ${formData.status === 'active' ? 'checked' : ''}`}>
                <div className="admin-toggle-knob" />
              </div>
              <span className="admin-toggle-label">
                {formData.status === 'active' ? 'Active (Visible on public site)' : 'Inactive (Hidden)'}
              </span>
            </div>
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
              {isEditMode ? 'Update Profile' : 'Add Organizer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
