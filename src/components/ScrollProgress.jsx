import React, { useEffect, useRef } from 'react';

// ============================================================================
// HIGH-PERFORMANCE SCROLL PROGRESS BAR
// ============================================================================
// Directly updates scaleX via requestAnimationFrame without triggering React
// re-renders on scroll, guaranteeing 60-120fps performance.
// ============================================================================

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (!barRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-progress-bar-container" aria-hidden="true">
      <div
        ref={barRef}
        className="scroll-progress-bar-fill"
        style={{
          width: '100%',
          transform: 'scaleX(0)',
          transformOrigin: '0% 50%',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
