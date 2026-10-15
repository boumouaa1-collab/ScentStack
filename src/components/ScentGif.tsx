import { useEffect, useState } from 'react';

type ScentGifProps = {
  number: number;
  alt: string;
  className?: string;
};

// A 1x1 transparent picture shown until the decoration is allowed to load.
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

// Decorative pictures load only after the page itself is ready, so they never compete
// with the text and main images (this keeps the page fast on phones). They appear on the
// visitor's first touch/scroll/key press, or a few seconds after the page has loaded.
export default function ScentGif({ number, alt, className = '' }: ScentGifProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      EVENTS.forEach((event) => window.removeEventListener(event, show));
      window.removeEventListener('load', afterLoad);
      if (timer) clearTimeout(timer);
    };
    function show() {
      setReady(true);
      cleanup();
    }
    function afterLoad() {
      timer = setTimeout(show, 6000);
    }

    EVENTS.forEach((event) => window.addEventListener(event, show, { once: true, passive: true }));
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
    return cleanup;
  }, []);

  return (
    <img
      src={ready ? `/assets/gifs/${number}.webp` : BLANK}
      alt={alt}
      className={`scent-gif ${className}`}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
    />
  );
}
