import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import use3DTilt from '../hooks/use3DTilt';

// ============================================================================
// HERO COMPONENT (Spiderverse Typography & Scoped Autoplay Video)
// ============================================================================
// Features native 60fps autoplay background video with enhanced radial vignette
// (lighter center, darker corners) and Spiderverse animated neon title.
// ============================================================================

export default function Hero() {
  const heroRef = useRef(null);
  const spiderverseWrapRef = useRef(null);
  const technoRef = useRef(null);
  const sparkRef = useRef(null);
  const videoRef = useRef(null);

  // Attach 3D parallax tilt to title text
  use3DTilt(spiderverseWrapRef, { max: 10, perspective: 1000, scale: 1.02 });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        technoRef.current,
        { opacity: 0, scale: 1.3, rotateX: 45, y: -40, filter: 'blur(16px)' },
        { opacity: 1, scale: 1, rotateX: 0, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'back.out(1.6)' }
      ).fromTo(
        sparkRef.current,
        { opacity: 0, scale: 0.7, rotateY: -30, y: 40, filter: 'blur(16px)' },
        { opacity: 1, scale: 1, rotateY: 0, y: 0, filter: 'blur(0px)', duration: 1, ease: 'elastic.out(1, 0.6)' },
        '-=0.6'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-craft-section spiderverse-hero" aria-label="Technospark Hero">
      
      {/* Native Autoplay Background Video (Scoped strictly to Hero) */}
      <div className="hero-bg-video-wrapper">
        <video
          ref={videoRef}
          src="/assets/bg-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video-element"
        />
        {/* Enhanced Radial Vignette Overlay (Lighter center, darker corners) */}
        <div className="hero-bg-vignette-overlay" aria-hidden="true" />
      </div>

      {/* Spiderverse Animated Stacked Title Typography */}
      <div ref={spiderverseWrapRef} className="spiderverse-text-wrap tilt-3d-card">
        <h1 ref={technoRef} className="spiderverse-line spiderverse-techno">
          TECHNO
        </h1>
        <h1 ref={sparkRef} className="spiderverse-line spiderverse-spark">
          SPARK
        </h1>
      </div>

    </section>
  );
}
