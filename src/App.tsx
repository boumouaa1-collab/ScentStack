import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import BundlePage from '@/pages/BundlePage';
import CheckoutPage from '@/pages/CheckoutPage';
import ThankYouPage from '@/pages/ThankYouPage';
import SuccessPage from '@/pages/SuccessPage';
import { products, getProduct, siteConfig, testProduct } from '@/data/products';
import { pathForPage, pageForPath } from '@/lib/router';
import LegalPage from '@/pages/LegalPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import FAQPage from '@/pages/FAQPage';
import SupportButton from '@/components/SupportButton';
import ErrorPage from '@/pages/ErrorPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import { getBlogPost } from '@/data/blog';

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
      const slug = page.replace('blog-', '');
      const post = getBlogPost(slug);
      if (post) return <BlogPostPage post={post} onNavigate={navigate} />;
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
      if (itemId === 'bundle' || itemId === testProduct.id || products.find((p) => p.id === itemId))
        return <ThankYouPage itemId={itemId} onNavigate={navigate} />;
    }

    if (page === 'thank-you') return <ThankYouPage itemId="workbook" onNavigate={navigate} />;

    return <Home products={products} onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#f7f1e8]">
      <Navbar onNavigate={navigate} currentPage={page} />
      <main>{render()}</main>
      <Footer onNavigate={navigate} />
      <SupportButton />
    </div>
  );
}

export default App;
