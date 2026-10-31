import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Play, Pause } from 'lucide-react';
import GlobeScene from './GlobeScene';
import OrbitNavigation from './OrbitNavigation';
import '../styles/home.css';

// ============================================================================
// SESSION-LEVEL INTRO TRACKER
// ============================================================================
let hasIntroRunSession = false;

export function hasSeenHomeIntro() {
  return hasIntroRunSession;
}

export function markHomeIntroAsSeen() {
  hasIntroRunSession = true;
}

// ============================================================================
// HERO COMPONENT (Exact Sequenced Intro -> 3D Celestial Planet)
// ============================================================================

export function Hero({ onShowLogo, GlobeComponent, OrbitComponent, gsapInstance }) {
  const Globe = GlobeComponent || GlobeScene;
  const Orbit = OrbitComponent || OrbitNavigation;
  const gsapAnim = gsapInstance || gsap;

  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const videoWrapRef = useRef(null);
  const globeVideoRef = useRef(null);
  const globeVideoWrapRef = useRef(null);
  const introWrapRef = useRef(null);
  const technoRef = useRef(null);
  const sparkRef = useRef(null);
  const globeWrapperRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(!hasSeenHomeIntro());
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(() => hasSeenHomeIntro());

  const tlRef = useRef(null);

  const onShowLogoRef = useRef(onShowLogo);
  useEffect(() => {
    onShowLogoRef.current = onShowLogo;
  });

  useEffect(() => {
    if (hasSeenHomeIntro() || !gsapAnim) {
      markHomeIntroAsSeen();
      setIntroCompleted(true);
      if (videoRef.current) videoRef.current.pause();
      if (videoWrapRef.current) videoWrapRef.current.style.display = 'none';
      if (introWrapRef.current) introWrapRef.current.style.display = 'none';
      if (globeVideoWrapRef.current) globeVideoWrapRef.current.style.opacity = '1';
      if (globeVideoRef.current) globeVideoRef.current.play().catch(() => { });
      if (globeWrapperRef.current) {
        globeWrapperRef.current.style.opacity = '1';
        globeWrapperRef.current.style.transform = 'none';
        globeWrapperRef.current.style.filter = 'none';
        globeWrapperRef.current.style.pointerEvents = 'auto';
      }
      onShowLogoRef.current?.();
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      markHomeIntroAsSeen();
      setIntroCompleted(true);
      if (videoRef.current) videoRef.current.pause();
      if (videoWrapRef.current) videoWrapRef.current.style.display = 'none';
      if (introWrapRef.current) introWrapRef.current.style.display = 'none';
      if (globeVideoWrapRef.current) gsapAnim.set(globeVideoWrapRef.current, { opacity: 1 });
      if (globeWrapperRef.current) {
        gsapAnim.set(globeWrapperRef.current, { opacity: 1, scale: 1, pointerEvents: 'auto', filter: 'blur(0px)' });
      }
      onShowLogoRef.current?.();
      return;
    }

    const ctx = gsapAnim.context(() => {
      gsapAnim.set(globeVideoWrapRef.current, { opacity: 0 });
      gsapAnim.set(globeWrapperRef.current, {
        opacity: 0,
        scale: 0.85,
        pointerEvents: 'none',
        filter: 'blur(10px)'
      });

      const tl = gsapAnim.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          markHomeIntroAsSeen();
          setIntroCompleted(true);
          if (videoRef.current) videoRef.current.pause();
          if (videoWrapRef.current) videoWrapRef.current.style.display = 'none';
          if (introWrapRef.current) introWrapRef.current.style.display = 'none';
        }
      });
      tlRef.current = tl;

      // ── 1. TECHNOSPARK ANIMATION ──────────────────────────────────────────
      tl.fromTo(
        technoRef.current,
        { opacity: 0, scale: 1.4, rotateX: 45, y: -40, filter: 'blur(20px)' },
        { opacity: 1, scale: 1, rotateX: 0, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'back.out(1.5)' },
        0.15
      )
        .fromTo(
          sparkRef.current,
          { opacity: 0, scale: 0.6, rotateY: -35, y: 40, filter: 'blur(20px)' },
          { opacity: 1, scale: 1, rotateY: 0, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'elastic.out(1, 0.65)' },
          0.45
        )
        .to({}, { duration: 1.5 })

        // ── 2. BLANK SCREEN ─────────────────────────────────────────────────
        .to(videoWrapRef.current, {
          opacity: 0,
          duration: 0.65,
          ease: 'power2.inOut',
          onComplete: () => {
            if (videoRef.current) videoRef.current.pause();
          }
        })
        .to(
          introWrapRef.current,
          {
            opacity: 0,
            scale: 1.06,
            filter: 'blur(16px)',
            duration: 0.65,
            ease: 'power2.inOut',
            onComplete: () => {
              if (introWrapRef.current) introWrapRef.current.style.display = 'none';
            }
          },
          '<'
        )
        .to({}, { duration: 0.45 })

        // ── 3. LOGO AND NAME ────────────────────────────────────────────────
        .call(() => {
          markHomeIntroAsSeen();
          onShowLogoRef.current?.();
        })
        .to({}, { duration: 0.35 })

        // ── 4. GLOBE + DEDICATED SPACE VIDEO ────────────────────────────────
        .call(() => {
          if (globeVideoRef.current) {
            globeVideoRef.current.play().catch(() => { });
          }
        })
        .to(globeVideoWrapRef.current, {
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out'
        })
        .to(
          globeWrapperRef.current,
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            pointerEvents: 'auto'
          },
          '<'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [gsapInstance]);

  const handleSkipIntro = useCallback(() => {
    markHomeIntroAsSeen();
    if (tlRef.current && !introCompleted) {
      tlRef.current.seek(tlRef.current.duration());
    }
    setIntroCompleted(true);
    if (videoRef.current) videoRef.current.pause();
    if (videoWrapRef.current) videoWrapRef.current.style.display = 'none';
    if (introWrapRef.current) introWrapRef.current.style.display = 'none';
    if (globeVideoWrapRef.current) globeVideoWrapRef.current.style.opacity = '1';
    if (globeVideoRef.current) globeVideoRef.current.play().catch(() => { });
    if (globeWrapperRef.current) {
      globeWrapperRef.current.style.opacity = '1';
      globeWrapperRef.current.style.transform = 'none';
      globeWrapperRef.current.style.filter = 'none';
      globeWrapperRef.current.style.pointerEvents = 'auto';
    }
    onShowLogoRef.current?.();
  }, [introCompleted]);

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
    <section
      id="hero"
      ref={heroRef}
      className={`hero-craft-section spiderverse-hero home-hero-fullscreen ${introCompleted ? 'hero-globe-active' : 'hero-intro-active'}`}
      aria-label="Technospark 3D Portal"
    >
      {/* ── Stage 1 Only: Opening Intro Video Layer (/assets/bg-video.mp4) ──── */}
      {!introCompleted && (
        <div ref={videoWrapRef} className="hero-bg-video-wrapper">
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
          <div className="hero-bg-vignette-overlay" aria-hidden="true" />

          <button
            type="button"
            onClick={togglePlayPause}
            className="hero-video-toggle-btn"
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      )}

      {/* ── Stage 1 Only: Start Animation TECHNOSPARK Typography ───────────── */}
      {!introCompleted && (
        <div
          ref={introWrapRef}
          className="hero-intro-overlay"
          onClick={handleSkipIntro}
          title="Click to explore 3D Globe"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleSkipIntro();
          }}
        >
          <div className="spiderverse-text-wrap tilt-3d-card">
            <h1 ref={technoRef} className="spiderverse-line spiderverse-techno">
              TECHNO
            </h1>
            <h1 ref={sparkRef} className="spiderverse-line spiderverse-spark">
              SPARK
            </h1>
          </div>
        </div>
      )}

      {/* ── Stage 4 Only: Dedicated Spider-Verse Space Video for the 3D Globe ─ */}
      <div
        ref={globeVideoWrapRef}
        className="globe-stage-video-wrapper"
        style={introCompleted ? { opacity: 1 } : { opacity: 0 }}
        aria-hidden="true"
      >
        <video
          ref={globeVideoRef}
          src="#"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          className="globe-stage-video-element"
        />
        <div className="hero-bg-vignette-overlay" />
      </div>

      {/* ── Stage 4: 3D Celestial Planet + Tightly Positioned Orbit Navigation ── */}
      <div
        ref={globeWrapperRef}
        className="hero-globe-wrapper hero-globe-prominent"
        style={introCompleted ? { opacity: 1, filter: 'none', pointerEvents: 'auto', transform: 'none' } : undefined}
      >
        <Globe />
        <div className="hero-orbit-overlay">
          <Orbit />
        </div>
      </div>
    </section>
  );
}

export default Hero;
export function App(props) {
  return <Hero {...props} />;
}