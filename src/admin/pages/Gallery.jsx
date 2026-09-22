import React, { useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Video,
  Play,
  Eye,
  Trash2,
  Calendar,
  Layers,
  X,
  RefreshCw,
  HardDrive,
  ExternalLink
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import MediaUpload from './MediaUpload';
import { mockGallery } from '../data/mockData';

// ============================================================================
// GALLERY & MEDIA ADMIN PAGE (/admin/gallery)
// ============================================================================
// Media manager directly connected to the Supabase Storage 'gallery' bucket.
// Displays photos and highlight videos with quick preview, filter tabs,
// and direct drag-and-drop upload.
// ============================================================================

export default function Gallery({
  mediaList = mockGallery,
  isLoading = false,
  onAddMedia,
  onDeleteMedia,
  onRefresh
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [previewMedia, setPreviewMedia] = useState(null);
  const [deletingMedia, setDeletingMedia] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter media by type (All, image, video)
  const filteredMedia = mediaList.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    return item.mediaType === selectedFilter;
  });

  const confirmDelete = () => {
    if (deletingMedia) {
      onDeleteMedia(deletingMedia.id);
      setDeletingMedia(null);
    }
  };

  const handleRefreshClick = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Gallery & Media Pool"
        subtitle={`Organize event photography and videos in the Supabase "gallery" bucket (${mediaList.length} items)`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {onRefresh && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleRefreshClick}
              disabled={isRefreshing || isLoading}
              title="Refresh from Supabase Storage"
            >
              <RefreshCw size={15} className={isRefreshing || isLoading ? 'admin-spinner' : ''} />
              <span>Refresh</span>
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => setIsUploadOpen(true)}
          >
            <UploadCloud size={16} />
            <span>Upload Media</span>
          </button>
        </div>
      </PageHeader>

      {/* Media Type Filter Tabs & Storage Bucket Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${selectedFilter === 'ALL' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSelectedFilter('ALL')}
          >
            <span>All Media ({mediaList.length})</span>
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${selectedFilter === 'image' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSelectedFilter('image')}
          >
            <ImageIcon size={14} />
            <span>Photos ({mediaList.filter((m) => m.mediaType === 'image').length})</span>
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${selectedFilter === 'video' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSelectedFilter('video')}
          >
            <Video size={14} />
            <span>Videos ({mediaList.filter((m) => m.mediaType === 'video').length})</span>
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--admin-text-muted)',
            backgroundColor: 'var(--admin-bg-table-header)',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--admin-border-subtle)'
          }}
        >
          <HardDrive size={13} color="var(--admin-sky-blue)" />
          <span>Bucket: <strong>gallery</strong></span>
        </div>
      </div>

      {/* Visual Media Grid or Empty State */}
      {filteredMedia.length === 0 ? (
        <div
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--admin-bg-card)',
            border: '1px dashed var(--admin-border-medium)',
            borderRadius: '12px',
            margin: '1.5rem 0'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 1rem auto',
              borderRadius: '50%',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--admin-sky-blue)'
            }}
          >
            <UploadCloud size={24} />
          </div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--admin-text-title)' }}>
            No media found in {selectedFilter === 'ALL' ? 'gallery' : selectedFilter + 's'}
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
            Upload photos and videos directly to the Supabase Storage gallery bucket.
          </p>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => setIsUploadOpen(true)}
          >
            <UploadCloud size={16} />
            <span>Upload New Media</span>
          </button>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {filteredMedia.map((item) => (
            <div key={item.id} className="admin-gallery-card">
              {/* Thumbnail Box */}
              <div className="admin-gallery-media-wrap">
                {item.mediaType === 'video' ? (
                  <video
                    src={item.url}
                    muted
                    preload="metadata"
                    className="admin-gallery-thumbnail"
                  />
                ) : (
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="admin-gallery-thumbnail"
                    onError={(e) => {
                      if (!item.fromSupabase) {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/event_hackathon_banner.jpg';
                      }
                    }}
                  />
                )}

                {/* Type Badge */}
                <div
                  className={`admin-gallery-type-badge ${
                    item.mediaType === 'video' ? 'admin-gallery-type-video' : ''
                  }`}
                >
                  {item.mediaType === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                  <span>{item.mediaType === 'video' ? 'Video' : 'Photo'}</span>
                </div>

                {/* Video Play Indicator */}
                {item.mediaType === 'video' && (
                  <div className="admin-gallery-play-icon">
                    <Play size={18} fill="#ffffff" />
                  </div>
                )}

                {/* Hover Quick Action Overlay */}
                <div className="admin-gallery-overlay">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setPreviewMedia(item)}
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => setDeletingMedia(item)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Info Body */}
              <div className="admin-gallery-info">
                <h3 className="admin-gallery-title" title={item.title}>
                  {item.title}
                </h3>

                <div className="admin-gallery-event-tag">
                  <Layers size={13} />
                  <span>{item.associatedEvent || 'Supabase Gallery'}</span>
                </div>

                <div className="admin-gallery-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} />
                    <span>{item.uploadDate}</span>
                  </span>
                  <span>{item.fileSize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Upload Modal */}
      <MediaUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={onAddMedia}
      />

      {/* Lightbox / Preview Modal */}
      {previewMedia && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewMedia(null)}>
          <div
            className="admin-modal-container"
            style={{ maxWidth: '820px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{previewMedia.title}</h3>
              <button
                type="button"
                className="admin-btn-icon"
                onClick={() => setPreviewMedia(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="admin-modal-body"
              style={{ padding: '1rem', backgroundColor: '#0B2046', borderRadius: '8px' }}
            >
              {previewMedia.mediaType === 'video' ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  style={{ width: '100%', maxHeight: '480px', borderRadius: '8px' }}
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.title}
                  style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '8px' }}
                />
              )}
            </div>

            <div className="admin-modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                {previewMedia.dimensions} &bull; {previewMedia.fileSize} &bull; {previewMedia.associatedEvent}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <a
                  href={previewMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ExternalLink size={14} />
                  <span>Open Full Asset</span>
                </a>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setPreviewMedia(null)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingMedia)}
        title="Delete Media File"
        message={`Are you sure you want to remove "${deletingMedia?.title}"? The media file will be removed from the gallery pool.`}
        confirmLabel="Delete File"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingMedia(null)}
      />
    </div>
  );
}
