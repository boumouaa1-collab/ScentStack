export type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: 'USD';
  format: string;
  features: string[];
  howToUse: string[];
  whoFor: string;
  importantNote: string;
  coverImage: string;
  previewImages: string[];
  accent: string;
  seoTitle: string;
  seoDescription: string;
  relatedIds: string[];
  ctaLabel: string;
  previewCtaLabel: string;
  upsellHeadline: string;
  upsellMessage: string;
  editableNote: string;
  fileName: string;
  storageBucket: string;
  storagePath: string;
  hostedButtonId: string;
};

export const siteConfig = {
  siteUrl: 'https://scentstack.store',
  pinterestUrl: '',
  supportEmail: 'aymaneelmj@gmail.com',
};

export const isConfigured = (value: string) => {
  const trimmed = value?.trim?.() ?? '';
  return trimmed.length > 0 && !/^https?:\/\//i.test(trimmed) === false;
};

export const products: Product[] = [
  {
    id: 'discovery',
    slug: 'fragrance-discovery-workbook',
    title: 'Fragrance Discovery Workbook',
    category: 'Fragrance Discovery',
    subtitle: 'Understand Your Taste. Organize Your Collection. Wear With Intention.',
    shortDescription:
      'A beautiful digital fragrance workbook designed to help you understand your perfume preferences, organize your collection, and build a fragrance wardrobe that feels personal to you.',
    fullDescription:
      'Your perfume collection should feel intentional — not random. The Fragrance Discovery Workbook gives you one beautiful place to explore your fragrance preferences, organize the scents you already own, discover the notes you love, and create a fragrance wardrobe that actually fits your lifestyle. Use it to understand your taste, track your collection, review your perfumes, plan seasonal scents, and make more thoughtful fragrance choices.',
    price: 6.99,
    currency: 'USD',
    format: 'Digital PDF · Printable + digital-friendly',
    features: [
      '✨ Fragrance preference worksheets',
      '📝 Fragrance collection tracker',
      '💎 Favorite notes and notes-to-avoid trackers',
      '📖 Fragrance wardrobe planning',
      '💐 Perfume review pages',
      '🌸 Seasonal and occasion planning',
      '🛍️ Fragrance wishlist and collection audit',
      '🌙 Signature scent discovery',
      '✨ Scent journal pages',
      '📖 30-day scent discovery challenge',
    ],
    howToUse: [
      'Complete secure checkout on Scent Stack.',
      'Download the PDF immediately after payment is verified.',
      'Use it digitally or print the pages you need.',
    ],
    whoFor:
      'Perfume lovers who want to understand their taste, organize what they own, and make more intentional choices.',
    importantNote: 'This is a digital product. No physical perfume or physical product is included.',
    coverImage: '/productImages/pro1/01_HERO_ScentStack.jpg',
    previewImages: [
      '/productImages/pro1/01_HERO_ScentStack.jpg',
      '/productImages/pro1/02_COLLECTION_ScentStack.jpg',
      '/productImages/pro1/03_REVIEW_ScentStack.jpg',
      '/productImages/pro1/04_NOTES_WISHLIST_ScentStack.jpg',
      '/productImages/pro1/05_SAMPLE_AUDIT_ScentStack.jpg',
      '/productImages/pro1/06_WEAR_LOG_ScentStack.jpg',
      '/productImages/pro1/07_WHAT_YOU_GET_ScentStack.jpg',
      '/productImages/pro1/08_LUXURY_LIFESTYLE_ScentStack.jpg',
    ],
    accent: '#4a1c2c',
    seoTitle: 'Fragrance Discovery Workbook | Scent Stack',
    seoDescription:
      'A premium digital fragrance workbook to help you understand your perfume taste, organize your collection, and build a personal fragrance wardrobe.',
    relatedIds: ['collector', 'journal'],
    ctaLabel: 'Get The Workbook',
    previewCtaLabel: 'Preview The Workbook',
    upsellHeadline: 'Take your fragrance journey further ✨',
    upsellMessage:
      'Already know your taste? Explore our collection tracker and journal to go deeper.',
    editableNote: 'Fully editable in Canva (free account) — customize colors, fonts and text to fit your style.',
    fileName: 'prod1.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod1.pdf',
    hostedButtonId: 'QNG7RNTA9NTSE',
  },
  {
    id: 'collector',
    slug: 'fragrance-collection-tracker',
    title: 'The Fragrance Collection Tracker',
    category: 'Collection Management',
    subtitle: 'Perfume Inventory & Scent Organizer',
    shortDescription:
      'Turn your perfume collection into something intentional. Track what you own, organize fragrances by family, identify your most-worn scents, spot gaps and duplicates, manage your wishlist.',
    fullDescription:
      'Your perfume collection should work for you. The Fragrance Collection Tracker helps you turn what you own into something intentional. Track what you own, organize fragrances by family, identify your most-worn scents, spot gaps and duplicates, manage your wishlist, and decide what deserves a place in your collection.',
    price: 8.99,
    currency: 'USD',
    format: 'Digital PDF · Printable + digital-friendly',
    features: [
      '✨ Collection inventory',
      '📊 Collection dashboard',
      '🌸 Fragrance-family breakdown',
      '💎 Favorites tracker',
      '📈 Most-worn tracker',
      '🔍 Duplicate check',
      '📋 Collection audit',
      '🛍️ Wishlist manager',
      '✓ Purchase decision checklist',
      '📖 Collection goals',
    ],
    howToUse: [
      'Complete secure checkout on Scent Stack.',
      'Input your fragrance collection into the tracker.',
      'Review gaps, duplicates, and favorites to guide your purchasing decisions.',
    ],
    whoFor:
      'Perfume collectors who want to organize their collection, identify duplicates, and make intentional purchasing decisions.',
    importantNote: 'This is a digital product. No physical perfume or physical product is included.',
    coverImage: '/productImages/prod2/preview_page_1.png',
    previewImages: [
      '/productImages/prod2/preview_page_1.png',
      '/productImages/prod2/preview_page_3.png',
      '/productImages/prod2/preview_page_4.png',
      '/productImages/prod2/preview_page_8.png',
      '/productImages/prod2/preview_page_11.png',
      '/productImages/prod2/preview_page_16.png',
    ],
    accent: '#5c3d4e',
    seoTitle: 'The Fragrance Collection Tracker | Scent Stack',
    seoDescription:
      'Track and organize your perfume collection. Identify duplicates, spot gaps, and manage your fragrance inventory with this digital collection tracker.',
    relatedIds: ['discovery', 'journal'],
    ctaLabel: 'Get The Tracker',
    previewCtaLabel: 'Preview The Tracker',
    upsellHeadline: 'Complete your fragrance system ✨',
    upsellMessage:
      'Pair your collection tracking with our discovery workbook or journal for a complete system.',
    editableNote: 'Fully editable in Canva (free account) — customize colors, fonts and text to fit your style.',
    fileName: 'prod2.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod2.pdf',
    hostedButtonId: 'BZZK6532YYDYC',
  },
  {
    id: 'journal',
    slug: 'digital-fragrance-journal',
    title: 'Digital Fragrance Journal',
    category: 'Fragrance Reviews',
    subtitle: 'Perfume Reviews, Scent Notes & Wear Log',
    shortDescription:
      'A refined digital journal for documenting fragrance discoveries, first impressions, dry-downs, performance, moods, memories and the scents you reach for most.',
    fullDescription:
      'Document your fragrance journey thoughtfully. The Digital Fragrance Journal is a refined digital journal for recording fragrance discoveries, first impressions, dry-downs, performance, moods, memories and the scents you reach for most. Capture everything you love about each scent so you can make more intentional choices.',
    price: 9.99,
    currency: 'USD',
    format: 'Digital PDF · Designed for digital use & printing',
    features: [
      '✨ Fragrance diary pages',
      '📝 First-impression tracker',
      '⏰ Dry-down reflections',
      '📊 Performance ratings',
      '🌙 Mood & memory pages',
      '📅 Occasion tracker',
      '⚖️ Side-by-side comparison',
      '📋 Monthly wear log',
      '💎 Favorite discoveries',
      '🎯 Scent preference tracking',
    ],
    howToUse: [
      'Complete secure checkout on Scent Stack.',
      'Use the journal to capture your first impressions of each fragrance.',
      'Track performance, moods, and wear occasions to understand your preferences.',
    ],
    whoFor:
      'Fragrance enthusiasts who want to document their scent discoveries and understand their preferences over time.',
    importantNote: 'This is a digital product. No physical perfume or physical product is included.',
    coverImage: '/productImages/prod3/luxury_fragrance_journal_flatlay.jpg',
    previewImages: [
      '/productImages/prod3/luxury_fragrance_journal_flatlay.jpg',
      '/productImages/prod3/journal_preview_page_1.png',
      '/productImages/prod3/journal_preview_page_3.png',
      '/productImages/prod3/journal_preview_page_4.png',
      '/productImages/prod3/journal_preview_page_7.png',
      '/productImages/prod3/journal_preview_page_11.png',
      '/productImages/prod3/journal_preview_page_15.png',
      '/productImages/prod3/journal_preview_page_18.png',
    ],
    accent: '#6b3a3a',
    seoTitle: 'Digital Fragrance Journal | Scent Stack',
    seoDescription:
      'Document your fragrance discoveries with this beautiful digital journal. Track reviews, notes, performance, and moods for every scent.',
    relatedIds: ['discovery', 'collector'],
    ctaLabel: 'Get The Journal',
    previewCtaLabel: 'Preview The Journal',
    upsellHeadline: 'Pair with our collection tracker ✨',
    upsellMessage:
      'Document your scents here, then organize them in the collection tracker for a complete system.',
    editableNote: 'Fully editable in Canva (free account) — customize colors, fonts and text to fit your style.',
    fileName: 'prod3.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod3.pdf',
    hostedButtonId: 'T6JVGXWGLS2HG',
  },
  {
    id: 'printable',
    slug: 'perfume-journal-printable',
    title: 'Perfume Journal Printable',
    category: 'Quick Reference',
    subtitle: 'Scent Review & Fragrance Diary',
    shortDescription:
      'A simple, elegant printable journal for recording the perfumes you discover and wear. Capture notes, impressions, performance, moods, memories and ratings without needing a complicated system.',
    fullDescription:
      'Sometimes you just need a simple way to record your fragrances. The Perfume Journal Printable is an elegant, straightforward journal for documenting the scents you discover. Record notes, impressions, performance, moods, memories and ratings without unnecessary complexity. Perfect for keeping beside your collection.',
    price: 4.99,
    currency: 'USD',
    format: 'A4 Printable PDF',
    features: [
      '✨ Perfume review pages',
      '📝 Notes & accords',
      '⏰ Opening / dry-down',
      '⏱️ Longevity / projection',
      '🌙 Mood & occasion',
      '💎 Favorites section',
      '🛍️ Wishlist pages',
      '🔄 Reusable journal pages',
      '📋 Simple & elegant design',
    ],
    howToUse: [
      'Complete secure checkout on Scent Stack.',
      'Download and print the pages you need.',
      'Record your fragrance discoveries as you try them.',
    ],
    whoFor:
      'Casual fragrance lovers who want a simple, printable way to track their scents without a complex system.',
    importantNote: 'This is a digital product. No physical perfume or physical product is included.',
    coverImage: '/productImages/pro1/01_HERO_ScentStack.jpg',
    previewImages: ['/productImages/pro1/01_HERO_ScentStack.jpg'],
    accent: '#7a5c5c',
    seoTitle: 'Perfume Journal Printable | Scent Stack',
    seoDescription:
      'A simple, elegant printable fragrance journal for recording your scent reviews and discoveries. Perfect for home or on-the-go.',
    relatedIds: ['discovery', 'journal'],
    ctaLabel: 'Get The Printable',
    previewCtaLabel: 'Preview The Printable',
    upsellHeadline: 'Want something more detailed? ✨',
    upsellMessage:
      'Try our Digital Fragrance Journal for more in-depth tracking and organization.',
    editableNote: 'Fully editable in Canva (free account) — customize colors, fonts and text to fit your style.',
    fileName: 'prod4.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod4.pdf',
    hostedButtonId: 'FYLAUZ43PFNSE',
  },
  {
    id: 'signature',
    slug: 'find-your-signature-scent',
    title: 'Find Your Signature Scent',
    category: 'Self-Discovery',
    subtitle: 'The Personal Fragrance Discovery Workbook',
    shortDescription:
      'Discover the fragrance styles, notes and moods that feel most like you. This guided workbook helps you understand your fragrance personality and identify a signature scent.',
    fullDescription:
      'Find the fragrance that feels most like you. Find Your Signature Scent is a guided workbook that helps you discover your fragrance personality, explore your favorite notes and scent families, compare your favorite options, and identify the signature scent that truly fits your personality and lifestyle.',
    price: 9.99,
    currency: 'USD',
    format: 'Digital PDF · Printable + digital-friendly',
    features: [
      '✨ Fragrance personality quiz',
      '📝 Favorite-note discovery',
      '⛔ Notes-to-avoid tracker',
      '🌸 Fragrance family exploration',
      '🏆 Top 5 fragrance candidates',
      '⭐ Signature scent scorecard',
      '⚖️ Top 3 comparison pages',
      '🎯 Signature scent result',
      '📖 Personal fragrance philosophy',
      '💡 Lifestyle & personality alignment',
    ],
    howToUse: [
      'Complete secure checkout on Scent Stack.',
      'Work through the fragrance personality quiz and discovery exercises.',
      'Compare your favorites and identify your perfect signature scent.',
    ],
    whoFor:
      'Perfume lovers seeking to discover or refine their signature scent that matches their personality and lifestyle.',
    importantNote: 'This is a digital product. No physical perfume or physical product is included.',
    coverImage: '/productImages/pro1/01_HERO_ScentStack.jpg',
    previewImages: ['/productImages/pro1/01_HERO_ScentStack.jpg'],
    accent: '#8b5a5a',
    seoTitle: 'Find Your Signature Scent | Scent Stack',
    seoDescription:
      'Discover your signature fragrance through guided discovery workbook. Identify the scent that matches your personality and lifestyle.',
    relatedIds: ['discovery', 'collector'],
    ctaLabel: 'Get The Workbook',
    previewCtaLabel: 'Preview The Workbook',
    upsellHeadline: 'Ready to build your collection? ✨',
    upsellMessage:
      'Once you find your signature scent, use our collection tracker to build a wardrobe around it.',
    editableNote: 'Fully editable in Canva (free account) — customize colors, fonts and text to fit your style.',
    fileName: 'prod5.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod5.pdf',
    hostedButtonId: 'RYBULUXJP5HGG',
  },
  {
    id: 'wardrobe',
    slug: 'fragrance-wardrobe-planner',
    title: 'The Fragrance Wardrobe Planner',
    category: 'Collection Planning',
    subtitle: 'Build Your Perfect Scent Rotation',
    shortDescription:
      'Build a fragrance wardrobe that fits your real life. Organize your scents around everyday wear, work, dates, evenings, seasons, vacations and special occasions.',
    fullDescription:
      'Your fragrance collection should work with your life. The Fragrance Wardrobe Planner helps you organize your perfumes around the moments you actually live — from everyday scents and work fragrances to date nights, vacations, special events, summer rotation, and winter favorites. Instead of buying randomly, use the planner to understand what you already have and identify what your collection may actually need.',
    price: 8.99,
    currency: 'USD',
    format: 'Digital PDF · Printable + digital-friendly',
    features: [
      '✨ Signature scent planner',
      '☀️ Everyday fragrance section',
      '💼 Work / professional planning',
      '🌙 Date night planning',
      '✨ Evening / special events',
      '🌸 Spring & summer rotation',
      '🍂 Autumn & winter rotation',
      '✈️ Vacation & travel guide',
      '💎 7-fragrance capsule planner',
      '📊 Collection gaps analysis',
      '📅 Rotation planner',
      '📋 Wardrobe overview pages',
    ],
    howToUse: [
      'Complete secure checkout on Scent Stack.',
      'Map the occasions, seasons, and moods your collection needs to support.',
      'Use the gap analysis before buying so every new scent has a purpose.',
    ],
    whoFor:
      'Perfume lovers who want their collection to match their everyday life, seasons, moods, and occasions.',
    importantNote: 'This is a digital product. No physical perfume or physical product is included.',
    coverImage: '/productImages/pro1/01_HERO_ScentStack.jpg',
    previewImages: ['/productImages/pro1/01_HERO_ScentStack.jpg'],
    accent: '#6b4b2a',
    seoTitle: 'The Fragrance Wardrobe Planner | Scent Stack',
    seoDescription:
      'Plan your fragrance collection around seasons, moods and occasions with the Scent Stack digital fragrance wardrobe planner.',
    relatedIds: ['discovery', 'collector'],
    ctaLabel: 'Get The Planner',
    previewCtaLabel: 'Preview The Planner',
    upsellHeadline: 'Build your complete fragrance system ✨',
    upsellMessage:
      'Combine with our discovery workbook and collection tracker for a complete fragrance management system.',
    editableNote: 'Fully editable in Canva (free account) — customize colors, fonts and text to fit your style.',
    fileName: 'prod6.pdf',
    storageBucket: 'digital-products',
    storagePath: 'prod6.pdf',
    hostedButtonId: 'FW7KUV85MFFSJ',
  },
];

export const bundle = {
  id: 'bundle',
  name: 'Build Your Complete Scent Stack',
  price: 39.99,
  originalPrice: 48.94,
  saving: 8.95,
  description: 'Six premium fragrance tools. One complete system.',
  productIds: ['discovery', 'collector', 'journal', 'printable', 'signature', 'wardrobe'],
  hostedButtonId: 'FYLAUZ43PFNSE',
};

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductBySlugOrId = (value: string) => getProduct(value) ?? getProductById(value);
