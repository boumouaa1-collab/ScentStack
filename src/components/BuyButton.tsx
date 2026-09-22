import { ShoppingBag } from 'lucide-react';
import { track } from '@/lib/analytics';

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
      {label} — ${price}
    </button>
  );
}
