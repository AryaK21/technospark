import React, { useEffect, useRef } from 'react';

// ============================================================================
// HIGH-PERFORMANCE CUSTOM CURSOR (Desktop Only)
// ============================================================================
// Uses direct DOM manipulation & requestAnimationFrame without triggering React
// state updates, guaranteeing 120fps fluid cursor movement without frame drops.
// ============================================================================

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Check for touch device or reduced motion preference
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let rafId = null;

    const render = () => {
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      rafId = null;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursor.classList.contains('cursor-visible')) {
        cursor.classList.add('cursor-visible');
      }
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-visible');
    };

    // Detect interactive elements to expand cursor
    const handleElementHover = (e) => {
      const target = e.target;
      const isInteractive = target && target.closest && target.closest('a, button, [role="button"], .event-card, .organizer-card, .gallery-item, input, select');
      if (isInteractive) {
        cursor.classList.add('cursor-hover');
      } else {
        cursor.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementHover, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-container"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
}
