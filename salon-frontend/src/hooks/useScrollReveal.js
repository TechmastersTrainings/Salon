import { useEffect } from 'react';

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .img-reveal';

/**
 * Site-wide scroll reveal. Adds `is-visible` to any reveal-class element
 * inside `rootRef` once it scrolls into view. A MutationObserver picks up
 * elements rendered later (e.g. after API data loads), and `resetKey`
 * (usually the pathname) re-scans on route changes.
 */
export default function useScrollReveal(rootRef, resetKey) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const pending = () => root.querySelectorAll(`:is(${SELECTOR}):not(.is-visible)`);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      const showAll = () => pending().forEach((el) => el.classList.add('is-visible'));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const scan = () => pending().forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [rootRef, resetKey]);
}
