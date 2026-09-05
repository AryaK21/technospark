import React, { useEffect, useRef } from 'react';

// ============================================================================
// SCROLL-DRIVEN VIDEO BACKGROUND (Smooth Scrubbing + 3s Idle Autoplay)
// ============================================================================
// Features:
// 1. High-Performance Frame Scrubbing: Throttle-seeking to eliminate video lag.
// 2. Cinematic Vignette Overlay: Smooth radial dark edges for UI readability.
// 3. 3s Idle Autoplay on Hero: When user is idle for > 3 seconds near top,
//    natively plays video at 60fps until user scrolls or moves cursor.
// ============================================================================

export default function ScrollVideoBackground() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let targetTime = 0;
    let currentTime = 0;
    let isIdlePlaying = false;
    let idleTimer = null;
    let lastSeekTime = 0;

    // Resize Canvas to fit viewport aspect ratio
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Calculate target timestamp from scroll position
    const calculateScrollTime = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0 || !video.duration) return;

      const scrollFraction = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
      targetTime = scrollFraction * video.duration;
    };

    // User Activity Handler to manage 3s Idle Autoplay
    const resetIdleTimer = () => {
      // If video was playing in idle mode, stop and sync back to scroll position
      if (isIdlePlaying) {
        isIdlePlaying = false;
        video.pause();
        calculateScrollTime();
      } else {
        calculateScrollTime();
      }

      clearTimeout(idleTimer);

      // Start 3-second idle timer if user is in Hero section
      idleTimer = setTimeout(() => {
        if (window.scrollY < window.innerHeight * 0.8 && video.duration) {
          isIdlePlaying = true;
          video.play().catch(() => {});
        }
      }, 3000);
    };

    // Event Listeners for User Activity
    window.addEventListener('scroll', resetIdleTimer, { passive: true });
    window.addEventListener('mousemove', resetIdleTimer, { passive: true });
    window.addEventListener('keydown', resetIdleTimer, { passive: true });
    window.addEventListener('touchstart', resetIdleTimer, { passive: true });

    // Initial load setup
    video.addEventListener('loadedmetadata', () => {
      calculateScrollTime();
      resetIdleTimer();
    });

    // Main 60fps Animation Loop
    const render = () => {
      if (video.readyState >= 2 && video.duration) {
        // If not idle playing, perform smooth throttled frame scrubbing
        if (!isIdlePlaying) {
          currentTime += (targetTime - currentTime) * 0.12;
          
          const now = performance.now();
          // Throttle seeking to avoid browser decoder pipeline bottleneck (max 30 seek requests per sec)
          if (now - lastSeekTime > 32 && Math.abs(video.currentTime - currentTime) > 0.04) {
            if ('fastSeek' in video) {
              video.fastSeek(currentTime);
            } else {
              video.currentTime = currentTime;
            }
            lastSeekTime = now;
          }
        }

        // Draw Video Frame (Aspect Fill / Cover)
        const vWidth = video.videoWidth || 1920;
        const vHeight = video.videoHeight || 1080;
        const cWidth = canvas.width;
        const cHeight = canvas.height;

        const vAspect = vWidth / vHeight;
        const cAspect = cWidth / cHeight;

        let drawW, drawH, offX, offY;

        if (cAspect > vAspect) {
          drawW = cWidth;
          drawH = cWidth / vAspect;
          offX = 0;
          offY = (cHeight - drawH) / 2;
        } else {
          drawW = cHeight * vAspect;
          drawH = cHeight;
          offX = (cWidth - drawW) / 2;
          offY = 0;
        }

        // Render video frame
        ctx.drawImage(video, offX, offY, drawW, drawH);

        // Cinematic Dark Radial Vignette Overlay for UI readability & polished look
        const radGrad = ctx.createRadialGradient(
          cWidth / 2,
          cHeight / 2,
          cWidth * 0.25,
          cWidth / 2,
          cHeight / 2,
          cWidth * 0.8
        );
        radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        radGrad.addColorStop(1, 'rgba(2, 6, 23, 0.75)');

        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, cWidth, cHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(idleTimer);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src="/assets/bg-video.mp4"
        preload="auto"
        muted
        loop
        playsInline
        style={{ display: 'none' }}
      />

      <canvas
        ref={canvasRef}
        className="scroll-video-bg-canvas"
        aria-hidden="true"
      />
    </>
  );
}
