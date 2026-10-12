import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, FileText, Globe, Lock, PenLine, Zap, ZoomIn } from 'lucide-react';
import type { Product } from '@/data/products';
import { getProductById, bundle, siteConfig } from '@/data/products';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';
import CanvaBadge from '@/components/CanvaBadge';
import ImageLightbox from '@/components/ImageLightbox';
import NewsletterForm from '@/components/NewsletterForm';
import PinItButton from '@/components/PinItButton';
import { coverFor, galleryFor, isBuyable } from '@/lib/stock';
import ScentGif from '@/components/ScentGif';
import { track } from '@/lib/analytics';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

type ProductPageProps = {
  product: Product;
  onNavigate: (page: string) => void;
};

const faqs = [
  {
    q: 'Is this a physical product?',
    a: 'No. This is a digital PDF. You download it instantly after checkout through PayPal and can print it at home or use it on a tablet.',
  },
  {
    q: 'How do I receive my file?',
    a: 'PayPal securely processes payment, and Scent Stack delivers your download after confirmation. You also receive a copy at your email address.',
  },
  {
    q: 'Do I need any special software?',
    a: 'No. Any PDF reader works. For writing on it digitally, an app like GoodNotes or Notability works well with a stylus.',
  },
  {
    q: 'Can I print it more than once?',
    a: 'Yes. The tracker and review pages are designed to be printed as many times as you need.',
  },
];

