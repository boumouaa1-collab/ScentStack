import stock from '@/data/stock.json';

// One switch for the whole shop: edit src/data/stock.json -> "outOfStock".
// The $1 live-test product stays purchasable so you can keep testing the checkout.
export const outOfStock: boolean = stock.outOfStock;
export const stockBadge: string = stock.badge;
export const stockMessage: string = stock.message;

export const availableIds: string[] = (stock as { availableIds?: string[] }).availableIds ?? [];

export const isBuyable = (id?: string): boolean =>
  !outOfStock || id === 'livetest' || (id !== undefined && availableIds.includes(id));


// Products whose PDFs are not live yet show a branded "Out of stock" picture instead of a cover.
// Once an id is added to availableIds in stock.json, its real cover/preview images are used again.
const soonImageIds = ['collector', 'journal', 'printable', 'signature', 'wardrobe'];

type Visual = { id: string; coverImage: string; previewImages: string[] };

const showSoon = (id: string): boolean => soonImageIds.includes(id) && !isBuyable(id);

export const soldOutImage = (id: string): string => `/productImages/soon/${id}.webp`;

export const coverFor = (product: Visual): string => (showSoon(product.id) ? soldOutImage(product.id) : product.coverImage);

export const galleryFor = (product: Visual): string[] =>
  showSoon(product.id)
    ? [soldOutImage(product.id)]
    : product.previewImages.length > 0
      ? product.previewImages
      : [product.coverImage];
