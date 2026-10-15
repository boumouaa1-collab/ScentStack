import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether an element has scrolled into the viewport, for one-time reveal animations.
 *
 * - `inView` becomes true once and stays true.
 * - `hidden` is true only for elements that start BELOW the visible screen. Anything already on
 *   screen is never hidden, so the first screen paints normally (this matters for Google's speed
 *   test, which ignores text that starts fully transparent and then reports "no content").
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced-motion users — just show content immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }

    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        } else if (first) {
          // Off-screen at load: hide it now (the visitor cannot see it) so it can fade in later.
          setHidden(true);
        }
        first = false;
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView, hidden };
}
