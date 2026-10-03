import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { products } from '@/data/products';

type CartBarProps = {
  onNavigate: (page: string) => void;
};

export default function CartBar({ onNavigate }: CartBarProps) {
  const { items, removeItem, clearCart } = useCart();

  if (items.length === 0) return null;

  const cartProducts = items.map((id) => products.find((p) => p.id === id)).filter(Boolean) as (typeof products)[number][];
  const total = cartProducts.reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <div className="cart-bar" role="status" aria-live="polite">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <ShoppingBag size={18} className="shrink-0 text-gold" />
          <span className="whitespace-nowrap text-sm font-medium text-charcoal">
            {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} ·{' '}
            <span className="font-serif-display text-xl text-burgundy">${total.toFixed(2)}</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cartProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => removeItem(p.id)}
                className="inline-flex items-center gap-1 rounded-full bg-[#efe4d4] px-3 py-1 text-xs text-charcoal/70 transition-colors hover:bg-[#e4d5bd]"
                title={`Remove ${p.title}`}
              >
                {p.title} <X size={11} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={clearCart}
            className="text-xs uppercase tracking-widest text-charcoal/50 transition-colors hover:text-charcoal/80"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => onNavigate('checkout:cart')}
            className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-plum"
          >
            Checkout <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
