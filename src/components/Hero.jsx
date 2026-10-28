import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Play, Pause } from 'lucide-react';

// ============================================================================
// HERO COMPONENT (Spiderverse Typography & Optimized Background Video)
// ============================================================================
// Features:
// 1. Hardware-accelerated background video strictly scoped to the Hero section.
// 2. High-performance IntersectionObserver: pauses video decoding instantly when
//    user scrolls down to other sections, eliminating 100% of video lag.
// 3. Tab visibility listener: pauses when browser tab is inactive.
// 4. Manual Play/Pause toggle in the corner for user preference.
// 5. Spiderverse animated 3D neon title typography.
// ============================================================================

export default function Hero() {
  const heroRef = useRef(null);
  const spiderverseWrapRef = useRef(null);
  const technoRef = useRef(null);
  const sparkRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // 1. Entrance GSAP Animation
  useEffect(() => {
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

  // 2. Viewport-Aware Autoplay/Auto-Pause (The Key Lag-Fix)
  useEffect(() => {
    const video = videoRef.current;
    const heroEl = heroRef.current;
    if (!video || !heroEl) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    // IntersectionObserver stops video decoding when Hero scrolls out of view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!isManuallyPaused) {
            video.play().then(() => setIsPlaying(true)).catch(() => { });
          }
        } else {
          // Off-screen: stop decoder immediately to free up GPU & CPU for other sections
          video.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px'
      }
    );

    observer.observe(heroEl);

    // Pause when tab is minimized / backgrounded
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setIsPlaying(false);
      } else if (!isManuallyPaused) {
        const rect = heroEl.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          video.play().then(() => setIsPlaying(true)).catch(() => { });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isManuallyPaused]);

  // Toggle video playback manually
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setIsManuallyPaused(false);
      }).catch(() => { });
    } else {
      video.pause();
      setIsPlaying(false);
      setIsManuallyPaused(true);
    }
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-craft-section spiderverse-hero" aria-label="Technospark Hero">

      {/* Optimized Autoplay Background Video (Scoped strictly to Hero) */}
      <div className="hero-bg-video-wrapper">
        <video
          ref={videoRef}
          src="/assets/bg-video.mp4"
          poster="/assets/bg-video-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          className="hero-bg-video-element"
        />
        {/* Enhanced Radial Vignette Overlay (Lighter center, darker corners) */}
        <div className="hero-bg-vignette-overlay" aria-hidden="true" />
      </div>

      {/* Manual Video Play/Pause Toggle Pill */}
      <button
        type="button"
        onClick={togglePlayPause}
        className="hero-video-toggle-btn"
        aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
        title={isPlaying ? 'Pause background animation' : 'Play background animation'}
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        <span>{isPlaying ? 'Pause' : 'Play'}</span>
      </button>

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
