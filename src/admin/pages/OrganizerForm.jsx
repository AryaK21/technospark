import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Image as ImageIcon } from 'lucide-react';

// ============================================================================
// REUSABLE ADD / EDIT ORGANIZER FORM MODAL
// ============================================================================
// Aligned with PostgreSQL Table: public.organizers
//
// Schema:
// - id: bigint GENERATED ALWAYS AS IDENTITY NOT NULL
// - Name: character varying NOT NULL
// - role: character varying
// - linkedin: text
// - image: text
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // In handleSubmit:
// // if (isEditMode) {
// //   await supabase.from('organizers').update({
// //     Name: formData.name,
// //     role: formData.role,
// //     linkedin: formData.linkedin,
// //     image: formData.image
// //   }).eq('id', initialData.id);
// // } else {
// //   await supabase.from('organizers').insert([{
// //     Name: formData.name,
// //     role: formData.role,
// //     linkedin: formData.linkedin,
// //     image: formData.image
// //   }]);
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
    role: '',
    linkedin: '',
    image: '/assets/images/akshat.jpg'
  };

  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.Name || '',
        role: initialData.role || '',
        linkedin: initialData.linkedin || initialData.profile || '',
        image: initialData.image || '/assets/images/akshat.jpg'
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

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Organizer Name is required (NOT NULL)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const organizerPayload = {
      id: isEditMode ? initialData.id : Date.now(),
      name: formData.name.trim(),
      Name: formData.name.trim(),
      role: formData.role.trim(),
      linkedin: formData.linkedin.trim(),
      image: formData.image.trim(),
      // Backward compatibility aliases
      profile: formData.linkedin.trim()
    };

    onSubmit(organizerPayload);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-container"
        style={{ maxWidth: '560px' }}
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
          {/* 1. Name (character varying NOT NULL) */}
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

          {/* 2. role (character varying) */}
          <div className="admin-form-group">
            <label className="admin-form-label">Role / Designation</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. GDGoC Organizer & Lead"
              className="admin-form-input"
            />
          </div>

          {/* 3. linkedin (text) */}
          <div className="admin-form-group">
            <label className="admin-form-label">LinkedIn Profile URL</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="admin-form-input"
            />
            <span className="admin-form-hint">Public LinkedIn profile link</span>
          </div>

          {/* 4. image (text) */}
          <div className="admin-form-group">
            <label className="admin-form-label">Profile Image Path / URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/assets/images/akshat.jpg or URL"
              className="admin-form-input"
            />
            <span className="admin-form-hint">Path in public assets or hosted image URL</span>
          </div>

          {/* Preview pill */}
          {formData.image && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--admin-radius-md)', backgroundColor: 'var(--admin-card-subtle)', border: '1px solid var(--admin-border-subtle)' }}>
              <img
                src={formData.image}
                alt="Preview"
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{ fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--admin-text-title)' }}>
                  {formData.name || 'Organizer Name'}
                </div>
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                  {formData.role || 'Designation'}
                </div>
              </div>
            </div>
          )}

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
              {isEditMode ? 'Update Profile' : 'Save Organizer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
