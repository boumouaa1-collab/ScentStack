// Regenerates public/sitemap.xml from the actual blog + product data, so the
// sitemap can never silently go stale. Runs automatically before every build
// via the "prebuild" npm script — you don't need to touch this by hand.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SITE = 'https://scentstack.store';
const today = new Date().toISOString().slice(0, 10);

function extractSlugs(filePath) {
  const text = readFileSync(filePath, 'utf-8');
  return [...text.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
}

// Exclude internal/test-only product slugs that should never be indexed.
const HIDDEN_PRODUCT_SLUGS = new Set(['live-checkout-test']);

const blogSlugs = extractSlugs(path.join(root, 'src/data/blog.ts'));
const productSlugs = extractSlugs(path.join(root, 'src/data/products.ts')).filter(
  (slug) => !HIDDEN_PRODUCT_SLUGS.has(slug)
);

const urls = [
  { loc: `${SITE}/`, priority: '1.0' },
  { loc: `${SITE}/shop`, priority: '0.9' },
  { loc: `${SITE}/bundle`, priority: '0.7' },
  { loc: `${SITE}/blog`, priority: '0.8' },
  { loc: `${SITE}/about`, priority: '0.5' },
  { loc: `${SITE}/faq`, priority: '0.5' },
  { loc: `${SITE}/contact`, priority: '0.4' },
  ...productSlugs.map((slug) => ({ loc: `${SITE}/products/${slug}`, priority: '0.8' })),
  ...blogSlugs.map((slug) => ({ loc: `${SITE}/blog/${slug}`, priority: '0.7', lastmod: today })),
  { loc: `${SITE}/privacy`, priority: '0.3' },
  { loc: `${SITE}/terms`, priority: '0.3' },
  { loc: `${SITE}/refund-policy`, priority: '0.3' },
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority>${
          u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''
        }</url>`
    )
    .join('\n') +
  `\n</urlset>\n`;

writeFileSync(path.join(root, 'public/sitemap.xml'), xml, 'utf-8');
console.log(`sitemap.xml generated with ${urls.length} URLs (${blogSlugs.length} blog posts, ${productSlugs.length} products)`);
