import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Video
} from 'lucide-react';
import { galleryItems as importedGalleryItems } from '../data/gallery';
import { fetchGalleryFromStorage } from '../services/galleryService';
import '../styles/gallery.css';

// ============================================================================
// FALLBACK GALLERY ITEMS (Matches public/assets/images 5-card dataset)
// ============================================================================
const DEFAULT_GALLERY_ITEMS = [
  {
    id: 1,
    title: 'TECHNOVA HACKATHON — 36H BUILD MATRIX',
    category: 'Hackathons',
    badgeCategory: '[ HACKATHON // ARENA ]',
    associatedEvent: 'Technova 2026',
    image: '/assets/images/event_hackathon_banner.jpg',
    thumbnail: '/assets/images/event_hackathon_banner.jpg',
    date: 'OCT 2026',
    accentColor: '#00F0FF',
    caption: 'Over 500 student developers collaborating continuous 36-hour coding sprints on AI and distributed cloud architectures.'
  },
  {
    id: 2,
    title: 'DEEP LEARNING & TENSOR VISION LAB',
    category: 'Workshops',
    badgeCategory: '[ WORKSHOP // AI ]',
    associatedEvent: 'AI & Neural Nets',
    image: '/assets/images/project_ai_vision.jpg',
    thumbnail: '/assets/images/project_ai_vision.jpg',
    date: 'NOV 2026',
    accentColor: '#00F0FF',
    caption: 'Students constructing and deploying real-time convolutional neural networks using PyTorch on cloud GPU instances.'
  },
  {
    id: 3,
    title: 'CYBERSHIELD DEFCON CTF SHOWDOWN',
    category: 'Competitions',
    badgeCategory: '[ COMPETITION // SEC ]',
    associatedEvent: 'CyberShield CTF',
    image: '/assets/images/project_cyber_shield.jpg',
    thumbnail: '/assets/images/project_cyber_shield.jpg',
    date: 'DEC 2026',
    accentColor: '#00F0FF',
    caption: 'High-intensity 8-hour capture the flag tournament testing binary reverse engineering, cryptography, and zero-day defense.'
  },
  {
    id: 4,
    title: 'SMART CAMPUS IoT & HARDWARE INNOVATION',
    category: 'Exhibitions',
    badgeCategory: '[ EXHIBITION // HARDWARE ]',
    associatedEvent: 'IoT Tech Expo',
    image: '/assets/images/project_iot_smart_campus.jpg',
    thumbnail: '/assets/images/project_iot_smart_campus.jpg',
    date: 'JUL 2025',
    accentColor: '#00F0FF',
    caption: 'Prototyping connected embedded hardware systems for smart energy grids, autonomous sensors, and campus automation.'
  },
  {
    id: 5,
    title: 'EXECUTIVE TECH KEYNOTE AT PCCOE',
    category: 'Keynotes',
    badgeCategory: '[ KEYNOTE // LEADERSHIP ]',
    associatedEvent: 'ITSA Orientation',
    image: '/assets/images/akshat.jpg',
    thumbnail: '/assets/images/akshat.jpg',
    date: 'AUG 2025',
    accentColor: '#A855F7',
    caption: 'Annual technical club orientation and keynote presentation on open-source software engineering roadmaps.'
  }
];

// ============================================================================
// ALTERNATING --CYBER FRAME COLOR PALETTE
// ============================================================================
const CYBER_FRAME_THEMES = [
  { border: 'var(--cyber-cyan, #00F0FF)', glow: 'rgba(0, 240, 255, 0.45)' },
  { border: 'var(--cyber-amber, #F59E0B)', glow: 'rgba(245, 158, 11, 0.45)' }
];

