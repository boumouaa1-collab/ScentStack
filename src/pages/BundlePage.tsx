import { ArrowRight, Check, Layers } from 'lucide-react';
import { bundle, products } from '@/data/products';
import BuyButton from '@/components/BuyButton';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import ScentGif from '@/components/ScentGif';
import CanvaBadge from '@/components/CanvaBadge';

type BundlePageProps = {
  onNavigate: (page: string) => void;
};

export default function BundlePage({ onNavigate }: BundlePageProps) {
  useDocumentMeta(
    `${bundle.name} | Scent Stack`,
    `${bundle.description} Get all three for $${bundle.price} instead of $${bundle.originalPrice}.`
  );

  return (
    <div className="fade-in pt-24">
      <section className="mx-auto max-w-5xl px-6 py-12 text-center lg:px-10">
        <p className="section-eyebrow">Best Value</p>
        <h1 className="font-serif-display text-5xl text-burgundy md:text-6xl">{bundle.name}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70">{bundle.description}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="font-serif-display text-5xl text-burgundy">${bundle.price}</span>
          <span className="text-xl text-charcoal/40 line-through">${bundle.originalPrice}</span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium uppercase tracking-widest text-green-700">
            SAVE ${bundle.saving}
          </span>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <BuyButton
            label="Get The Complete Scent Stack"
            price={bundle.price}
            itemId="bundle"
            productId="bundle"
            pulse
            onNavigate={onNavigate}
          />
          <button onClick={() => onNavigate('home')} className="btn-secondary">
            Browse separately
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-2xl border border-[#b08d57]/15 bg-white">
              <div
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-6"
                style={{ background: product.accent }}
              >
                <ScentGif number={product.id === 'workbook' ? 3 : product.id === 'layering' ? 7 : 9} alt="Animated fragrance accent" className="product-gif" />
                <img
                  src={product.coverImage}
                  alt={`${product.title} cover`}
                  className="max-h-full w-auto max-w-full rounded-sm object-contain shadow-lg"
                />
                <CanvaBadge />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-gold">{product.category}</p>
                <h3 className="mt-1 font-serif-display text-xl text-burgundy">{product.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{product.shortDescription}</p>
                <ul className="mt-4 space-y-2">
                  {product.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate(`product-${product.slug}`)}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium uppercase tracking-widest text-burgundy hover:text-plum"
                >
                  See details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-burgundy py-16 text-[#f7f1e8]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <Layers className="text-gold" size={32} />
          <h2 className="font-serif-display text-3xl">Three digital fragrance tools. One complete system.</h2>
          <p className="max-w-xl text-[#f7f1e8]/70">
            Download all three PDFs immediately after checkout. Print them or use them on your tablet —
            yours to keep forever.
          </p>
          <BuyButton label="Get The Complete Scent Stack" price={bundle.price} itemId="bundle" productId="bundle" onNavigate={onNavigate} />
        </div>
      </section>
    </div>
  );
}
