import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

type AddToCartButtonProps = {
  productId: string;
  className?: string;
};

export default function AddToCartButton({ productId, className = '' }: AddToCartButtonProps) {
  const { hasItem, toggleItem } = useCart();
  const inCart = hasItem(productId);

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
