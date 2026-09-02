import gsap from 'gsap';

// ============================================================================
// ANIMATION HELPERS (GSAP + IntersectionObserver)
// ============================================================================
// All animations in this file follow the "Subtle, Fast & Natural" philosophy.
// They enhance readability and hierarchy without visual clutter or heavy effects.
//
// Automatically respects user's prefers-reduced-motion OS preference.
// ============================================================================

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Animate the Hero section elements sequentially on page load
 */
export const animateHeroEntrance = (elements) => {
  if (prefersReducedMotion()) {
    // If reduced motion is preferred, immediately show elements
    Object.values(elements).forEach((el) => {
      if (el) gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    });
    return;
  }

  const { badge, heading, description, buttons, logoContainer } = elements;

  const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });

  if (badge) {
    tl.fromTo(badge, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 });
  }

  if (heading) {
    tl.fromTo(heading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
  }

  if (description) {
    tl.fromTo(description, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
  }

  if (buttons) {
    tl.fromTo(buttons, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
  }

  if (logoContainer) {
    tl.fromTo(
      logoContainer,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' },
      '-=0.5'
    );
  }
};

/**
 * Count up a number when an element becomes visible in viewport
 */
export const animateCounter = (element, targetValue, duration = 1.6) => {
  if (!element) return;
  if (prefersReducedMotion()) {
    element.textContent = targetValue;
    return;
  }

  const obj = { val: 0 };
  gsap.to(obj, {
    val: targetValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.floor(obj.val);
    }
  });
};
