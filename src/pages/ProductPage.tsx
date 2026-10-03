import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, Globe, Lock, PenLine, Zap } from 'lucide-react';
import type { Product } from '@/data/products';
import { getProductById, bundle } from '@/data/products';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';
import CanvaBadge from '@/components/CanvaBadge';
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

  useEffect(() => {
    track('product_view', { item: product.id });
  }, [product]);

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
          {/* Cover */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl p-6 shadow-xl"
              style={{ background: product.accent }}
            >
              <img
                src={product.coverImage}
                alt={`${product.title} cover`}
                className="float-cover max-h-full w-auto max-w-full rounded-sm object-contain shadow-lg"
              />
              <ScentGif number={product.id === 'workbook' ? 3 : product.id === 'layering' ? 7 : 9} alt="Animated fragrance accent" className="product-gif" />
              <CanvaBadge />
            </div>
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

      {/* See what's inside */}
      <section id="preview" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 lg:px-10">
        <div className="mb-10 text-center">
          <p className="section-eyebrow">See What's Inside</p>
          <h2 className="font-serif-display text-3xl text-burgundy">A closer look</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {product.previewImages.map((image, i) => (
            <div
              key={image + i}
              className="overflow-hidden rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/40 shadow-sm"
            >
              <img src={image} alt={`${product.title} preview ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
          {product.previewImages.length <= 1 && (
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
    </div>
  );
}
