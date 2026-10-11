import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

type ImageLightboxProps = {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

// Full-screen image viewer. Tap/click the image to zoom to full resolution and drag/scroll to read
// the small print; pinch-zoom works on phones too. Swipe or use arrows to move between pages.
export default function ImageLightbox({ images, index, alt, onClose, onIndexChange }: ImageLightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = useCallback(
    (delta: number) => {
      setZoomed(false);
      onIndexChange((index + delta + count) % count);
    },
    [count, index, onIndexChange],
  );

  // Keyboard controls + lock page scroll while open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight' && count > 1) go(1);
      else if (event.key === 'ArrowLeft' && count > 1) go(-1);
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [count, go, onClose]);

  // Start each zoom centered on the page.
  useEffect(() => {
    if (zoomed && scroller.current) {
      const el = scroller.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = 0;
    }
  }, [zoomed]);

  const onTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || zoomed || count < 2) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — enlarged view`}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm tabular-nums text-white/70">
          {index + 1} / {count}
        </span>
        <div className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => setZoomed((z) => !z)} aria-label={zoomed ? 'Zoom out' : 'Zoom in'}>
            {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button type="button" className={btn} onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className={`relative min-h-0 flex-1 ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
        style={{ touchAction: zoomed ? 'pan-x pan-y pinch-zoom' : 'pan-y pinch-zoom' }}
        onClick={(event) => {
          // Click on the dark backdrop closes; click on the image toggles zoom.
          if (event.target === event.currentTarget && !zoomed) onClose();
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`flex min-h-full items-center justify-center ${zoomed ? 'w-max min-w-full p-2' : 'h-full w-full px-2 pb-2 sm:px-16'}`}
          onClick={(event) => {
            if (event.target === event.currentTarget && !zoomed) onClose();
          }}
        >
          <img
            key={images[index]}
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            draggable={false}
            onClick={() => setZoomed((z) => !z)}
            className={
              zoomed
                ? 'max-w-none cursor-zoom-out select-none rounded-sm'
                : 'max-h-full max-w-full cursor-zoom-in select-none rounded-sm object-contain'
            }
            style={zoomed ? { width: 'max(170vw, 1100px)', maxWidth: 'none', height: 'auto' } : undefined}
          />
        </div>

        {count > 1 && !zoomed && (
          <>
            <button
              type="button"
              className={`${btn} absolute left-2 top-1/2 hidden -translate-y-1/2 sm:flex`}
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className={`${btn} absolute right-2 top-1/2 hidden -translate-y-1/2 sm:flex`}
              onClick={() => go(1)}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      <p className="px-4 pb-3 text-center text-xs text-white/50">
        {zoomed ? 'Drag to move around · tap the image to zoom out' : count > 1 ? 'Tap the image to zoom · swipe for more pages' : 'Tap the image to zoom'}
      </p>
    </div>
  );
}
