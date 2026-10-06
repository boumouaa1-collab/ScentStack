import stock from '@/data/stock.json';

// One switch for the whole shop: edit src/data/stock.json -> "outOfStock".
// The $1 live-test product stays purchasable so you can keep testing the checkout.
export const outOfStock: boolean = stock.outOfStock;
export const stockBadge: string = stock.badge;
export const stockMessage: string = stock.message;

export const isBuyable = (id?: string): boolean => !outOfStock || id === 'livetest';
