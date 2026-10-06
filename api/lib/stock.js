import { readFileSync } from 'node:fs';

// Reads the same src/data/stock.json the website uses, so one switch controls both the UI and the server.
export function isOutOfStock() {
  const candidates = [
    () => new URL('../../src/data/stock.json', import.meta.url),
    () => `${process.cwd()}/src/data/stock.json`,
  ];
  for (const candidate of candidates) {
    try {
      return JSON.parse(readFileSync(candidate(), 'utf8')).outOfStock === true;
    } catch {
      // try the next location
    }
  }
  console.warn('stock.json not found — treating the shop as in stock.');
  return false;
}
