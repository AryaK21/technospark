import { useEffect } from 'react';

/**
 * Custom hook to attach a 3D tilt and glare effect to a DOM element on mouse movement.
 * @param {React.RefObject} elementRef - React ref pointing to target HTML element.
 * @param {Object} options - Configuration settings for tilt behavior.
 */
export default function use3DTilt(elementRef, options = {}) {
  const {
    max = 12,           // Maximum tilt rotation angle in degrees
    perspective = 1000, // Perspective distance in pixels
    scale = 1.03,       // Scale boost on hover
    speed = 400,        // Transition speed in ms
    easing = 'cubic-bezier(.03,.98,.52,.99)'
  } = options;

  useEffect(() => {
    const card = elementRef.current;
    if (!card) return;

    // Ensure 3D parent container setup
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = `transform ${speed}ms ${easing}`;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -max;
      const rotateY = ((x - centerX) / centerX) * max;

      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    const handleMouseEnter = () => {
      card.style.transition = `transform 100ms ease-out`;
    };

    const handleMouseLeave = () => {
      card.style.transition = `transform ${speed}ms ${easing}`;
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, max, perspective, scale, speed, easing]);
}
