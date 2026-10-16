import { ArrowRight, BadgeCheck, Check, Download, Lock, Printer } from 'lucide-react';
import { bundle, products } from '@/data/products';
import { outOfStock } from '@/lib/stock';
import { track } from '@/lib/analytics';
import Reveal from '@/components/Reveal';

type BundleShowcaseProps = { onNavigate: (page: string) => void };

const money = (value: number) => `$${value.toFixed(2)}`;

// Home page bundle offer: what is inside, one big clear price, and the saving spelled out.
export default function BundleShowcase({ onNavigate }: BundleShowcaseProps) {
  const included = bundle.productIds.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p));
  const separateTotal = included.reduce((sum, p) => sum + p.price, 0);
  const saving = Math.round((separateTotal - bundle.price) * 100) / 100;
  const percent = Math.round((saving / separateTotal) * 100);
  const perTool = Math.round((bundle.price * 100) / included.length) / 100;

  return (
    <section
      className="relative overflow-hidden bg-burgundy py-20 text-[#f7f1e8] md:py-24"
      aria-labelledby="bundle-title"
      style={{ backgroundImage: 'radial-gradient(60% 80% at 85% 10%, rgba(176,141,87,0.22), transparent 70%)' }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10">
        {/* What is inside */}
        <Reveal className="order-2 lg:order-1">
          <div className="rounded-3xl bg-[#f7f1e8] p-6 text-charcoal shadow-2xl sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#7d6030]">What’s inside</p>
            <ul className="mt-4 divide-y divide-[#b08d57]/20">
              {included.map((product, index) => (
                <li key={product.id} className="flex items-center gap-4 py-3.5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif-display text-lg text-[#f7f1e8]"
                    style={{ background: product.accent }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif-display text-lg leading-snug text-burgundy">{product.title}</span>
                    <span className="block text-sm text-charcoal/65">{product.subtitle}</span>
                  </span>
                  <span className="shrink-0 text-base font-medium tabular-nums text-charcoal/80">{money(product.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between border-t-2 border-dashed border-[#b08d57]/40 pt-4">
              <span className="text-sm uppercase tracking-[0.15em] text-charcoal/70">Total if bought separately</span>
              <span className="text-lg tabular-nums text-charcoal/60 line-through">{money(separateTotal)}</span>
            </div>
          </div>
        </Reveal>

        {/* Price + call to action */}
        <Reveal delay={90} className="order-1 text-center lg:order-2 lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e8d3a6] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
            <BadgeCheck size={15} /> Best value
          </span>
          <h2 id="bundle-title" className="mt-5 font-serif-display text-4xl leading-tight md:text-5xl">
            {bundle.name}
          </h2>
          <p className="mt-3 text-lg text-[#f7f1e8]/80">{bundle.description}</p>

          <div className="mt-7 rounded-3xl border border-[#e8d3a6]/40 bg-white/5 p-6 sm:p-7">
            <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-1 lg:justify-start">
              <span className="font-serif-display text-7xl leading-none text-white sm:text-8xl">{money(bundle.price)}</span>
              <span className="pb-2 text-2xl text-[#f7f1e8]/60 line-through">{money(separateTotal)}</span>
            </div>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[#e8d3a6]">One-time payment · no subscription</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="rounded-full bg-[#e8d3a6] px-4 py-1.5 text-sm font-semibold text-burgundy">
                You save {money(saving)} ({percent}% off)
              </span>
              <span className="rounded-full border border-[#e8d3a6]/50 px-4 py-1.5 text-sm text-[#f7f1e8]">
                Just {money(perTool)} per tool
              </span>
            </div>
          </div>

          <ul className="mt-6 grid gap-2 text-left text-sm text-[#f7f1e8]/85 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <li className="flex items-center gap-2"><Download size={16} className="shrink-0 text-[#e8d3a6]" /> Instant digital download</li>
            <li className="flex items-center gap-2"><Printer size={16} className="shrink-0 text-[#e8d3a6]" /> Printable + digital-friendly</li>
            <li className="flex items-center gap-2"><Lock size={16} className="shrink-0 text-[#e8d3a6]" /> Secure PayPal checkout</li>
            <li className="flex items-center gap-2"><Check size={16} className="shrink-0 text-[#e8d3a6]" /> All six tools, one system</li>
          </ul>

          <button
            type="button"
            onClick={() => {
              track('bundle_click', { source: 'homepage_banner' });
              onNavigate('bundle');
            }}
            className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#e8d3a6] px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-burgundy shadow-lg transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
          >
            {outOfStock ? 'See the complete bundle' : `Get the bundle — ${money(bundle.price)}`}
            <ArrowRight size={18} />
          </button>
          {outOfStock && (
            <p className="mt-3 text-sm text-[#f7f1e8]/70">Launching soon — the full bundle opens once all six downloads are ready.</p>
          )}
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="mx-auto mt-4 block text-sm text-[#f7f1e8]/75 underline underline-offset-4 transition hover:text-white lg:mx-0"
          >
            or browse the products separately
          </button>
        </Reveal>
      </div>
    </section>
  );
}
