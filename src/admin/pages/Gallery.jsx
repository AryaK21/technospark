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
  ExternalLink
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import MediaUpload from './MediaUpload';
import { mockGallery } from '../data/mockData';

// ============================================================================
// GALLERY & MEDIA ADMIN PAGE (/admin/gallery)
// ============================================================================
// Visually distinct media manager for photo captures and video highlights.
// Supports both Image and Video media types, responsive grid cards,
// and preview lightbox.
//
// NOTE FOR FUTURE SUPABASE INTEGRATION:
// // =========================================================================
// // 1. Fetch media items:
// //    const { data: gallery, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
// // 2. Delete media item:
// //    await supabase.storage.from('gallery-media').remove([item.storage_path]);
// //    await supabase.from('gallery').delete().eq('id', item.id);
// // =========================================================================
// ============================================================================

export default function Gallery({
  mediaList = mockGallery,
  onAddMedia,
  onDeleteMedia
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [previewMedia, setPreviewMedia] = useState(null);
  const [deletingMedia, setDeletingMedia] = useState(null);

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

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Gallery & Media Pool"
        subtitle={`Organize high-resolution event photography and highlight videos (${mediaList.length} items)`}
      >
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setIsUploadOpen(true)}
        >
          <UploadCloud size={16} />
          <span>Upload Media</span>
        </button>
      </PageHeader>

      {/* Media Type Filter Tabs */}
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

      {/* Visual Media Grid */}
      <div className="admin-gallery-grid">
        {filteredMedia.map((item) => (
          <div key={item.id} className="admin-gallery-card">
            {/* Thumbnail Box */}
            <div className="admin-gallery-media-wrap">
              <img
                src={item.thumbnail || item.url}
                alt={item.title}
                className="admin-gallery-thumbnail"
              />

              {/* Type Badge */}
              <div className={`admin-gallery-type-badge ${item.mediaType === 'video' ? 'admin-gallery-type-video' : ''}`}>
                {item.mediaType === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                <span>{item.mediaType === 'video' ? `Video (${item.duration || 'Clip'})` : 'Photo'}</span>
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
                <span>{item.associatedEvent || 'General Activity'}</span>
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

            <div className="admin-modal-body" style={{ padding: '1rem', backgroundColor: '#000000' }}>
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

            <div className="admin-modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                {previewMedia.dimensions} • {previewMedia.fileSize} • {previewMedia.associatedEvent}
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setPreviewMedia(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingMedia)}
        title="Delete Media File"
        message={`Are you sure you want to remove "${deletingMedia?.title}"? The media item will be purged from the gallery pool.`}
        confirmLabel="Delete File"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingMedia(null)}
      />
    </div>
  );
}
