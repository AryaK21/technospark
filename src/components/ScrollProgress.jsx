import React, { useEffect, useState } from 'react';

// ============================================================================
// SCROLL PROGRESS BAR COMPONENT
// ============================================================================
// Displays a glowing progress bar at the top of the screen tracking page scroll depth.
// ============================================================================

export default function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollPercentage(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-progress-bar-container" aria-hidden="true">
      <div
        className="scroll-progress-bar-fill"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
}