export default function ProductPage({ product, onNavigate }: ProductPageProps) {
  useDocumentMeta(product.seoTitle, product.seoDescription);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const gallery = galleryFor(product);
  const cover = coverFor(product);
  const inStock = isBuyable(product.id);
  // The cover is already the big hero image, so the grid starts after it when the gallery begins with it.
  const goHero = (delta: number) => setHeroIndex((i) => (i + delta + gallery.length) % gallery.length);
  const gridStart = gallery.length > 1 && gallery[0] === cover ? 1 : 0;

  useEffect(() => {
    track('product_view', { item: product.id });
  }, [product]);

  useEffect(() => {
    setHeroIndex(0);
  }, [product.id]);

  // Structured data so Google can show price and availability for this product.
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.seoDescription,
      image: [`${siteConfig.siteUrl}${product.coverImage}`],
      brand: { '@type': 'Brand', name: 'Scent Stack' },
      category: 'Digital download',
      offers: {
        '@type': 'Offer',
        url: `${siteConfig.siteUrl}/products/${product.slug}`,
        priceCurrency: 'USD',
        price: Number(product.price).toFixed(2),
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    };
    const id = 'product-schema';
    document.getElementById(id)?.remove();
    const el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, [product, inStock]);

  // Warm the cache for the next/previous page so arrows feel instant.
  useEffect(() => {
    if (gallery.length < 2) return;
    [1, -1].forEach((d) => {
      const img = new Image();
      img.src = gallery[(heroIndex + d + gallery.length) % gallery.length];
    });
  }, [heroIndex, gallery]);

  const related = product.relatedIds.map((id) => getProductById(id)).filter(Boolean) as Product[];

  return (
    <div className="fade-in pt-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-10">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 transition-colors hover:text-burgundy"
        >
          <ArrowLeft size={15} />
          Back to shop
        </button>
      </div>

      {/* Product hero */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Cover / page carousel */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              className="relative aspect-square overflow-hidden rounded-2xl shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
              style={{ background: product.accent }}
              tabIndex={0}
              role="group"
              aria-roledescription="carousel"
              aria-label={`${product.title} preview pages`}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') goHero(1);
                if (event.key === 'ArrowLeft') goHero(-1);
              }}
              onTouchStart={(event) => {
                swipeStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
              }}
              onTouchEnd={(event) => {
                const start = swipeStart.current;
                swipeStart.current = null;
                if (!start || gallery.length < 2) return;
                const dx = event.changedTouches[0].clientX - start.x;
                const dy = event.changedTouches[0].clientY - start.y;
                if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) goHero(dx < 0 ? 1 : -1);
              }}
            >
              {/* Blurred copy fills the box behind portrait pages, so nothing is cropped and there are no empty bars. */}
              <img
                src={gallery[heroIndex]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
              />
              <button
                type="button"
                onClick={() => setLightboxIndex(heroIndex)}
                className="relative block h-full w-full cursor-zoom-in"
                aria-label={`Enlarge ${product.title} page ${heroIndex + 1}`}
              >
                <img
                  key={gallery[heroIndex]}
                  src={gallery[heroIndex]}
                  alt={heroIndex === 0 ? `${product.title} cover` : `${product.title} page preview ${heroIndex + 1}`}
                  width={1200}
                  height={1200}
                  decoding="async"
                  className="fade-in h-full w-full object-contain"
                />
              </button>
              {heroIndex === 0 && (
                <ScentGif number={product.id === 'workbook' ? 3 : product.id === 'layering' ? 7 : 9} alt="Animated fragrance accent" className="product-gif" />
              )}
              <CanvaBadge />

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goHero(-1)}
                    aria-label="Previous page"
                    className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-burgundy shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goHero(1)}
                    aria-label="Next page"
                    className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-burgundy shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/55 px-3 py-1 text-xs tabular-nums text-white">
                    {heroIndex + 1} / {gallery.length}
                  </span>
                  <span className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
                    <ZoomIn size={13} /> Tap to enlarge
                  </span>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Preview pages">
                {gallery.map((image, i) => (
                  <button
                    key={image + i}
                    type="button"
                    role="tab"
                    aria-selected={i === heroIndex}
                    aria-label={`Show page ${i + 1}`}
                    onClick={() => setHeroIndex(i)}
                    className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-[#efe4d4]/40 transition sm:h-20 sm:w-16 ${
                      i === heroIndex ? 'border-[#b08d57] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-xs uppercase tracking-widest text-gold">
              {product.category} &middot; {product.format}
            </span>
            <h1 className="mt-3 font-serif-display text-4xl text-burgundy md:text-5xl">{product.title}</h1>
            <p className="mt-2 text-lg text-charcoal/60">{product.subtitle}</p>

            <p className="mt-6 text-base leading-relaxed text-charcoal/80">{product.fullDescription}</p>

            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-serif-display text-4xl text-burgundy">${product.price}</span>
              <span className="text-sm text-charcoal/50">One-time payment &middot; Instant download</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <BuyButton
                label={product.ctaLabel}
                price={product.price}
                itemId={product.id}
                productId={product.id}
                onNavigate={onNavigate}
                pulse
              />
              <a
                href="#preview"
                onClick={() => track('product_preview', { item: product.id })}
                className="btn-secondary"
              >
                {product.previewCtaLabel}
              </a>
            </div>

            {!inStock && (
              <div className="mt-6 rounded-2xl border border-[#b08d57]/30 bg-[#efe4d4]/50 p-5">
                <p className="font-serif-display text-xl text-burgundy">Get notified when it is back</p>
                <p className="mt-1 text-sm text-charcoal/70">
                  This one is out of stock for now. Leave your email and we will message you the moment it is available.
                </p>
                <NewsletterForm
                  source={`restock-${product.id}`}
                  buttonLabel="Notify me"
                  successMessage="Done — we will email you as soon as it is available."
                  className="mt-4"
                />
              </div>
            )}

            {inStock && (
              <div className="mt-5">
                <PinItButton path={`/products/${product.slug}`} image={cover} description={`${product.title} — ${product.subtitle}`} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-charcoal/60">
              <span className="inline-flex items-center gap-2">
                <Zap size={16} className="text-gold" />
                Instant digital delivery
              </span>
              <span className="text-charcoal/30">|</span>
              <span className="inline-flex items-center gap-2">
                <FileText size={16} className="text-gold" />
                {product.format}
              </span>
            </div>

            <p className="mt-6 rounded-xl border border-[#b08d57]/20 bg-[#efe4d4]/40 px-4 py-3 text-xs text-charcoal/60">
              📖 {product.importantNote}
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-charcoal/60">
              <PenLine size={14} className="text-gold" />
              {product.editableNote}
            </p>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="section-eyebrow">What's Inside</p>
              <h2 className="font-serif-display text-3xl text-burgundy">Everything you need</h2>
              <ul className="mt-6 space-y-3">
                {product.features.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-charcoal/80">
                    <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#efe4d4]/40 p-8">
              <p className="section-eyebrow">Who It's For</p>
              <h3 className="font-serif-display text-2xl text-burgundy">Perfect for you if...</h3>
              <p className="mt-4 text-charcoal/80">{product.whoFor}</p>

              <p className="section-eyebrow mt-8">How To Use It</p>
              <ol className="mt-3 space-y-3">
                {product.howToUse.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-charcoal/80">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-burgundy text-[10px] font-medium text-[#f7f1e8]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Product video (only when the product has one) */}
      {product.video && (
        <section className="mx-auto max-w-3xl px-6 pt-6 lg:px-10">
          <div className="mb-6 text-center">
            <p className="section-eyebrow">See It In Action</p>
            <h2 className="font-serif-display text-3xl text-burgundy">A quick look inside</h2>
          </div>
          <video
            className="aspect-square w-full rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/40 shadow-lg"
            controls
            playsInline
            preload="none"
            poster={product.video.poster}
            aria-label={`${product.title} preview video`}
          >
            <source src={product.video.src} type="video/mp4" />
          </video>
        </section>
      )}

      {/* See what's inside */}
      <section id="preview" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 lg:px-10">
        <div className="mb-10 text-center">
          <p className="section-eyebrow">See What's Inside</p>
          <h2 className="font-serif-display text-3xl text-burgundy">A closer look</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {gallery.slice(gridStart).map((image, i) => (
            <button
              type="button"
              key={image + i}
              onClick={() => setLightboxIndex(i + gridStart)}
              className="group relative block aspect-[1199/1551] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/40 shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
              aria-label={`Enlarge ${product.title} preview ${i + 1 + gridStart}`}
            >
              <img
                src={image}
                alt={`${product.title} preview ${i + 1 + gridStart}`}
                width={1199}
                height={1551}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="pointer-events-none absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-80 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <ZoomIn size={16} />
              </span>
            </button>
          ))}
          {gallery.length <= 1 && (
            <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-dashed border-[#b08d57]/30 bg-white/40 p-6 text-center text-xs uppercase tracking-widest text-charcoal/40">
              More interior pages coming soon
            </div>
          )}
        </div>
      </section>

      {/* Upsell */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <p className="mb-2 text-center font-serif-display text-2xl text-burgundy">{product.upsellHeadline}</p>
          <p className="mb-6 text-center text-sm text-charcoal/60">Add as many as you like — they'll all go through in one checkout.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((rel) => (
              <div key={rel.id} className="overflow-hidden rounded-2xl p-8" style={{ background: rel.accent }}>
                <p className="text-xs uppercase tracking-[0.3em] text-[#b08d57]">Complete your ritual</p>
                <h3 className="mt-2 font-serif-display text-2xl text-[#f7f1e8]">{rel.title}</h3>
                <p className="mt-3 text-sm text-[#f7f1e8]/70">{product.upsellMessage}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="font-serif-display text-3xl font-bold tabular-nums text-[#f7f1e8]">${rel.price}</span>
                  <button
                    onClick={() => onNavigate(`product-${rel.slug}`)}
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#f7f1e8]/70 underline-offset-4 transition-colors hover:text-[#f7f1e8] hover:underline"
                  >
                    View details
                  </button>
                </div>
                <AddToCartButton productId={rel.id} className="mt-4" />
              </div>
            ))}
          </div>

          <div className="bundle-highlight-box mt-8 rounded-2xl p-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#b08d57]">✨ Best value — build the complete collection</p>
            <h3 className="mt-3 flex items-baseline justify-center gap-3 font-serif-display text-4xl font-bold text-burgundy">
              <span className="tabular-nums">${bundle.price}</span>
              <span className="text-xl font-normal tabular-nums text-charcoal/40 line-through">${bundle.originalPrice}</span>
            </h3>
            <button
              onClick={() => {
                track('bundle_click', { source: `product_${product.id}` });
                onNavigate('bundle');
              }}
              className="mt-5 btn-primary"
            >
              View The Complete Bundle
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="border-y border-[#b08d57]/15 bg-white py-10">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-sm text-charcoal/60 lg:px-10">
          <span className="inline-flex items-center gap-2">
            <Lock size={16} className="text-gold" /> Secure checkout
          </span>
          <span className="inline-flex items-center gap-2">
            <Zap size={16} className="text-gold" /> Instant digital delivery
          </span>
          <span className="inline-flex items-center gap-2">
            <FileText size={16} className="text-gold" /> Digital product
          </span>
          <span className="inline-flex items-center gap-2">
            <Globe size={16} className="text-gold" /> Available worldwide
          </span>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="mb-10 text-center">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="font-serif-display text-3xl text-burgundy">Questions & answers</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-[#b08d57]/15 bg-[#f7f1e8]/40 p-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-burgundy">
                  {faq.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-burgundy py-16 text-center text-[#f7f1e8]">
        <div className="mx-auto max-w-2xl px-6 lg:px-10">
          <h2 className="font-serif-display text-3xl">Ready to get started?</h2>
          <p className="mt-3 text-[#f7f1e8]/70">{product.shortDescription}</p>
          <div className="mt-6 flex justify-center">
            <BuyButton label={product.ctaLabel} price={product.price} itemId={product.id} productId={product.id} onNavigate={onNavigate} />
          </div>
        </div>
      </section>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={gallery}
          index={lightboxIndex}
          alt={product.title}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={(i) => {
            setLightboxIndex(i);
            setHeroIndex(i);
          }}
        />
      )}
    </div>
  );
}
