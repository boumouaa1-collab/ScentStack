import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/data/products';
import { trustVideos, trustVideosHeading, type TrustVideo } from '@/data/trustVideos';
import Reveal from '@/components/Reveal';

const aspectClass: Record<TrustVideo['aspect'], string> = {
  landscape: 'aspect-video',
  portrait: 'aspect-[9/16]',
  square: 'aspect-square',
};

// Card widths so one card is clearly visible on phones and the next one peeks in, signalling "swipe".
const widthClass: Record<TrustVideo['aspect'], string> = {
  landscape: 'w-[86%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]',
  square: 'w-[80%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]',
  portrait: 'w-[62%] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]',
};

const abs = (path: string) => (path.startsWith('http') ? path : `${siteConfig.siteUrl}${path}`);

export default function TrustVideos() {
  const scroller = useRef<HTMLDivElement>(null);
  const players = useRef<(HTMLVideoElement | null)[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // Only videos whose file really exists are shown (a video you have not uploaded yet is left out,
  // instead of showing a broken box). null = still checking.
  const [available, setAvailable] = useState<string[] | null>(null);
  const videos = trustVideos.filter((v) => available?.includes(v.id));

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const found: string[] = [];
      await Promise.all(
        trustVideos.map(async (v) => {
          try {
            const res = await fetch(v.src, { method: 'HEAD' });
            // A missing file on this host answers with the web page itself, so check the type too.
            if (res.ok && (res.headers.get('content-type') || '').startsWith('video/')) found.push(v.id);
          } catch {
            // not reachable: leave it out
          }
        }),
      );
      if (!cancelled) setAvailable(found);
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const handle = idle ? idle(check) : window.setTimeout(check, 1500);
    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(handle);
    };
  }, []);

  const updateArrows = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    // Measure after the first paint so reading the layout never blocks rendering.
    const frame = requestAnimationFrame(updateArrows);
    const el = scroller.current;
    el?.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      cancelAnimationFrame(frame);
      el?.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  // Structured data so Google can list the videos.
  useEffect(() => {
    if (videos.length === 0) return;
    const id = 'trust-videos-schema';
    document.getElementById(id)?.remove();
    const el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    el.text = JSON.stringify(
      videos.map((v) => ({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: v.title,
        description: v.caption,
        thumbnailUrl: abs(v.poster),
        contentUrl: abs(v.src),
        uploadDate: v.uploadDate,
      })),
    );
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, [videos.length]);

  if (videos.length === 0) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  // Only one video plays at a time.
  const pauseOthers = (index: number) => players.current.forEach((video, i) => i !== index && video?.pause());

  const many = videos.length > 1;

  return (
    <section className="border-y border-[#b08d57]/15 bg-white py-20" aria-labelledby="trust-videos-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="section-eyebrow">{trustVideosHeading.eyebrow}</p>
          <h2 id="trust-videos-title" className="font-serif-display text-4xl text-burgundy md:text-5xl">
            {trustVideosHeading.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">{trustVideosHeading.subtitle}</p>
        </Reveal>

        <div className="relative">
          <div
            ref={scroller}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label="Product videos"
            style={{ justifyContent: many ? undefined : 'center' }}
          >
            {videos.map((video, i) => (
              <figure
                key={video.id}
                className={`${widthClass[video.aspect]} shrink-0 snap-start overflow-hidden rounded-2xl border border-[#b08d57]/20 bg-[#f7f1e8] shadow-sm`}
              >
                <div className={`relative w-full bg-black ${aspectClass[video.aspect]}`}>
                  <video
                    ref={(el) => {
                      players.current[i] = el;
                    }}
                    className="absolute inset-0 h-full w-full object-contain"
                    controls
                    playsInline
                    preload="none"
                    poster={video.poster}
                    onPlay={() => pauseOthers(i)}
                    aria-label={video.title}
                  >
                    <source src={video.src} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                </div>
                <figcaption className="p-4">
                  <p className="font-serif-display text-lg text-burgundy">{video.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/70">{video.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          {many && (
            <>
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous video"
                className="absolute left-1 top-[38%] z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-white/90 text-burgundy shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next video"
                className="absolute right-1 top-[38%] z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-white/90 text-burgundy shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex"
              >
                <ChevronRight size={24} />
              </button>
              <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-charcoal/65 sm:hidden">Swipe for more →</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
