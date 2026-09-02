import React, { useEffect, useState } from 'react';

// ============================================================================
// CUSTOM CURSOR COMPONENT (Desktop Only)
// ============================================================================
// Adds an elegant, non-intrusive follower dot and subtle expanding ring.
//
// Key Features:
// - pointer-events: none (will never block clicking or text selection)
// - Automatically disabled on touch screens, mobile devices, and reduced motion
// - Expands smoothly when hovering over buttons, links, event cards, and gallery items
// ============================================================================

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for touch device or reduced motion preference
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return; // Do not render custom cursor on touch/reduced-motion environments
    }

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Detect interactive elements to expand cursor
    const handleElementHover = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], .event-card, .organizer-card, .gallery-item, input, select');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementHover, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`custom-cursor-container ${isHovered ? 'cursor-hover' : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
      aria-hidden="true"
    >
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
}
