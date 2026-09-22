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
