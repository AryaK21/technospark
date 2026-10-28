import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { organizers } from '../data/organizers';
import OrganizerCard from './OrganizerCard';

// ============================================================================
// ORGANIZERS COMPONENT WITH HORIZONTALLY SLIDING SLIDER
// ============================================================================
// - Horizontally sliding carousel with smooth snap and drag-to-scroll
// - Retro-brutalist navigation arrows (Prev / Next)
// - Interactive pagination dots
// - GSAP reveal on intersection
// ============================================================================

export default function Organizers() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const sliderRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll navigation button states & active index
  const updateScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const cardWidth = 340 + 24; // Card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), organizers.length - 1));
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    return () => slider.removeEventListener('scroll', updateScrollState);
  }, []);

  // Scroll left / right by one card
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth = 340 + 24;
    sliderRef.current.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth'
    });
  };

  // Scroll directly to a specific card index
  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    const cardWidth = 340 + 24;
    sliderRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  };

  // GSAP scroll entrance animation
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
                sliderRef.current?.children || [],
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 },
                '-=0.35'
              );

            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="organizers"
      ref={sectionRef}
      className="organizers-section"
      aria-label="Technospark Organizers"
    >
      <div className="organizers-container">

        {/* ── Section Header with Title & Navigation Controls ──────────── */}
        <div ref={headerRef} className="organizers-header-row">
          <div className="organizers-title-col">
            <span className="section-eyebrow">[ // 03. EXECUTIVE LEADERSHIP ]</span>
            <h2 className="section-title">
              MEET OUR <span className="text-highlight">ORGANIZERS</span>
            </h2>
            <p className="organizers-subtitle">
              The student leaders behind Technospark hackathons, workshops, and technical initiatives.
            </p>
          </div>

          {/* Horizontal Slider Navigation Controls */}
          <div className="org-slider-controls">
            <button
              type="button"
              className="org-nav-btn"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous organizer card"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              className="org-nav-btn"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label="Next organizer card"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Horizontally Sliding Track ───────────────────────────────── */}
        <div
          ref={sliderRef}
          className={`organizers-slider-track ${canScrollLeft && canScrollRight
              ? 'mask-both'
              : canScrollLeft
                ? 'mask-left'
                : canScrollRight
                  ? 'mask-right'
                  : ''
            }`}
          role="region"
          aria-label="Organizers Slider"
        >
          {organizers.map((org) => (
            <div key={org.id} className="org-slide-item">
              <OrganizerCard organizer={org} />
            </div>
          ))}
        </div>

        {/* ── Interactive Pagination Indicators ────────────────────────── */}
        <div className="org-dots-row">
          {organizers.map((org, idx) => (
            <button
              key={org.id}
              type="button"
              className={`org-dot ${activeIndex === idx ? 'active' : ''}`}
              style={{
                '--dot-accent': org.accentColor
              }}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to organizer ${idx + 1}: ${org.name}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
