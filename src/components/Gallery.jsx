import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { galleryItems } from '../data/gallery';

// ============================================================================
// GALLERY COMPONENT
// ============================================================================
// Asymmetric / editorial photo showcase of Technospark hackathons,
// workshops, competitions, and student activities.
//
// Layout:
// - Left-aligned header matching other major sections
// - Editorial staggered grid composition
//
// Animations Local to this Component:
// - GALLERY SCROLL REVEAL:
//   Fades/slides in the gallery heading and staggers the gallery cards into place.
// - Interactive Lightbox Modal on image click (ESC / outside click to close)
// ============================================================================

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // ==========================================================================
  // SCROLL REVEAL ANIMATION
  // Runs once when the Gallery section enters the viewport.
  // ==========================================================================
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.65 } });

            // 1. Left-aligned header reveal
            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 }
            )
            // 2. Gallery items staggered reveal
            .fromTo(
              gridRef.current?.children || [],
              { opacity: 0, y: 30, scale: 0.98 },
              { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6 },
              '-=0.35'
            );

            observer.disconnect(); // Trigger only once
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeImage) {
        setActiveImage(null);
      }
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
        
        {/* Left-Aligned Section Header (Matches About, Events, & Organizers) */}
        <div ref={headerRef} className="gallery-header">
          <span className="section-eyebrow">LIFE AT TECHNOSPARK</span>
          <h2 className="section-title">
            EVENT <span className="text-highlight">GALLERY</span>
          </h2>
          <p className="gallery-subtitle">
            Snapshots of collaborative coding sprints, keynote talks, lab sessions, and campus tech events.
          </p>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div ref={gridRef} className="gallery-grid">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`gallery-item gallery-item-${index + 1}`}
              onClick={() => setActiveImage(item)}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${item.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveImage(item);
                }
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="gallery-img"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-category-tag">{item.category}</span>
                <h3 className="gallery-item-title">{item.title}</h3>
                <span className="gallery-view-hint">
                  <span>Click to expand</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="lightbox-backdrop"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setActiveImage(null)}
              aria-label="Close photo preview"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <img
              src={activeImage.image}
              alt={activeImage.title}
              className="lightbox-full-img"
            />

            <div className="lightbox-caption-bar">
              <span className="gallery-category-tag">{activeImage.category}</span>
              <h3 className="lightbox-caption-title">{activeImage.title}</h3>
              {activeImage.caption && (
                <p className="lightbox-caption-desc">{activeImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
