import { useEffect, useState } from 'react';

type ScentGifProps = {
  number: number;
  alt: string;
  className?: string;
};

// A 1x1 transparent picture shown until the page has finished loading.
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Decorative animations load only after the page itself is ready, so they never compete
// with the text and main images (this keeps the page fast on phones).
export default function ScentGif({ number, alt, className = '' }: ScentGifProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      timer = setTimeout(() => setReady(true), 800);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if (timer) clearTimeout(timer);
    };
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
