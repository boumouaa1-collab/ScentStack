import { readFileSync } from 'node:fs';

// Dynamic sitemap: every normal page, plus scheduled blog articles ONLY once their publish time has passed.
// Served at /sitemap.xml (see vercel.json rewrite). The schedule lives in src/data/blog-schedule.json.
const SITE = 'https://scentstack.store';

// [path, priority, lastmod?]
const STATIC_URLS = [
  ['/', '1.0'],
  ['/shop', '0.9'],
  ['/bundle', '0.7'],
  ['/blog', '0.8'],
  ['/about', '0.5'],
  ['/faq', '0.5'],
  ['/contact', '0.4'],
  ['/products/fragrance-discovery-workbook', '0.8'],
  ['/products/fragrance-collection-tracker', '0.8'],
  ['/products/digital-fragrance-journal', '0.8'],
  ['/products/perfume-journal-printable', '0.8'],
  ['/products/find-your-signature-scent', '0.8'],
  ['/products/fragrance-wardrobe-planner', '0.8'],
  ['/blog/how-to-organize-your-perfume-collection', '0.7', '2026-10-04'],
  ['/blog/how-to-layer-perfume-beginners-guide', '0.7', '2026-10-04'],
  ['/blog/how-to-find-your-signature-scent', '0.7', '2026-10-04'],
  ['/blog/perfume-notes-explained-top-middle-base', '0.7', '2026-10-04'],
  ['/blog/build-a-fragrance-wardrobe-for-every-season', '0.7', '2026-10-04'],
  ['/blog/how-long-does-perfume-last-shelf-life-storage', '0.7', '2026-10-04'],
  ['/blog/niche-vs-designer-perfume-difference', '0.7', '2026-10-04'],
  ['/blog/how-to-test-perfume-samples-properly', '0.7', '2026-10-04'],
  ['/blog/perfume-mistakes-beginners-make', '0.7', '2026-10-04'],
  ['/blog/perfume-journal-vs-spreadsheet', '0.7', '2026-10-04'],
  ['/blog/perfume-concentrations-explained-parfum-edp-edt-edc', '0.7', '2026-10-04'],
  ['/blog/how-to-make-perfume-last-longer-on-skin', '0.7', '2026-10-04'],
  ['/blog/how-to-choose-a-fragrance-gift', '0.7', '2026-10-04'],
  ['/blog/fragrance-families-explained-floral-woody-oriental-fresh', '0.7', '2026-10-04'],
  ['/blog/how-to-travel-with-perfume-decanting-tsa-rules', '0.7', '2026-10-04'],
  ['/blog/why-perfume-smells-different-on-everyone-skin-chemistry', '0.7', '2026-10-04'],
  ['/blog/layering-perfume-with-lotion-does-it-work', '0.7', '2026-10-04'],
  ['/blog/unisex-perfume-do-masculine-feminine-labels-mean-anything', '0.7', '2026-10-04'],
  ['/blog/how-many-perfumes-should-you-own-starter-collection', '0.7', '2026-10-04'],
  ['/blog/perfume-oils-vs-sprays-whats-the-difference', '0.7', '2026-10-04'],
  ['/blog/how-to-spot-a-fake-perfume-before-you-buy', '0.7', '2026-10-04'],
  ['/privacy', '0.3'],
  ['/terms', '0.3'],
  ['/refund-policy', '0.3']
];

function loadSchedule() {
  const candidates = [
    () => new URL('../src/data/blog-schedule.json', import.meta.url),
    () => `${process.cwd()}/src/data/blog-schedule.json`,
  ];
  for (const candidate of candidates) {
    try {
      return JSON.parse(readFileSync(candidate(), 'utf8'));
    } catch {
      // try the next location
    }
  }
  return { time: '20:30', timeZone: 'Africa/Casablanca', posts: {} };
}

function zoneOffsetMs(utcMs, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(new Date(utcMs))
      .map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

function zonedTimeToUtcMs(date, time, timeZone) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let ms = guess - zoneOffsetMs(guess, timeZone);
  ms = guess - zoneOffsetMs(ms, timeZone);
  return ms;
}

function publishAt(value, schedule) {
  if (!value) return null;
  if (value.length > 10) {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
  }
  return zonedTimeToUtcMs(value, schedule.time, schedule.timeZone);
}

export default function handler(req, res) {
  const schedule = loadSchedule();
  const now = Date.now();
  const entries = STATIC_URLS.map(([path, priority, lastmod]) => ({ path, priority, lastmod }));
  const known = new Set(entries.map((entry) => entry.path));

  for (const [slug, value] of Object.entries(schedule.posts || {})) {
    const at = publishAt(value, schedule);
    const path = `/blog/${slug}`;
    if (at !== null && at <= now && !known.has(path)) {
      entries.push({ path, priority: '0.7', lastmod: new Date(at).toISOString().slice(0, 10) });
    }
  }

  const body = entries
    .map(
      (entry) =>
        `  <url><loc>${SITE}${entry.path === '/' ? '/' : entry.path}</loc><priority>${entry.priority}</priority>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}</url>`
    )
    .join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}
