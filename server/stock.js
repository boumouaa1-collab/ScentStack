import { readFileSync } from 'node:fs';

// Reads the same src/data/stock.json the website uses, so one switch controls both the UI and the server.
function readStock() {
  const candidates = [
    () => new URL('../src/data/stock.json', import.meta.url),
    () => `${process.cwd()}/src/data/stock.json`,
  ];
  for (const candidate of candidates) {
    try {
      return JSON.parse(readFileSync(candidate(), 'utf8'));
    } catch {
      // try the next location
    }
  }
  console.warn('stock.json not found — treating the shop as in stock.');
  return { outOfStock: false, availableIds: [] };
}

export function isOutOfStock() {
  return readStock().outOfStock === true;
}

// True when this product can be bought right now (shop in stock, the $1 test, or listed in availableIds).
export function isProductAvailable(id) {
  const stock = readStock();
  if (stock.outOfStock !== true) return true;
  if (id === 'livetest') return true;
  return Array.isArray(stock.availableIds) && stock.availableIds.includes(id);
}
