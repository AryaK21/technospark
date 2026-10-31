import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Video,
  Trash2,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
  Plus
} from 'lucide-react';
import {
  uploadMediaToGallery,
  STORAGE_POLICY_SQL,
  formatFileSize,
  cleanFileNameToTitle
} from '../../services/galleryService';

// ============================================================================
// MULTI-FILE MEDIA UPLOAD MODAL (SUPABASE STORAGE 'gallery' BUCKET)
// ============================================================================
// Features:
// 1. Multiple file selection (browse or drag & drop)
// 2. Individual editable media name / title for each file
// 3. Supports .HEIC, .MOV, .MP4, JPG, PNG, WebP, GIF (up to 50MB each)
// 4. Batch progress tracking and direct upload to Supabase Storage
// ============================================================================

export default function MediaUpload({
  isOpen,
  onClose,
  onUploadComplete
}) {
  const fileInputRef = useRef(null);

  // Files list state
  // Each item: { id, file, title, previewUrl, isVideo, isHeic, size, ext }
  const [filesList, setFilesList] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // { current, total, title }
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRlsError, setIsRlsError] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // FILE SELECTION & PROCESSING
  // --------------------------------------------------------------------------
  const processFiles = (fileArray) => {
    if (!fileArray || fileArray.length === 0) return;

    const validItems = [];
    const rejectedNotes = [];

    Array.from(fileArray).forEach((file) => {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isImage =
        file.type.startsWith('image') ||
        ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'].includes(ext);
      const isVideo =
        file.type.startsWith('video') ||
        ['mp4', 'mov', 'webm', 'ogg', 'mkv'].includes(ext);
      const isHeic = ['heic', 'heif'].includes(ext);

      if (!isImage && !isVideo) {
        rejectedNotes.push(`"${file.name}" (unsupported format)`);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        rejectedNotes.push(`"${file.name}" (exceeds 50MB limit)`);
        return;
      }

      let previewUrl = null;
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (e) {
        previewUrl = null;
      }

      validItems.push({
        id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        title: cleanFileNameToTitle(file.name),
        previewUrl,
        isVideo,
        isHeic,
        size: file.size,
        ext
      });
    });

    if (rejectedNotes.length > 0) {
      setErrorMessage(`Some files were skipped: ${rejectedNotes.join(', ')}`);
    } else {
      setErrorMessage(null);
    }

    if (validItems.length > 0) {
      setFilesList((prev) => [...prev, ...validItems]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
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
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleTitleChange = (id, newTitle) => {
    setFilesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleRemoveFile = (id) => {
    setFilesList((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAllFiles = () => {
    filesList.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFilesList([]);
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

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (filesList.length === 0) {
      setErrorMessage('Please select at least one image or video to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setIsRlsError(false);

    const uploadedItems = [];
    let errorCount = 0;

    for (let i = 0; i < filesList.length; i++) {
      const current = filesList[i];
      setUploadProgress({
        current: i + 1,
        total: filesList.length,
        title: current.title || current.file.name
      });

      const { data: newMedia, error, isRlsError: rlsFlag } = await uploadMediaToGallery(
        current.file,
        current.title
      );

      if (error) {
        console.error(`[MediaUpload] Upload failed for ${current.file.name}:`, error);
        errorCount++;
        if (rlsFlag) {
          setIsRlsError(true);
        }
      } else if (newMedia) {
        uploadedItems.push(newMedia);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);

    if (uploadedItems.length > 0 && onUploadComplete) {
      onUploadComplete(uploadedItems);
    }

    if (errorCount > 0) {
      setErrorMessage(
        `Uploaded ${uploadedItems.length} file(s). ${errorCount} file(s) failed. Check Supabase Storage permissions.`
      );
      // Remove successfully uploaded files from list
      setFilesList((prev) => prev.slice(uploadedItems.length));
    } else {
      handleClearAllFiles();
      onClose();
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={!isUploading ? onClose : undefined}>
      <div
        className="admin-modal-container"
        style={{
          maxWidth: '640px',
          width: '92vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header" style={{ flexShrink: 0 }}>
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
                Upload Media
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

        {/* Modal Body */}
        <form
          onSubmit={handleUploadSubmit}
          className="admin-modal-body"
          style={{ overflowY: 'auto', flex: 1, padding: '1.25rem' }}
        >
          {/* Hidden multi-file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.heic,.HEIC,.mov,.MOV,.mp4,.MP4"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {filesList.length === 0 ? (
            <div
              className={`admin-dropzone ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '2.75rem 1.5rem', cursor: 'pointer', textAlign: 'center' }}
            >
              <div className="admin-dropzone-icon">
                <UploadCloud size={32} />
              </div>
              <div className="admin-dropzone-title" style={{ fontSize: '1rem', marginTop: '0.6rem' }}>
                Drag & drop media files here, or <span style={{ color: 'var(--admin-sky-blue)' }}>browse</span>
              </div>
              <div className="admin-dropzone-sub" style={{ marginTop: '0.4rem', lineHeight: 1.45 }}>
                Select <strong>one or multiple files</strong>: Supports <strong>.HEIC</strong>, <strong>.MOV</strong>, <strong>.MP4</strong>, JPG, PNG, WebP, GIF (up to 50MB each)
              </div>
            </div>
          ) : (
            <div>
              {/* File list header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-text-title)' }}>
                    Selected Files ({filesList.length})
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--admin-blue-light)',
                      color: 'var(--admin-blue-primary)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px'
                    }}
                  >
                    You can rename media below
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={isUploading}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  >
                    <Plus size={13} />
                    <span>Add More</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllFiles}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    disabled={isUploading}
                    style={{ fontSize: '0.75rem', color: '#EF4444', padding: '0.3rem 0.5rem' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Scrollable list of files with editable name inputs */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  maxHeight: '340px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}
              >
                {filesList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.75rem 0.85rem',
                      backgroundColor: 'var(--admin-bg-table-header)',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      {/* Media preview thumbnail / icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden', flex: 1 }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '6px',
                            backgroundColor: '#0F2447',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          {item.isHeic ? (
                            <ImageIcon size={20} color="#38BDF8" />
                          ) : item.isVideo ? (
                            <Video size={20} color="var(--admin-sky-blue)" />
                          ) : item.previewUrl ? (
                            <img
                              src={item.previewUrl}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <ImageIcon size={20} color="var(--admin-blue-primary)" />
                          )}
                        </div>

                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--admin-text-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={item.file.name}
                          >
                            File: {item.file.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-faint)' }}>
                            {formatFileSize(item.size)} &bull; {item.ext.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Format tag & remove action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: item.isVideo ? 'rgba(56, 189, 248, 0.15)' : 'rgba(11, 32, 70, 0.08)',
                            color: item.isVideo ? 'var(--admin-sky-blue)' : 'var(--admin-blue-primary)'
                          }}
                        >
                          {item.isHeic ? 'HEIC' : (item.isVideo ? item.ext.toUpperCase() : 'Image')}
                        </span>
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Remove file"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Option to change media name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: 'var(--admin-text-title)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Media Name:
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleTitleChange(item.id, e.target.value)}
                        placeholder="e.g. Technova Keynote Hackathon"
                        className="admin-form-input"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem', height: 'auto' }}
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && uploadProgress && (
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
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-title)' }}>
                  Uploading file {uploadProgress.current} of {uploadProgress.total}...
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--admin-text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  "{uploadProgress.title}"
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
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
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Upload Notice</div>
                  <div>{errorMessage}</div>
                </div>
              </div>

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
                    Supabase Storage Row Level Security (RLS) is blocking uploads.
                  </p>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="admin-btn admin-btn-sm"
                    style={{
                      marginTop: '0.25rem',
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
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--admin-border-subtle)',
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
              disabled={filesList.length === 0 || isUploading}
              style={{
                opacity: filesList.length === 0 || isUploading ? 0.6 : 1,
                cursor: filesList.length === 0 || isUploading ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="admin-spinner" />
                  <span>Uploading ({uploadProgress?.current || 1}/{filesList.length})...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>
                    Upload {filesList.length > 0 ? `${filesList.length} File${filesList.length > 1 ? 's' : ''}` : 'to Supabase'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
