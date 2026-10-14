import { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const BundlePage = lazy(() => import('@/pages/BundlePage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const ThankYouPage = lazy(() => import('@/pages/ThankYouPage'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage'));
import { products, getProduct, siteConfig, testProduct } from '@/data/products';
import { pathForPage, pageForPath } from '@/lib/router';
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const SupportButton = lazy(() => import('@/components/SupportButton'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostRoute = lazy(() => import('@/pages/BlogPostRoute'));
import { CartProvider } from '@/lib/cartContext';
import CartBar from '@/components/CartBar';

function App() {
  const [page, setPage] = useState(() => pageForPath(window.location.pathname + window.location.search, products));

  useEffect(() => {
    let offlineTimer: ReturnType<typeof setTimeout> | undefined;
    const onOffline = () => {
      // Only show the offline screen if we're still offline 3s later — avoids
      // false positives from brief network blips or a flaky first check.
      offlineTimer = setTimeout(() => {
        if (!navigator.onLine) setPage('offline');
      }, 3000);
    };
    const onOnline = () => {
      clearTimeout(offlineTimer);
      setPage((current) =>
        current === 'offline' ? pageForPath(window.location.pathname + window.location.search, products) : current
      );
    };
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      clearTimeout(offlineTimer);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  const navigate = (target: string) => {
    const path = pathForPage(target);
    const nextLocation = window.location.pathname + window.location.search;
    if (path !== nextLocation) {
      window.history.pushState({}, '', path);
    }
    setPage(target.startsWith('checkout:') ? 'checkout' : target.startsWith('thankyou-') ? target : pageForPath(path, products));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => setPage(pageForPath(window.location.pathname + window.location.search, products));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const href = `${siteConfig.siteUrl}${pathForPage(page)}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = href;
  }, [page]);

  const render = () => {
    if (page === 'home') return <Home products={products} onNavigate={navigate} />;
    if (page === 'shop') return <ShopPage onNavigate={navigate} />;
    if (page === 'checkout') return <CheckoutPage onNavigate={navigate} />;
    if (page === 'success') return <SuccessPage onNavigate={navigate} />;
    if (page === 'privacy' || page === 'terms' || page === 'refund-policy') {
      return <LegalPage page={page} onNavigate={navigate} />;
    }
    if (page === 'about') return <AboutPage onNavigate={navigate} />;
    if (page === 'faq') return <FAQPage onNavigate={navigate} />;
    if (page === 'contact') return <ContactPage onNavigate={navigate} />;
    if (page === 'bundle') return <BundlePage onNavigate={navigate} />;
    if (page === 'blog') return <BlogPage onNavigate={navigate} />;
    if (page.startsWith('blog-')) {
      return <BlogPostRoute slug={page.replace('blog-', '')} onNavigate={navigate} />;
    }
    if (page === 'not-found') return <ErrorPage status="404" onNavigate={navigate} />;
    if (page === 'forbidden') return <ErrorPage status="403" onNavigate={navigate} />;
    if (page === 'offline') return <ErrorPage status="offline" onNavigate={navigate} />;

    if (page.startsWith('product-')) {
      const slug = page.replace('product-', '');
      const product = getProduct(slug);
      if (product) return <ProductPage product={product} onNavigate={navigate} />;
    }

    if (page.startsWith('thankyou-')) {
      const itemId = page.replace('thankyou-', '');
      if (itemId === 'bundle' || itemId === testProduct.id || itemId === 'cart' || products.find((p) => p.id === itemId))
        return <ThankYouPage itemId={itemId} onNavigate={navigate} />;
    }

    if (page === 'thank-you') return <ThankYouPage itemId="workbook" onNavigate={navigate} />;

    return <Home products={products} onNavigate={navigate} />;
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#f7f1e8]">
        <Navbar onNavigate={navigate} currentPage={page} />
        {/* The footer sits inside the same boundary as the page, so it never jumps down while a page loads. */}
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <main>{render()}</main>
          <Footer onNavigate={navigate} />
        </Suspense>
        <Suspense fallback={null}>
          <SupportButton />
        </Suspense>
        <CartBar onNavigate={navigate} />
      </div>
    </CartProvider>
  );
}

export default App;
