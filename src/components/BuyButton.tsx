import { ShoppingBag } from 'lucide-react';
import { track } from '@/lib/analytics';
import { isBuyable, stockMessage } from '@/lib/stock';

type BuyButtonProps = {
  label: string;
  price: number;
  itemId: string;
  className?: string;
  pulse?: boolean;
  onNavigate?: (page: string) => void;
  productId?: string;
  productSlug?: string;
};

export default function BuyButton({
  label,
  price,
  itemId,
  className = '',
  pulse = false,
  onNavigate,
  productId,
  productSlug,
}: BuyButtonProps) {
  // While the shop is out of stock, buttons that lead to checkout become a clear notice instead.
  const goesToCheckout = !productSlug;
  if (goesToCheckout && !isBuyable(productId ?? itemId)) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#b08d57]/40 bg-[#efe4d4] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-charcoal/60 ${className}`}
      >
        {stockMessage}
      </button>
    );
  }

  const soldOut = !isBuyable(productId ?? itemId);

  const handleClick = () => {
    track('checkout_click', { item: itemId, price });
    if (onNavigate) {
      const target = productSlug ? `product-${productSlug}` : productId ? `checkout:${productId}` : 'checkout';
      onNavigate(target);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn-primary ${pulse ? 'btn-pulse' : ''} ${className}`}
    >
      <ShoppingBag size={16} />
      {soldOut ? `Out of stock — view details` : `${label} — $${price}`}
    </button>
  );
}
