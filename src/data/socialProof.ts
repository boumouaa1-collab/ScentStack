export type ActivityItem = {
  id: string;
  displayName: string;
  location: string;
  productId: string;
  productLabel: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  displayName: string;
  productLabel: string;
};

export const activityItems: ActivityItem[] = [
  { id: 'a1', displayName: 'Someone', location: 'Riyadh', productId: 'discovery', productLabel: 'the Fragrance Discovery Workbook' },
  { id: 'a2', displayName: 'Someone', location: 'Dubai', productId: 'collector', productLabel: 'the Fragrance Collection Tracker' },
  { id: 'a3', displayName: 'Someone', location: 'London', productId: 'signature', productLabel: 'Find Your Signature Scent' },
  { id: 'a4', displayName: 'Someone', location: 'Toronto', productId: 'wardrobe', productLabel: 'the Fragrance Wardrobe Planner' },
  { id: 'a5', displayName: 'Someone', location: 'Jeddah', productId: 'journal', productLabel: 'the Digital Fragrance Journal' },
  { id: 'a6', displayName: 'Someone', location: 'New York', productId: 'bundle', productLabel: 'the full bundle' },
];

export const testimonials: Testimonial[] = [];
