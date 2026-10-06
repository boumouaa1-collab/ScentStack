export const productCatalog = {
  discovery: {
    id: 'discovery',
    slug: 'fragrance-discovery-workbook',
    name: 'Fragrance Discovery Workbook',
    price: 6.99,
    currency: 'USD',
    fileName: 'prod1.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod1.pdf',
    hostedButtonId: 'QNG7RNTA9NTSE',
  },
  collector: {
    id: 'collector',
    slug: 'fragrance-collection-tracker',
    name: 'The Fragrance Collection Tracker',
    price: 8.99,
    currency: 'USD',
    fileName: 'prod2.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod2.pdf',
    hostedButtonId: 'BZZK6532YYDYC',
  },
  journal: {
    id: 'journal',
    slug: 'digital-fragrance-journal',
    name: 'Digital Fragrance Journal',
    price: 9.99,
    currency: 'USD',
    fileName: 'prod3.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod3.pdf',
    hostedButtonId: 'T6JVGXWGLS2HG',
  },
  printable: {
    id: 'printable',
    slug: 'perfume-journal-printable',
    name: 'Perfume Journal Printable',
    price: 4.99,
    currency: 'USD',
    fileName: 'prod4.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod4.pdf',
    hostedButtonId: 'FYLAUZ43PFNSE',
  },
  signature: {
    id: 'signature',
    slug: 'find-your-signature-scent',
    name: 'Find Your Signature Scent',
    price: 9.99,
    currency: 'USD',
    fileName: 'prod5.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod5.pdf',
    hostedButtonId: 'RYBULUXJP5HGG',
  },
  wardrobe: {
    id: 'wardrobe',
    slug: 'fragrance-wardrobe-planner',
    name: 'The Fragrance Wardrobe Planner',
    price: 8.99,
    currency: 'USD',
    fileName: 'prod6.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod6.pdf',
    hostedButtonId: 'FW7KUV85MFFSJ',
  },
};

// Hidden $1 product used only to verify the live PayPal flow end-to-end before
// trusting it with real products. Delivers a harmless test.pdf (upload any small PDF with that name).
productCatalog.livetest = {
  id: 'livetest',
  slug: 'live-checkout-test',
  name: 'Live Checkout Test',
  price: 1.00,
  currency: 'USD',
  fileName: 'test.pdf',
  storageBucket: 'digital-products',
  storagePath: 'test.pdf',
  hostedButtonId: '',
};

export const bundleProduct = {
  id: 'bundle',
  name: 'Build Your Complete Scent Stack',
  price: 39.99,
  currency: 'USD',
  // FIXME: this currently duplicates the 'printable' product's button — it is NOT a real
  // bundle button yet. Create a dedicated Hosted Button in PayPal for $39.99 named
  // "Build Your Complete Scent Stack" and paste its ID here AND in src/data/products.ts
  // (the `bundle.hostedButtonId` field). Until then, do not sell the bundle live.
  hostedButtonId: 'FYLAUZ43PFNSE',
  productIds: ['discovery', 'collector', 'journal', 'printable', 'signature', 'wardrobe'],
};

export function getProductById(productId) {
  const id = String(productId || '').toLowerCase();
  return productCatalog[id] || productCatalog[id.replace(/[^a-z]+/g, '')] || null;
}

export function getProductBySlug(slug) {
  const normalized = String(slug || '').toLowerCase();
  return Object.values(productCatalog).find((product) => product.slug === normalized || product.id === normalized) || null;
}

export function getProduct(productIdOrSlug) {
  return getProductById(productIdOrSlug) || getProductBySlug(productIdOrSlug);
}

export function getProductPrice(productIdOrSlug) {
  const product = getProduct(productIdOrSlug);
  return product ? Number(product.price) : null;
}


// ---------------------------------------------------------------------------
// Order resolution — the ONE place that decides what an order contains and costs.
// create-order stores `ref` on the PayPal order; capture-order reads it back from
// PayPal (never from the browser) so nobody can pay for one thing and receive another.
// ---------------------------------------------------------------------------
const toCents = (value) => Math.round(Number(value) * 100);

export function resolveOrder(ids) {
  const list = (Array.isArray(ids) ? ids : [ids])
    .map((id) => String(id || '').toLowerCase().trim())
    .filter(Boolean);

  if (list.includes(bundleProduct.id)) {
    return {
      isBundle: true,
      products: bundleProduct.productIds.map((id) => productCatalog[id]),
      total: toCents(bundleProduct.price) / 100,
      ref: bundleProduct.id,
    };
  }

  const seen = new Set();
  const products = [];
  for (const id of list) {
    const product = getProduct(id);
    if (product && !seen.has(product.id)) {
      seen.add(product.id);
      products.push(product);
    }
  }

  const cents = products.reduce((sum, product) => sum + toCents(product.price), 0);
  return { isBundle: false, products, total: cents / 100, ref: products.map((product) => product.id).join(',') };
}

export function resolveOrderFromReference(reference) {
  return resolveOrder(String(reference || '').split(/[,+]/));
}
