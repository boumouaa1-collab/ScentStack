import { Bookmark } from 'lucide-react';
import { siteConfig } from '@/data/products';

type PinItButtonProps = {
  path: string; // page path, e.g. /blog/my-post
  image: string; // image path or absolute URL to pin
  description: string;
  className?: string;
};

const abs = (value: string) => (value.startsWith('http') ? value : `${siteConfig.siteUrl}${value}`);

// Opens Pinterest's own "create Pin" dialog — no third-party script needed.
export default function PinItButton({ path, image, description, className = '' }: PinItButtonProps) {
  const href = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(abs(path))}&media=${encodeURIComponent(
    abs(image),
  )}&description=${encodeURIComponent(description)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border border-[#b08d57]/40 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-burgundy transition hover:bg-[#efe4d4] ${className}`}
    >
      <Bookmark size={14} className="text-gold" />
      Save to Pinterest
    </a>
  );
}
