import { useState } from 'react';
import { ArrowRight, BookOpen, Layers, Sparkles, Check, Gem, NotebookPen, Wand2 } from 'lucide-react';
import type { Product } from '@/data/products';
import { bundle } from '@/data/products';
import BuyButton from '@/components/BuyButton';
import CanvaBadge from '@/components/CanvaBadge';
import ScentGif from '@/components/ScentGif';
import PurchaseActivityToast from '@/components/PurchaseActivityToast';
import Reveal from '@/components/Reveal';
import TiltCard from '@/components/TiltCard';
import { track } from '@/lib/analytics';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

type HomeProps = {
  products: Product[];
  onNavigate: (page: string) => void;
};

export default function Home({ products, onNavigate }: HomeProps) {
  useDocumentMeta(
    'Scent Stack — Premium Fragrance Workbooks',
    'Premium digital fragrance workbooks. Build your scent wardrobe, track your collection, and master perfume layering. Instant download.'
  );

  return (
    <div className="fade-in">
      <PurchaseActivityToast onNavigate={onNavigate} />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f1e8] pt-32 pb-20">
        <div className="hero-blob hero-blob-a" aria-hidden="true" />
        <div className="hero-blob hero-blob-b" aria-hidden="true" />
        <ScentGif number={8} alt="Animated perfume bottle" className="hero-side-gif hero-side-gif-left" />
        <ScentGif number={11} alt="Animated fragrance detail" className="hero-side-gif hero-side-gif-right" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #4a1c2c 0, transparent 50%), radial-gradient(circle at 80% 70%, #b08d57 0, transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-10">
          <p className="section-eyebrow">Premium Digital Products For Fragrance Lovers</p>
          <h1 className="font-serif-display mx-auto max-w-4xl text-5xl leading-tight text-burgundy md:text-7xl">
            Your fragrance,
            <br />
            <span className="italic text-plum">beautifully organized.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70">
            Discover digital tools designed to help you understand your fragrance taste, organize
            your collection, experiment with layering, and build a wardrobe that feels uniquely
            yours.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#shop" className="btn-primary">
              Shop The Collection
              <ArrowRight size={16} />
            </a>
            <button
              onClick={() => {
                track('bundle_click', { source: 'hero' });
                onNavigate('bundle');
              }}
              className="btn-secondary"
            >
              View Bundle — ${bundle.price}
            </button>
          </div>
        </div>
      </section>

      {/* Trust marquee */}
      <section className="overflow-hidden border-y border-[#b08d57]/15 bg-white py-5">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              {[
                'Instant Digital Delivery',
                'Printable & Digital-Friendly',
                'Premium Editorial Design',
                'Secure Checkout Via PayPal',
                'No Subscription',
                'Available Worldwide',
              ].map((t) => (
                <span key={t} className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-charcoal/50">
                  <Sparkles size={14} className="text-gold" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-[#b08d57]/15 bg-[#efe4d4]/45 py-8">
        <div className="home-gif-showcase mx-auto flex max-w-5xl items-center justify-center px-6 lg:px-10">
          <ScentGif number={12} alt="Animated fragrance accent" className="home-feature-side-gif" />
          <ScentGif number={5} alt="Animated fragrance product detail" className="home-feature-gif" />
          <ScentGif number={12} alt="Animated fragrance accent" className="home-feature-side-gif" />
        </div>
      </section>

      {/* Feature section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Sparkles className="text-gold" size={26} />,
              title: 'Discover Your Taste',
              text: 'Understand the notes and scent families you naturally gravitate toward.',
            },
            {
              icon: <NotebookPen className="text-gold" size={26} />,
              title: 'Organize Your Collection',
              text: 'Keep your perfumes, reviews, favorites and wishlist beautifully organized.',
            },
            {
              icon: <Wand2 className="text-gold" size={26} />,
              title: 'Explore Layering',
              text: 'Experiment with combinations and keep track of the pairings you love.',
            },
            {
              icon: <Gem className="text-gold" size={26} />,
              title: 'Build Your Wardrobe',
              text: 'Plan scents around seasons, moods and occasions.',
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#efe4d4]/60">
                {f.icon}
              </div>
              <h3 className="font-serif-display text-xl text-burgundy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-[#b08d57]/15 bg-[#efe4d4]/45 py-10">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-5 px-6 sm:gap-10 lg:px-10">
          <ScentGif number={2} alt="Perfume bottle illustration" className="ritual-gif hidden sm:block" />
          <div className="text-center">
            <p className="section-eyebrow mb-2">Make scent personal</p>
            <p className="font-serif-display text-2xl text-burgundy sm:text-3xl">A more beautiful way to explore fragrance.</p>
          </div>
          <ScentGif number={6} alt="Perfume hand illustration" className="ritual-gif" />
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10">
        <div className="mb-12 text-center">
          <p className="section-eyebrow">The Collection</p>
          <h2 className="font-serif-display text-4xl text-burgundy md:text-5xl">
            Shop The Scent Stack Collection
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
            Beautiful digital tools for building a fragrance collection that feels like you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 90}>
            <TiltCard className="product-card group flex h-full flex-col">
              <ProductShowcase product={product} onNavigate={onNavigate} />
              <div className="flex flex-1 flex-col p-7">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-gold">{product.category}</span>
                  <span className="font-serif-display text-2xl text-burgundy">${product.price}</span>
                </div>
                <h3 className="font-serif-display text-2xl text-burgundy">{product.title}</h3>
                <p className="mt-1 text-sm text-charcoal/60">{product.subtitle}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/70">
                  {product.shortDescription}
                </p>
                <ul className="mt-5 space-y-2">
                  {product.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3">
                  <BuyButton
                    label={product.ctaLabel}
                    price={product.price}
                    itemId={product.id}
                    productId={product.id}
                    productSlug={product.slug}
                    onNavigate={onNavigate}
                    pulse
                  />
                  <button
                    onClick={() => onNavigate(`product-${product.slug}`)}
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-widest text-burgundy transition-colors hover:text-plum"
                  >
                    {product.previewCtaLabel}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bundle banner */}
      <section className="bg-burgundy py-20 text-[#f7f1e8]">
        <Reveal className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center lg:px-10">
          <Layers className="text-gold" size={32} />
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Build Your Complete Scent Stack</p>
          <h2 className="font-serif-display text-4xl md:text-5xl">{bundle.name}</h2>
          <p className="max-w-xl text-[#f7f1e8]/70">{bundle.description}</p>
          <div className="flex items-center gap-4">
            <span className="font-serif-display text-4xl">${bundle.price}</span>
            <span className="text-lg text-[#f7f1e8]/40 line-through">${bundle.originalPrice}</span>
            <span className="rounded-full bg-[#b08d57]/20 px-3 py-1 text-xs uppercase tracking-widest text-gold">
              SAVE ${bundle.saving}
            </span>
          </div>
          <button
            onClick={() => {
              track('bundle_click', { source: 'homepage_banner' });
              onNavigate('bundle');
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#b08d57] px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-[#c5a36c]"
          >
            Get The Complete Scent Stack
            <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-12 text-center">
          <p className="section-eyebrow">Simple & Instant</p>
          <h2 className="font-serif-display text-4xl text-burgundy">How it works</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: <BookOpen className="text-gold" size={28} />,
              title: 'Choose your tool',
              text: 'Pick the Workbook, the Layering Guide, the Wardrobe Planner, or grab the full bundle.',
            },
            {
              icon: <Check className="text-gold" size={28} />,
              title: 'Secure checkout',
              text: 'Complete payment safely through PayPal — we never collect card details on this site.',
            },
            {
              icon: <Sparkles className="text-gold" size={28} />,
              title: 'Instant download',
              text: 'Get your PDF immediately. Print it or use it on your tablet.',
            },
          ].map((step, i) => (
            <Reveal key={step.title} delay={i * 110}>
              <TiltCard className="rounded-2xl border border-[#b08d57]/15 bg-white p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#efe4d4]/60">
                  {step.icon}
                </div>
                <h3 className="mb-2 font-serif-display text-xl text-burgundy">{step.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal/70">{step.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-y border-[#b08d57]/15 bg-white py-16">
        <Reveal className="mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className="section-eyebrow">The Scent Letter</p>
          <h2 className="font-serif-display text-4xl text-burgundy">Make room for better scent days.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
            Get fragrance notes, layering ideas, and first access to new Scent Stack releases delivered to
            your inbox.
          </p>
          <NewsletterForm />
        </Reveal>
      </section>
    </div>
  );
}

function ProductShowcase({ product, onNavigate }: { product: Product; onNavigate: (page: string) => void }) {
  return (
    <div className="relative overflow-hidden bg-[#efe4d4]">
      <div className="relative mx-auto flex h-[27rem] max-w-[23rem] items-center justify-center p-5 sm:h-[31rem]">
        <ScentGif number={product.id === 'workbook' ? 3 : product.id === 'layering' ? 7 : 9} alt="Animated fragrance accent" className="product-gif" />
        <img
          src={product.coverImage}
          alt={`${product.title} cover`}
          className="max-h-[25rem] w-auto max-w-[88%] rounded-sm object-contain shadow-xl transition-transform duration-500 group-hover:scale-[1.02] sm:max-h-[29rem]"
        />
      </div>
      <CanvaBadge />
      <button
        type="button"
        onClick={() => onNavigate(`product-${product.slug}`)}
        className="absolute inset-0 z-[1]"
        aria-label={`View ${product.title}`}
      />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Newsletter signup failed');
      track('newsletter_signup');
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        className="min-w-0 flex-1 rounded-full border border-[#b08d57]/30 bg-[#f7f1e8] px-5 py-3.5 text-sm text-charcoal outline-none transition focus:border-gold focus:ring-1 focus:ring-[#b08d57]"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary whitespace-nowrap disabled:cursor-wait disabled:opacity-60"
      >
        {status === 'sending' ? 'Joining...' : 'Join the list'}
      </button>
      {status === 'success' && (
        <p className="basis-full text-sm text-green-700">You're on the list. Watch your inbox for the next Scent Letter.</p>
      )}
      {status === 'error' && (
        <p className="basis-full text-sm text-red-700">We couldn't save that email. Please try again.</p>
      )}
    </form>
  );
}
