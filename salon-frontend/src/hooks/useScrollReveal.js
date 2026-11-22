import { useEffect } from 'react';

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .img-reveal';
// Load-time entrance animations (hero etc.) that should also replay on scroll.
const ENTRANCE = '.animate-rise, .animate-reveal, .animate-fadeIn';

/**
 * Site-wide scroll reveal that replays every time an element comes into view.
 * - Reveal classes get `is-visible` on entering the viewport and lose it once
 *   fully off-screen, so the animation runs again on the next pass (up or down).
 * - Entrance-animated elements have their CSS animation restarted the same way.
 * A MutationObserver picks up elements rendered later (e.g. after API data
 * loads), and `resetKey` (usually the pathname) re-scans on route changes.
 */
export default function useScrollReveal(rootRef, resetKey) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      const showAll = () =>
        root.querySelectorAll(`:is(${SELECTOR}):not(.is-visible)`).forEach((el) => el.classList.add('is-visible'));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const observed = new WeakSet();

    // Scroll reveals: shown once 12% is in view (a little above the bottom
    // edge), reset only when fully off-screen so they replay next pass.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
          if (isIntersecting && intersectionRatio >= 0.12) target.classList.add('is-visible');
          else if (!isIntersecting) target.classList.remove('is-visible');
        });
      },
      { threshold: [0, 0.12], rootMargin: '0px 0px -8% 0px' }
    );

    // Entrance animations already play on load; restart them only after the
    // element has left the screen completely (no margin, so nothing that is
    // visible ever gets reset mid-view).
    const entranceIo = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        target.style.animation = isIntersecting ? '' : 'none';
      });
    });

    const scan = () =>
      root.querySelectorAll(`${SELECTOR}, ${ENTRANCE}`).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          (el.matches(ENTRANCE) ? entranceIo : io).observe(el);
        }
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      entranceIo.disconnect();
      mo.disconnect();
    };
  }, [rootRef, resetKey]);
}
