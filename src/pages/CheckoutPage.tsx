import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { bundle, getProductBySlugOrId, products } from '@/data/products';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const PAYPAL_SCRIPT_URL = 'https://www.paypal.com/sdk/js';
const PAYPAL_HOSTED_BUTTON_CLIENT_ID =
  'BAAg-jO_JNg1HzhkNEGfrR2ietydO1PouqpAxdU2QPg2XeCbIGTdatfcyhajgmea_6mnH8hiJbZUgWmAd4';

type CheckoutState = 'idle' | 'loading' | 'processing' | 'success' | 'error';
type PaypalHostedButtons = {
  HostedButtons: (options: { hostedButtonId: string }) => {
    render: (selector: string) => unknown;
  };
};

type PaypalWindow = Window & { paypal?: PaypalHostedButtons };

type CheckoutPageProps = {
  onNavigate: (page: string) => void;
};

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const params = new URLSearchParams(window.location.search);
  const requestedProductId = params.get('product') || 'workbook';
  const selectedProduct = useMemo(() => {
    if (requestedProductId === bundle.id) {
      return {
        ...products[0],
        id: bundle.id,
        title: bundle.name,
        price: bundle.price,
        format: 'Three digital PDFs',
        hostedButtonId: bundle.hostedButtonId,
      };
    }

    const product = getProductBySlugOrId(requestedProductId);
    return product ?? products[0];
  }, [requestedProductId]);

  const [status, setStatus] = useState<CheckoutState>('idle');
  const [message, setMessage] = useState<string>('');
  const [paypalReady, setPaypalReady] = useState(false);

  useDocumentMeta('Checkout | Scent Stack', 'Secure PayPal checkout for the Scent Stack digital PDF products.');

  useEffect(() => {
    const scriptId = 'paypal-sdk-script';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as PaypalWindow).paypal) {
        setPaypalReady(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `${PAYPAL_SCRIPT_URL}?client-id=${encodeURIComponent(PAYPAL_HOSTED_BUTTON_CLIENT_ID)}&components=hosted-buttons&disable-funding=venmo&currency=USD`;
    script.async = true;
    script.onload = () => {
      setPaypalReady(true);
    };
    script.onerror = () => {
      setStatus('error');
      setMessage('The PayPal checkout script could not load. Please try again in a moment.');
    };
    document.body.appendChild(script);

    return () => {
      const container = document.getElementById('paypal-button-container');
      if (container) container.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    if (!paypalReady || !selectedProduct) return;
    const paypalWindow = window as PaypalWindow;
    if (!paypalWindow.paypal?.HostedButtons) return;

    setStatus('loading');
    setMessage('Loading secure PayPal checkout...');
    const renderResult = paypalWindow.paypal
      .HostedButtons({ hostedButtonId: selectedProduct.hostedButtonId })
      .render('#paypal-button-container');

    Promise.resolve(renderResult)
      .then(() => {
        setStatus('idle');
        setMessage('Complete payment with PayPal to receive your digital product.');
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong while setting up PayPal. Please try again or contact support.');
      });

    return () => {
      const container = document.getElementById('paypal-button-container');
      if (container) container.innerHTML = '';
    };
  }, [selectedProduct, paypalReady]);

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <button
          onClick={() => onNavigate(selectedProduct.id === bundle.id ? 'bundle' : `product-${selectedProduct.slug}`)}
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 transition-colors hover:text-burgundy"
        >
          <ArrowLeft size={15} />
          Back to product
        </button>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <aside className="rounded-[32px] border border-[#b08d57]/20 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow mb-2">Your order</p>
                <h1 className="font-serif-display text-4xl text-burgundy">{selectedProduct.title}</h1>
              </div>
              <div className="rounded-full bg-[#efe4d4] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-burgundy">
                {selectedProduct.currency}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/60 p-4">
              <div className="flex justify-center rounded-xl p-4" style={{ background: selectedProduct.accent }}>
                <img
                  src={selectedProduct.coverImage}
                  alt={`${selectedProduct.title} cover`}
                  className="max-h-[260px] w-auto rounded-sm object-contain shadow-xl"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-charcoal/75">
              <div className="flex items-center justify-between border-b border-[#b08d57]/15 pb-3">
                <span>Product</span>
                <span className="font-medium text-burgundy">{selectedProduct.title}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#b08d57]/15 pb-3">
                <span>Format</span>
                <span>Digital PDF</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#b08d57]/15 pb-3">
                <span>Delivery</span>
                <span>Instant</span>
              </div>
              <div className="flex items-center justify-between pt-3 text-base font-medium text-charcoal">
                <span>Price</span>
                <span className="font-serif-display text-3xl text-burgundy">${selectedProduct.price}</span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#b08d57]/15 bg-[#f7f1e8] p-4 text-sm leading-relaxed text-charcoal/75">
              <div className="flex items-center gap-2 text-burgundy">
                <ShieldCheck size={16} className="text-gold" />
                Secure checkout
              </div>
              <p className="mt-2">Your PDF is delivered only after a verified PayPal capture completes, and the download is generated securely on our server.</p>
            </div>
          </aside>

          <section className="rounded-[32px] border border-[#b08d57]/20 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-eyebrow mb-2">Checkout</p>
                <h2 className="font-serif-display text-3xl text-burgundy">Order Summary</h2>
              </div>
              <div className="rounded-full bg-[#efe4d4] px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
                {selectedProduct.price === 9 ? 'USD' : 'USD'}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl bg-[#f7f1e8] p-5">
              <div className="flex items-center justify-between text-sm text-charcoal/70">
                <span>{selectedProduct.title}</span>
                <span className="font-medium text-charcoal">${selectedProduct.price}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#b08d57]/15 pt-4 text-base font-medium text-charcoal">
                <span>Total</span>
                <span className="font-serif-display text-3xl text-burgundy">${selectedProduct.price}.00</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/40 p-4">
              {status === 'error' && (
                <p className="text-sm text-red-700">{message}</p>
              )}
              {status === 'loading' && (
                <p className="text-sm text-charcoal/80">{message}</p>
              )}
              {status !== 'error' && message && <p className="text-sm text-charcoal/80">{message}</p>}
            </div>

            <div className="mt-6">
              <div id="paypal-button-container" className="min-h-[220px]" />
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal/50">
              <Lock size={13} className="text-gold" />
              Secure payment through PayPal
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-charcoal/60">
              <Sparkles size={15} className="text-gold" />
              Instant digital delivery after successful payment
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
