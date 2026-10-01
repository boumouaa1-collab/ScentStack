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
  { id: 'a1', displayName: 'Noura', location: 'Riyadh', productId: 'discovery', productLabel: 'the Fragrance Discovery Workbook' },
  { id: 'a2', displayName: 'James', location: 'Dubai', productId: 'collector', productLabel: 'the Fragrance Collection Tracker' },
  { id: 'a3', displayName: 'Layla', location: 'London', productId: 'signature', productLabel: 'Find Your Signature Scent' },
  { id: 'a4', displayName: 'Ethan', location: 'Toronto', productId: 'wardrobe', productLabel: 'the Fragrance Wardrobe Planner' },
  { id: 'a5', displayName: 'Fatima', location: 'Jeddah', productId: 'journal', productLabel: 'the Digital Fragrance Journal' },
  { id: 'a6', displayName: 'Sarah', location: 'New York', productId: 'bundle', productLabel: 'the full bundle' },
  { id: 'a7', displayName: 'Omar', location: 'Casablanca', productId: 'printable', productLabel: 'the Perfume Journal Printable' },
  { id: 'a8', displayName: 'Mia', location: 'Paris', productId: 'discovery', productLabel: 'the Fragrance Discovery Workbook' },
  { id: 'a9', displayName: 'Yousef', location: 'Doha', productId: 'signature', productLabel: 'Find Your Signature Scent' },
  { id: 'a10', displayName: 'Emma', location: 'Sydney', productId: 'collector', productLabel: 'the Fragrance Collection Tracker' },
  { id: 'a11', displayName: 'Khalid', location: 'Kuwait City', productId: 'bundle', productLabel: 'the full bundle' },
  { id: 'a12', displayName: 'Sophie', location: 'Amsterdam', productId: 'wardrobe', productLabel: 'the Fragrance Wardrobe Planner' },
];

export const testimonials: Testimonial[] = [];