// ============================================================================
// CYBER BENTO IMAGE GALLERY (Replacing 2D Canvas)
// ============================================================================
export function Gallery({ itemsData }) {
  const defaultItems =
    itemsData ||
    (importedGalleryItems && importedGalleryItems.length > 0
      ? importedGalleryItems
      : DEFAULT_GALLERY_ITEMS);

  const [galleryList, setGalleryList] = useState(defaultItems);

  useEffect(() => {
    let isMounted = true;
    fetchGalleryFromStorage().then(({ data, error }) => {
      if (!error && data && data.length > 0 && isMounted) {
        const storageItems = data.map((d) => {
          const rawEvent = (d.associatedEvent || '').trim();
          const cleanCategory = rawEvent && !rawEvent.toLowerCase().includes('supabase')
            ? rawEvent
            : (d.mediaType === 'video' ? 'Video' : 'Photo');

          return {
            ...d,
            image: d.url || d.thumbnail,
            category: cleanCategory,
            associatedEvent: cleanCategory,
            badgeCategory: d.mediaType === 'video' ? '[ VIDEO // HIGHLIGHT ]' : '[ PHOTO // ARCHIVE ]'
          };
        });
        // Prepend Supabase live uploads
        setGalleryList([...storageItems, ...defaultItems]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const rawItems = galleryList;

  const [selectedLightboxItem, setSelectedLightboxItem] = useState(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // Cinematic opening entrance animation with GSAP
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: -22 },
          { opacity: 1, y: 0, duration: 0.6 }
        );
      }

      if (gridRef.current) {
        tl.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 28, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08 },
          '-=0.3'
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Lightbox Keyboard Navigation (Arrows + Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedLightboxItem) return;

      if (e.key === 'Escape') {
        setSelectedLightboxItem(null);
      } else if (e.key === 'ArrowRight') {
        const curIdx = rawItems.findIndex((i) => i.id === selectedLightboxItem.id);
        const nextIdx = curIdx < rawItems.length - 1 ? curIdx + 1 : 0;
        setSelectedLightboxItem(rawItems[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const curIdx = rawItems.findIndex((i) => i.id === selectedLightboxItem.id);
        const prevIdx = curIdx > 0 ? curIdx - 1 : rawItems.length - 1;
        setSelectedLightboxItem(rawItems[prevIdx]);
      }
    };

    if (selectedLightboxItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedLightboxItem, rawItems]);

  return (
    <section
      id="gallery"
      className="archive-gallery-section"
      aria-label="Technospark Interactive Multiverse Archive"
    >
      {/* ==================================================================== */}
      {/* 1. TOP ARCHIVE COMMAND BAR                                           */}
      {/* ==================================================================== */}
      <div className="archive-top-bar" ref={headerRef}>
        <div className="archive-brand-col">
          <span className="section-eyebrow">[ MULTIVERSE MEDIA ARCHIVE ]</span>
          <h2 className="section-title">
            EVENT <span className="text-highlight">GALLERY</span>
          </h2>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. CYBER BENTO IMAGE GALLERY SECTION                                 */}
      {/* ==================================================================== */}
      <div className="cyber-gallery-wrap">
        <div className="cyber-gallery-grid" ref={gridRef}>
          {rawItems.map((item, idx) => {
            const patternIdx = idx % 5;
            // Row 1: Card 0 (span 7), Card 1 (span 10), Card 2 (span 7) = 24 cols
            // Row 2: Card 3 (span 12), Card 4 (span 12) = 24 cols
            const spanClass = `cyber-card--span-${patternIdx}`;
            const isRow2 = patternIdx === 3 || patternIdx === 4;
            const cyberTheme = CYBER_FRAME_THEMES[idx % CYBER_FRAME_THEMES.length];

            return (
              <article
                key={item.id || idx}
                className={`cyber-card ${spanClass} ${isRow2 ? 'cyber-card--row2' : ''}`}
                style={{
                  '--card-border': cyberTheme.border,
                  '--card-glow': cyberTheme.glow
                }}
                onClick={() => setSelectedLightboxItem(item)}
              >
                {/* Media Image / Video Frame */}
                <div className="cyber-card-img-wrap">
                  {item.mediaType === 'video' ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060714' }}>
                      <video
                        src={item.url}
                        muted
                        preload="metadata"
                        className="cyber-card-img"
                        style={{ objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 240, 255, 0.88)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000',
                          boxShadow: '0 0 14px rgba(0, 240, 255, 0.6)'
                        }}
                      >
                        <Play size={16} fill="#000" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.image || item.thumbnail || item.url}
                      alt={item.title}
                      className="cyber-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  )}
                  <div className="cyber-card-halftone" />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. FULL-SCREEN SPIDER-VERSE LIGHTBOX INSPECTOR MODAL                 */}
      {/* ==================================================================== */}
      {selectedLightboxItem && (
        <div
          className="retro-modal-backdrop gallery-lightbox-backdrop"
          onClick={() => setSelectedLightboxItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="gallery-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Top Comic Issue Bar */}
            <div className="gallery-lightbox-topbar">
              <div className="gallery-lightbox-tags">
                {selectedLightboxItem.category &&
                  !selectedLightboxItem.category.toLowerCase().includes('supabase') && (
                    <span className="retro-black-pill">{selectedLightboxItem.category}</span>
                  )}
                {selectedLightboxItem.associatedEvent &&
                  !selectedLightboxItem.associatedEvent.toLowerCase().includes('supabase') &&
                  selectedLightboxItem.associatedEvent !== selectedLightboxItem.category && (
                    <span className="retro-black-pill">{selectedLightboxItem.associatedEvent}</span>
                  )}
                {selectedLightboxItem.date && (
                  <span className="retro-black-pill">{selectedLightboxItem.date}</span>
                )}
              </div>

              <button
                type="button"
                className="gallery-lightbox-close-btn"
                onClick={() => setSelectedLightboxItem(null)}
                aria-label="Close photo preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* Media Image / Video Frame */}
            <div className="gallery-lightbox-frame">
              {selectedLightboxItem.mediaType === 'video' ? (
                <video
                  src={selectedLightboxItem.url}
                  controls
                  autoPlay
                  className="gallery-lightbox-img"
                />
              ) : (
                <img
                  src={selectedLightboxItem.image || selectedLightboxItem.thumbnail || selectedLightboxItem.url}
                  alt={selectedLightboxItem.title}
                  className="gallery-lightbox-img"
                />
              )}
            </div>

            {/* Information & Prev/Next Footer */}
            <div className="gallery-lightbox-info-row">
              <div className="gallery-lightbox-meta">
                <h3 className="gallery-lightbox-title">{selectedLightboxItem.title}</h3>
                {selectedLightboxItem.caption && (
                  <p className="gallery-lightbox-caption">{selectedLightboxItem.caption}</p>
                )}
              </div>

              <div className="gallery-lightbox-nav-buttons">
                <button
                  type="button"
                  className="retro-btn-modal retro-btn-modal-close"
                  onClick={() => {
                    const curIdx = rawItems.findIndex(
                      (i) => i.id === selectedLightboxItem.id
                    );
                    const prevIdx = curIdx > 0 ? curIdx - 1 : rawItems.length - 1;
                    setSelectedLightboxItem(rawItems[prevIdx]);
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  className="retro-btn-modal retro-btn-modal-action"
                  onClick={() => {
                    const curIdx = rawItems.findIndex(
                      (i) => i.id === selectedLightboxItem.id
                    );
                    const nextIdx = curIdx < rawItems.length - 1 ? curIdx + 1 : 0;
                    setSelectedLightboxItem(rawItems[nextIdx]);
                  }}
                  aria-label="Next image"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
