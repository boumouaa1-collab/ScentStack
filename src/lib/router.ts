import type { Product } from '@/data/products';
import { getBlogPost } from '@/data/blog';

export function pathForPage(page: string): string {
  if (page === 'home') return '/';
  if (page === 'shop') return '/shop';
  if (page === 'checkout') return '/checkout';
  if (page === 'success') return '/success';
  if (page === 'privacy') return '/privacy';
  if (page === 'terms') return '/terms';
  if (page === 'refund-policy') return '/refund-policy';
  if (page === 'about') return '/about';
  if (page === 'faq') return '/faq';
  if (page === 'contact') return '/contact';
  if (page === 'bundle') return '/bundle';
  if (page === 'blog') return '/blog';
  if (page.startsWith('blog-')) return `/blog/${page.replace('blog-', '')}`;
  if (page === 'not-found') return '/404';
  if (page === 'forbidden') return '/403';
  if (page === 'offline') return '/offline';
  if (page.startsWith('checkout:')) {
    const productId = page.replace('checkout:', '').trim();
    return `/checkout?product=${encodeURIComponent(productId)}`;
  }
  if (page.startsWith('product-')) return `/products/${page.replace('product-', '')}`;
  if (page.startsWith('thankyou-')) return `/thank-you?product=${encodeURIComponent(page.replace('thankyou-', ''))}`;
  return '/';
}

export function pageForPath(pathname: string, products: Product[]): string {
  const [path, query = ''] = pathname.split('?');
  const clean = path.replace(/\/$/, '') || '/';
  const params = new URLSearchParams(query);

  if (clean === '/') return 'home';
  if (clean === '/shop') return 'shop';
  if (clean === '/checkout') return 'checkout';
  if (clean === '/success') return 'success';
  if (clean === '/privacy') return 'privacy';
  if (clean === '/terms') return 'terms';
  if (clean === '/refund-policy') return 'refund-policy';
  if (clean === '/about') return 'about';
  if (clean === '/faq') return 'faq';
  if (clean === '/contact') return 'contact';
  if (clean === '/bundle') return 'bundle';
  if (clean === '/blog') return 'blog';
  if (clean === '/404') return 'not-found';
  if (clean === '/403') return 'forbidden';
  if (clean === '/offline') return 'offline';

  const productMatch = clean.match(/^\/products\/([a-z0-9-]+)$/);
  if (productMatch) {
    const slug = productMatch[1];
    if (products.some((p) => p.slug === slug)) return `product-${slug}`;
  }

  const blogMatch = clean.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    if (getBlogPost(slug)) return `blog-${slug}`;
  }

  if (clean === '/thank-you') {
    const product = params.get('product');
    if (product === 'bundle') return 'thankyou-bundle';
    if (product === 'livetest') return 'thankyou-livetest';
    if (product === 'cart') return 'thankyou-cart';
    if (product) {
      const productRecord = products.find((p) => p.id === product || p.slug === product);
      if (productRecord) return `thankyou-${productRecord.id}`;
    }
    return 'thank-you';
  }

  return 'not-found';
}
