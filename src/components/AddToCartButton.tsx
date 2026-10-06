import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { isBuyable, stockMessage } from '@/lib/stock';

type AddToCartButtonProps = {
  productId: string;
  className?: string;
};

export default function AddToCartButton({ productId, className = '' }: AddToCartButtonProps) {
  const { hasItem, toggleItem } = useCart();
  const inCart = hasItem(productId);

  if (!isBuyable(productId)) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#b08d57]/40 bg-[#efe4d4] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-charcoal/60 ${className}`}
      >
        {stockMessage}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleItem(productId)}
      aria-pressed={inCart}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
        inCart
          ? 'bg-white text-burgundy ring-2 ring-[#b08d57]'
          : 'bg-[#b08d57] text-white hover:bg-[#c5a36c]'
      } ${className}`}
    >
      {inCart ? (
        <>
          <Check size={16} /> Added to cart
        </>
      ) : (
        <>
          <ShoppingBag size={16} /> Add to cart
        </>
      )}
    </button>
  );
}
