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
  { id: 'a1', displayName: 'Olivia', location: 'Austin', productId: 'discovery', productLabel: 'the Fragrance Discovery Workbook' },
  { id: 'a2', displayName: 'James', location: 'Manchester', productId: 'collector', productLabel: 'the Fragrance Collection Tracker' },
  { id: 'a3', displayName: 'Layla', location: 'London', productId: 'signature', productLabel: 'Find Your Signature Scent' },
  { id: 'a4', displayName: 'Ethan', location: 'Chicago', productId: 'wardrobe', productLabel: 'the Fragrance Wardrobe Planner' },
  { id: 'a5', displayName: 'Grace', location: 'Leeds', productId: 'journal', productLabel: 'the Digital Fragrance Journal' },
  { id: 'a6', displayName: 'Sarah', location: 'New York', productId: 'bundle', productLabel: 'the full bundle' },
  { id: 'a7', displayName: 'Jack', location: 'Bristol', productId: 'printable', productLabel: 'the Perfume Journal Printable' },
  { id: 'a8', displayName: 'Mia', location: 'Seattle', productId: 'discovery', productLabel: 'the Fragrance Discovery Workbook' },
  { id: 'a9', displayName: 'Daniel', location: 'Edinburgh', productId: 'signature', productLabel: 'Find Your Signature Scent' },
  { id: 'a10', displayName: 'Emma', location: 'Denver', productId: 'collector', productLabel: 'the Fragrance Collection Tracker' },
  { id: 'a11', displayName: 'Henry', location: 'Birmingham', productId: 'bundle', productLabel: 'the full bundle' },
  { id: 'a12', displayName: 'Sophie', location: 'Glasgow', productId: 'wardrobe', productLabel: 'the Fragrance Wardrobe Planner' },
];

export const testimonials: Testimonial[] = [];