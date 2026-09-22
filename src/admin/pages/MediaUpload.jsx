import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Video,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  FileCheck
} from 'lucide-react';
import {
  uploadMediaToGallery,
  STORAGE_POLICY_SQL,
  formatFileSize
} from '../../services/galleryService';

// ============================================================================
// STREAMLINED MEDIA UPLOAD MODAL (SUPABASE STORAGE `gallery` BUCKET)
// ============================================================================
// Direct file uploader for photos and videos straight to the Supabase
// storage bucket 'gallery'.
//
// Unnecessary fields (title, media type, associative event, caption) have been
// removed for a fast, frictionless drag-and-drop workflow.
// Media type is auto-detected from MIME type.
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
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRlsError, setIsRlsError] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (file) => {
    if (!file) return;

    // Detect file type
    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');

    if (!isImage && !isVideo) {
      setErrorMessage('Please select a valid image (JPG, PNG, WebP, GIF) or video (MP4, WebM) file.');
      return;
    }

    // Size limit check (e.g. 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File exceeds the 50MB upload limit. Please select a smaller file.');
      return;
    }

    setErrorMessage(null);
    setIsRlsError(false);
    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setIsRlsError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(STORAGE_POLICY_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select an image or video file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setIsRlsError(false);

    const { data: newMedia, error, isRlsError: rlsFlag } = await uploadMediaToGallery(selectedFile);

    setIsUploading(false);

    if (error) {
      console.error('[MediaUpload] Upload failed:', error);
      setIsRlsError(Boolean(rlsFlag));
      setErrorMessage(
        error.message ||
        'Failed to upload media to Supabase Storage. Check bucket permissions.'
      );
      return;
    }

    // Success! Notify parent component
    if (onUploadComplete && newMedia) {
      onUploadComplete(newMedia);
    }

    handleRemoveFile();
    onClose();
  };

  const isVideo = selectedFile?.type?.startsWith('video');

  return (
    <div className="admin-modal-backdrop" onClick={!isUploading ? onClose : undefined}>
      <div
        className="admin-modal-container"
        style={{ maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="admin-modal-title" style={{ margin: 0 }}>
                Upload to Gallery Bucket
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                Target: Supabase Storage &bull; <code style={{ color: 'var(--admin-blue-primary)' }}>gallery</code> bucket
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleUpload} className="admin-modal-body">
          {/* Drag & Drop File Zone */}
          {!selectedFile ? (
            <div
              className={`admin-dropzone ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '2.5rem 1.5rem', cursor: 'pointer' }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className="admin-dropzone-icon">
                <UploadCloud size={28} />
              </div>
              <div className="admin-dropzone-title" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
                Drag & drop media here, or <span style={{ color: 'var(--admin-sky-blue)' }}>browse</span>
              </div>
              <div className="admin-dropzone-sub" style={{ marginTop: '0.25rem' }}>
                Supports JPG, PNG, WebP, GIF, MP4, WebM (up to 50MB)
              </div>
            </div>
          ) : (
            <div>
              {/* Media Preview Box */}
              <div className="admin-media-preview-container" style={{ maxHeight: '280px' }}>
                {isVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    className="admin-media-preview-img"
                    style={{ maxHeight: '280px' }}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    className="admin-media-preview-img"
                    style={{ maxHeight: '280px' }}
                  />
                )}
                {!isUploading && (
                  <button
                    type="button"
                    className="admin-media-preview-remove"
                    onClick={handleRemoveFile}
                    title="Choose a different file"
                  >
                    <Trash2 size={13} />
                    <span>Change File</span>
                  </button>
                )}
              </div>

              {/* Selected File Details */}
              <div
                style={{
                  marginTop: '0.85rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--admin-bg-table-header)',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                  {isVideo ? (
                    <Video size={18} color="var(--admin-sky-blue)" />
                  ) : (
                    <ImageIcon size={18} color="var(--admin-blue-primary)" />
                  )}
                  <div style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--admin-text-title)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={selectedFile.name}
                    >
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                      {formatFileSize(selectedFile.size)} &bull; {isVideo ? 'Video Clip' : 'Image Photo'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: isVideo ? 'rgba(56, 189, 248, 0.15)' : 'rgba(11, 32, 70, 0.08)',
                    color: isVideo ? 'var(--admin-sky-blue)' : 'var(--admin-blue-primary)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isVideo ? 'Video' : 'Image'}
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress State */}
          {isUploading && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Loader2 size={18} className="admin-spinner" style={{ color: 'var(--admin-sky-blue)' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-title)' }}>
                  Uploading media to Supabase Storage...
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  Saving file to bucket: <code>gallery</code>
                </div>
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
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Upload Failed</div>
                  <div>{errorMessage}</div>
                </div>
              </div>

              {/* RLS Policy instructions if permission blocked */}
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
                    Tip: Supabase Storage Row Level Security (RLS) is blocking uploads to bucket "gallery".
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    In your Supabase Dashboard, go to <strong>Storage &gt; Policies</strong> or open the <strong>SQL Editor</strong> and run:
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
                    {STORAGE_POLICY_SQL}
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
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={!selectedFile || isUploading}
              style={{
                opacity: !selectedFile || isUploading ? 0.6 : 1,
                cursor: !selectedFile || isUploading ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="admin-spinner" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Upload to Supabase</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
