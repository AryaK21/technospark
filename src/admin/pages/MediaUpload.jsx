import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Video, Trash2, CheckCircle2 } from 'lucide-react';
import { mockEvents } from '../data/mockData';


// ============================================================================
// MEDIA UPLOAD MODAL COMPONENT (IMAGES & VIDEOS)
// ============================================================================
// Provides a frontend drag-and-drop file staging area and metadata form.
//
// IMPORTANT FOR FUTURE SUPABASE STORAGE INTEGRATION:
// // =========================================================================
// // TODO: SUPABASE STORAGE CONNECTION
// // When connecting the backend:
// // 1. Upload the raw File object to the Supabase Storage bucket 'gallery-media':
// //    const filePath = `uploads/${Date.now()}_${file.name}`;
// //      .upload(filePath, selectedFile);
// //      .from('gallery-media')
// //    const { data: uploadData, error: uploadError } = await supabase.storage
// //
// // 2. Retrieve public CDN URL:
// //    const { data: { publicUrl } } = supabase.storage
// //      .from('gallery-media')
// //      .getPublicUrl(filePath);
// //
// // 3. Insert record into 'gallery' database table:
// //    await supabase.from('gallery').insert([{
// //      title: formData.title,
// //      media_type: formData.mediaType,
// //      url: publicUrl,
// //      associated_event: formData.associatedEvent,
// //      caption: formData.caption
// //    }]);
// // =========================================================================
// ============================================================================

export default function MediaUpload({
  isOpen,
  onClose,
  onUploadComplete
}) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    mediaType: 'image',
    associatedEvent: 'TECHNOVA HACKATHON 2026',
    caption: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleFileSelect = (file) => {
    if (!file) return;

    // Detect type
    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');

    if (!isImage && !isVideo) {
      alert('Please select a valid image (JPG, PNG, WebP) or video (MP4, WebM) file.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Auto-populate default title & type if empty
    setFormData((prev) => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      mediaType: isVideo ? 'video' : 'image'
    }));
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Media title is required';
    if (!selectedFile && !previewUrl) newErrors.file = 'Please choose a file or image URL to upload';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Pass data back to parent handler
    onUploadComplete({
      id: `gal-${Date.now()}`,
      title: formData.title,
      mediaType: formData.mediaType,
      url: previewUrl || '/assets/images/event_hackathon_banner.jpg',
      thumbnail: previewUrl || '/assets/images/event_hackathon_banner.jpg',
      associatedEvent: formData.associatedEvent,
      caption: formData.caption,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
      dimensions: formData.mediaType === 'video' ? '1080p 60fps' : '1920 x 1080'
    });

    handleRemoveFile();
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-container"
        style={{ maxWidth: '650px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--admin-sky-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UploadCloud size={18} />
            </div>
            <h3 className="admin-modal-title">Upload Gallery Media</h3>
          </div>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={onClose}
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="admin-modal-body">
          {/* Drag & Drop File Zone */}
          {!selectedFile ? (
            <div
              className={`admin-dropzone ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className="admin-dropzone-icon">
                <UploadCloud size={24} />
              </div>
              <div className="admin-dropzone-title">
                Drag & drop image or video here, or <span style={{ color: 'var(--admin-sky-blue)' }}>browse</span>
              </div>
              <div className="admin-dropzone-sub">
                Supports JPG, PNG, WebP, MP4, WebM up to 50MB
              </div>
              {errors.file && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.file}</span>}
            </div>
          ) : (
            <div className="admin-media-preview-container">
              {formData.mediaType === 'video' ? (
                <video
                  src={previewUrl}
                  controls
                  className="admin-media-preview-img"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="admin-media-preview-img"
                />
              )}
              <button
                type="button"
                className="admin-media-preview-remove"
                onClick={handleRemoveFile}
              >
                <Trash2 size={13} />
                <span>Change File</span>
              </button>
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            {/* Title */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                Media Title / Caption <span className="admin-form-required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. TECHNOVA 2026 Opening Ceremony Keynote"
                className="admin-form-input"
              />
              {errors.title && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.title}</span>}
            </div>

            {/* Media Type & Event Association */}
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Media Type</label>
                <select
                  name="mediaType"
                  value={formData.mediaType}
                  onChange={handleChange}
                  className="admin-form-select"
                >
                  <option value="image">Image / Photo</option>
                  <option value="video">Video Clip / Reel</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Associated Event</label>
                <select
                  name="associatedEvent"
                  value={formData.associatedEvent}
                  onChange={handleChange}
                  className="admin-form-select"
                >
                  <option value="General Showcase">General Club Activity</option>
                  {mockEvents.map((e) => (
                    <option key={e.id} value={e.title}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description / Caption */}
            <div className="admin-form-group">
              <label className="admin-form-label">Detailed Caption</label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                placeholder="Optional context about the event, student builders, or prizes..."
                className="admin-form-textarea"
                rows={2}
              />
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
              <UploadCloud size={16} />
              <span>Confirm & Upload</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
