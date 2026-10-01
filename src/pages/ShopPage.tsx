import { ArrowRight, Check } from 'lucide-react';
import { products } from '@/data/products';
import BuyButton from '@/components/BuyButton';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import ScentGif from '@/components/ScentGif';
import CanvaBadge from '@/components/CanvaBadge';
import Reveal from '@/components/Reveal';
import TiltCard from '@/components/TiltCard';

type ShopPageProps = {
  onNavigate: (page: string) => void;
};

export default function ShopPage({ onNavigate }: ShopPageProps) {
  useDocumentMeta('Shop | Scent Stack', 'Browse the Scent Stack fragrance workbooks and digital journals.');

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-12 text-center">
          <p className="section-eyebrow">The Collection</p>
          <h1 className="font-serif-display text-5xl text-burgundy md:text-6xl">Shop Scent Stack</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal/70">
            Premium digital fragrance tools for perfume lovers who want a more intentional scent life.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 90}>
            <TiltCard className="product-card flex h-full flex-col overflow-hidden">
              <div className="product-visual relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#efe4d4] p-6" style={{ background: product.accent }}>
                <ScentGif number={product.id === 'workbook' ? 3 : product.id === 'layering' ? 7 : 9} alt="Animated fragrance accent" className="product-gif" />
                <img src={product.coverImage} alt={`${product.title} cover`} className="max-h-[300px] w-auto rounded-sm object-contain shadow-xl" />
                <CanvaBadge />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">{product.category}</span>
                  <span className="font-serif-display text-3xl text-burgundy">${product.price}</span>
                </div>
                <h2 className="font-serif-display text-3xl text-burgundy">{product.title}</h2>
                <p className="mt-2 text-sm text-charcoal/60">{product.subtitle}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/70">{product.shortDescription}</p>
                <ul className="mt-5 space-y-2">
                  {product.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3">
                  <BuyButton
                    productId={product.id}
                    label={product.ctaLabel}
                    price={product.price}
                    itemId={product.id}
                    productSlug={product.slug}
                    pulse
                    onNavigate={onNavigate}
                  />
                  <button
                    type="button"
                    onClick={() => onNavigate(`product-${product.slug}`)}
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-burgundy transition-colors hover:text-plum"
                  >
                    Learn more
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
