import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { galleryItems } from '../data/gallery';
import use3DTilt from '../hooks/use3DTilt';

function GalleryCard({ item, onClick }) {
  const cardRef = useRef(null);
  use3DTilt(cardRef, { max: 12, perspective: 1000, scale: 1.04 });

  return (
    <div
      ref={cardRef}
      className="gallery-item tilt-3d-card spiderverse-card"
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      aria-label={`View photo: ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item);
        }
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="gallery-item-img"
        loading="lazy"
      />
      <div className="gallery-overlay">
        <div className="gallery-caption">{item.title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
          {item.category ? item.category.toUpperCase() : 'EVENT'}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// GALLERY COMPONENT (Spiderverse Cyber Overhaul)
// ============================================================================

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.65 } });

            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 }
            )
              .fromTo(
                gridRef.current?.children || [],
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6 },
                '-=0.35'
              );

            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeImage) setActiveImage(null);
    };

    if (activeImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImage]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="gallery-section"
      aria-label="Photo Gallery"
    >
      <div className="gallery-container">

        {/* Section Header */}
        <div ref={headerRef} className="gallery-header">
          <span className="section-eyebrow">[ // 04. MEDIA VAULT & MEMORIES ]</span>
          <h2 className="section-title">
            EVENT <span className="text-highlight">GALLERY</span>
          </h2>
          <p className="gallery-subtitle">
            Snapshots of collaborative hackathons, coding sprints, hands-on workshops, and campus tech talks.
          </p>
        </div>

        {/* 3D Gallery Grid */}
        <div ref={gridRef} className="gallery-grid">
          {galleryItems.map((item) => (
            <GalleryCard key={item.id} item={item} onClick={setActiveImage} />
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setActiveImage(null)}
              aria-label="Close photo preview"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <img
              src={activeImage.image}
              alt={activeImage.title}
              style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }}
            />

            <h3 style={{ color: '#FFF', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900 }}>
              {activeImage.title}
            </h3>
            <p style={{ color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
              {activeImage.category ? activeImage.category.toUpperCase() : 'EVENT'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
