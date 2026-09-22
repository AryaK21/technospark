import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Briefcase,
  Camera,
  UploadCloud,
  Trash2,
  Loader2,
  AlertTriangle,
  Check,
  Copy
} from 'lucide-react';
import {
  uploadOrganizerPhoto,
  ORGANIZERS_POLICY_SQL
} from '../../services/organizersService';

// ============================================================================
// ADD / EDIT ORGANIZER FORM MODAL (WITH SUPABASE PHOTO UPLOADER)
// ============================================================================
// - Uploads organizer profile images directly to Supabase storage bucket `organizers`
// - Stores the resulting image URL automatically in public.organizers SQL table
// - Text path input removed; replaced with intuitive drag-and-drop / avatar picker
// ============================================================================

export default function OrganizerForm({
  isOpen,
  initialData = null,
  onClose,
  onSubmit
}) {
  const isEditMode = Boolean(initialData && initialData.id);
  const fileInputRef = useRef(null);

  const defaultState = {
    name: '',
    role: '',
    linkedin: '',
    image: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRlsError, setIsRlsError] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.Name || '',
        role: initialData.role || '',
        linkedin: initialData.linkedin || initialData.profile || '',
        image: initialData.image || ''
      });
      // If editing and has existing image, show it as preview
      setPreviewUrl(initialData.image || null);
    } else {
      setFormData(defaultState);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setErrorMessage(null);
    setIsRlsError(false);
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Photo exceeds the 10MB upload limit. Please choose a smaller image.');
      return;
    }

    setErrorMessage(null);
    setIsRlsError(false);
    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(ORGANIZERS_POLICY_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Organizer Full Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setIsRlsError(false);

    let finalImageUrl = formData.image || '/assets/images/akshat.jpg';

    // 1. If user selected a new photo file, upload it to Supabase 'organizers' bucket
    if (selectedFile) {
      setUploadStatus('Uploading photo to Supabase organizers bucket...');
      const { url: uploadedUrl, error: uploadError, isRlsError: rlsFlag } =
        await uploadOrganizerPhoto(selectedFile);

      if (uploadError) {
        setIsSubmitting(false);
        setUploadStatus('');
        setIsRlsError(Boolean(rlsFlag));
        setErrorMessage(
          uploadError.message ||
          'Failed to upload photo to Supabase storage. Check bucket permissions.'
        );
        return;
      }

      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    // 2. Prepare payload with automatically stored image address
    const organizerPayload = {
      ...(isEditMode ? { id: initialData.id } : {}),
      Name: formData.name.trim(),
      name: formData.name.trim(),
      role: formData.role.trim() || 'Club Lead',
      linkedin: formData.linkedin.trim(),
      image: finalImageUrl,
      profile: formData.linkedin.trim()
    };

    setUploadStatus('Saving organizer to Supabase database...');

    try {
      const result = await onSubmit(organizerPayload);
      setIsSubmitting(false);
      setUploadStatus('');

      if (result && result.success === false) {
        setIsRlsError(Boolean(result.isRlsError));
        setErrorMessage(
          result.error?.message ||
          'Failed to save organizer to Supabase database. Row Level Security (RLS) is blocking inserts.'
        );
        return;
      }

      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setUploadStatus('');
      setErrorMessage(err.message || 'Failed to save organizer.');
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={!isSubmitting ? onClose : undefined}>
      <div
        className="admin-modal-container"
        style={{ maxWidth: '540px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--admin-sky-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h3 className="admin-modal-title" style={{ margin: 0 }}>
                {isEditMode ? 'Edit Organizer Profile' : 'Add New Organizer'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                Saves to <code style={{ color: 'var(--admin-blue-primary)' }}>public.organizers</code> &bull; Photo to <code style={{ color: 'var(--admin-blue-primary)' }}>organizers</code> bucket
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="admin-modal-body">
          {/* Photo Intake Area */}
          <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="admin-form-label">
              Profile Photo <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--admin-text-muted)' }}>(Stores to Supabase bucket)</span>
            </label>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1rem',
                backgroundColor: 'var(--admin-bg-table-header)',
                border: '1px solid var(--admin-border-subtle)',
                borderRadius: '10px'
              }}
            >
              {/* Photo Avatar Preview */}
              <div
                style={{
                  position: 'relative',
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#E2E8F0',
                  border: '2px solid var(--admin-border-blue)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--admin-shadow-sm)'
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Organizer preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/akshat.jpg';
                    }}
                  />
                ) : (
                  <User size={34} color="var(--admin-text-muted)" />
                )}

                {/* Quick Camera Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(11, 32, 70, 0.45)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                  title="Click to change photo"
                >
                  <Camera size={20} />
                </button>
              </div>

              {/* Upload Drop/Click Controls */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />

                <div
                  className={`admin-dropzone ${isDragging ? 'active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.65rem 0.75rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderStyle: 'dashed',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <UploadCloud size={16} color="var(--admin-sky-blue)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text-title)' }}>
                      {selectedFile ? 'Select a different photo' : 'Choose photo or drag here'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
                    JPG, PNG, or WebP up to 10MB
                  </div>
                </div>

                {selectedFile && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.4rem',
                      fontSize: '0.75rem',
                      color: 'var(--admin-text-muted)'
                    }}
                  >
                    <span
                      style={{
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={selectedFile.name}
                    >
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem'
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <span className="admin-form-hint">Direct link to organizer's public LinkedIn</span>
          </div>

          {/* Upload / Submission Status */}
          {isSubmitting && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.8rem 1rem',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Loader2 size={18} className="admin-spinner" style={{ color: 'var(--admin-sky-blue)' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-title)', fontWeight: 600 }}>
                {uploadStatus || 'Processing request...'}
              </div>
            </div>
          )}

          {/* Error Message & Supabase Policy Helper */}
          {errorMessage && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                color: '#991B1B'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Operation Failed</div>
                  <div>{errorMessage}</div>
                </div>
              </div>

              {/* RLS Policy Notice */}
              {isRlsError && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FECACA',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#7F1D1D'
                  }}
                >
                  <p style={{ margin: '0 0 0.4rem 0', fontWeight: 600 }}>
                    Notice: Supabase Row Level Security (RLS) is blocking the organizers table or bucket.
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    Open your <strong>Supabase SQL Editor</strong> and execute the following policies:
                  </p>
                  <pre
                    style={{
                      margin: 0,
                      padding: '0.5rem',
                      backgroundColor: '#1E293B',
                      color: '#E2E8F0',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      overflowX: 'auto',
                      lineHeight: 1.4
                    }}
                  >
                    {ORGANIZERS_POLICY_SQL}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="admin-btn admin-btn-sm"
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#334155'
                    }}
                  >
                    {copiedSql ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Policy'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Modal Footer */}
          <div
            className="admin-modal-footer"
            style={{
              margin: '1.25rem -1.5rem -1.5rem -1.5rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}
          >
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="admin-spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Profile' : 'Save Organizer'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
