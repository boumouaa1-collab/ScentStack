import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { bundle, testProduct, getProductBySlugOrId, products, type Product } from '@/data/products';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useCart } from '@/lib/cartContext';

const PAYPAL_SCRIPT_URL = 'https://www.paypal.com/sdk/js';
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CheckoutState = 'idle' | 'loading' | 'processing' | 'success' | 'error';

type PaypalButtonsConfig = {
  style?: Record<string, string>;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
};

type PaypalButtonsWindow = Window & {
  paypal?: {
    Buttons: (config: PaypalButtonsConfig) => { render: (selector: string) => Promise<void> | void };
  };
};

type CheckoutPageProps = {
  onNavigate: (page: string) => void;
};

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const params = new URLSearchParams(window.location.search);
  const requestedProductId = params.get('product') || 'workbook';
  const isCartMode = requestedProductId === 'cart';

  const { items: cartItemIds, clearCart } = useCart();

  const cartProducts: Product[] = useMemo(
    () => cartItemIds.map((id) => getProductBySlugOrId(id)).filter(Boolean) as Product[],
    [cartItemIds]
  );

  const selectedProduct = useMemo(() => {
    if (isCartMode) return null;
    if (requestedProductId === bundle.id) {
      return {
        ...products[0],
        id: bundle.id,
        title: bundle.name,
        price: bundle.price,
        format: 'Six digital PDFs',
      };
    }
    if (requestedProductId === testProduct.id) {
      return testProduct;
    }

    const product = getProductBySlugOrId(requestedProductId);
    return product ?? products[0];
  }, [requestedProductId, isCartMode]);

  // What this checkout is actually charging for — one product, or the whole cart.
  const lineItems = isCartMode
    ? cartProducts.map((p) => ({ title: p.title, price: p.price }))
    : selectedProduct
      ? [{ title: selectedProduct.title, price: Number(selectedProduct.price) }]
      : [];
  const totalPrice = lineItems.reduce((sum, item) => sum + Number(item.price), 0);
  const cartIsEmpty = isCartMode && cartProducts.length === 0;

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const emailValid = EMAIL_RE.test(email.trim());

  const [status, setStatus] = useState<CheckoutState>('idle');
  const [message, setMessage] = useState<string>('Enter your email to unlock secure checkout. 📩');
  const [paypalReady, setPaypalReady] = useState(false);

  useDocumentMeta(
    isCartMode ? 'Checkout — Your Cart | Scent Stack' : `Checkout — ${selectedProduct?.title} | Scent Stack`,
    isCartMode
      ? 'Secure PayPal checkout for your Scent Stack cart. Instant, email-delivered digital downloads.'
      : `Secure PayPal checkout for ${selectedProduct?.title}. Instant, email-delivered digital download.`
  );

  // Load the PayPal SDK once (Smart Buttons — no per-product setup needed in PayPal).
  useEffect(() => {
    const scriptId = 'paypal-sdk-script';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as PaypalButtonsWindow).paypal?.Buttons) {
        setPaypalReady(true);
      } else {
        existingScript.addEventListener('load', () => setPaypalReady(true));
      }
      return;
    }

    if (!PAYPAL_CLIENT_ID) {
      setStatus('error');
      setMessage('⚠️ Checkout is not configured yet (missing PayPal client ID).');
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `${PAYPAL_SCRIPT_URL}?client-id=${encodeURIComponent(PAYPAL_CLIENT_ID)}&components=buttons&disable-funding=venmo&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setPaypalReady(true);
    script.onerror = () => {
      setStatus('error');
      setMessage('⚠️ The PayPal checkout script could not load. Please refresh and try again.');
    };
    document.body.appendChild(script);
  }, []);

  // Render the Smart Button once we have a ready SDK, something to buy, and a valid email.
  useEffect(() => {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    container.innerHTML = '';

    if (!paypalReady || cartIsEmpty || lineItems.length === 0) return;
    if (!emailValid) {
      setMessage(emailTouched ? '⚠️ Enter a valid email — that\u2019s where your download goes.' : 'Enter your email to unlock secure checkout. 📩');
      return;
    }

    const paypalWindow = window as PaypalButtonsWindow;
    if (!paypalWindow.paypal?.Buttons) return;

    setStatus('idle');
    setMessage('Complete payment with PayPal to get your download instantly. ✨');

    const orderBody = isCartMode
      ? { productIds: cartProducts.map((p) => p.id), customerEmail: email.trim() }
      : { productId: selectedProduct!.id, customerEmail: email.trim() };

    const buttons = paypalWindow.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay' },
      createOrder: async () => {
        setStatus('loading');
        setMessage('Setting up your secure order...');
        const response = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderBody),
        });
        const data = await response.json();
        if (!response.ok || !data.id) {
          throw new Error(data.message || 'Could not start checkout.');
        }
        return data.id as string;
      },
      onApprove: async (data) => {
        setStatus('processing');
        setMessage('Confirming your payment...');
        try {
          const response = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID, ...orderBody }),
          });
          const result = await response.json();
          if (!response.ok || !result.ok) {
            setStatus('error');
            setMessage(result.message || '⚠️ Payment could not be confirmed. Contact support and we\u2019ll sort it out.');
            return;
          }
          setStatus('success');
          if (isCartMode) {
            clearCart();
            onNavigate('thankyou-cart');
          } else {
            onNavigate(requestedProductId === bundle.id ? 'thankyou-bundle' : `thankyou-${selectedProduct!.id}`);
          }
        } catch {
          setStatus('error');
          setMessage('⚠️ Payment could not be confirmed. Contact support and we\u2019ll sort it out.');
        }
      },
      onCancel: () => {
        setStatus('idle');
        setMessage('Checkout canceled — you can try again anytime.');
      },
      onError: () => {
        setStatus('error');
        setMessage('⚠️ Something went wrong with PayPal. Please try again or contact support.');
      },
    });

    buttons.render('#paypal-button-container');

    return () => {
      container.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paypalReady, emailValid, isCartMode, cartIsEmpty, cartProducts, selectedProduct]);

  if (cartIsEmpty) {
    return (
      <div className="fade-in flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f1e8] px-6 pt-24 pb-16 text-center">
        <h1 className="font-serif-display text-3xl text-burgundy">Your cart is empty</h1>
        <p className="text-sm text-charcoal/60">Add a few things you like, then come back here to check out together.</p>
        <button onClick={() => onNavigate('shop')} className="btn-primary mt-2">
          Browse the shop
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <button
          onClick={() => onNavigate(isCartMode ? 'shop' : selectedProduct!.id === bundle.id ? 'bundle' : `product-${selectedProduct!.slug}`)}
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 transition-colors hover:text-burgundy"
        >
          <ArrowLeft size={15} />
          {isCartMode ? 'Back to shop' : 'Back to product'}
        </button>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <aside className="rounded-[32px] border border-[#b08d57]/20 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow mb-2">Your order</p>
                <h1 className="font-serif-display text-4xl text-burgundy">
                  {isCartMode ? `${cartProducts.length} ${cartProducts.length === 1 ? 'item' : 'items'}` : selectedProduct!.title}
                </h1>
              </div>
              <div className="rounded-full bg-[#efe4d4] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-burgundy">
                USD
              </div>
            </div>

            {isCartMode ? (
              <div className="mt-6 space-y-3">
                {cartProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/40 p-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl" style={{ background: p.accent }}>
                      <img src={p.coverImage} alt={`${p.title} cover`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">{p.title}</p>
                      <p className="text-xs text-charcoal/50">Digital PDF</p>
                    </div>
                    <span className="font-serif-display text-xl text-burgundy">${p.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/60 p-4">
                <div className="flex justify-center rounded-xl p-4" style={{ background: selectedProduct!.accent }}>
                  <img
                    src={selectedProduct!.coverImage}
                    alt={`${selectedProduct!.title} cover`}
                    className="max-h-[260px] w-auto rounded-sm object-contain shadow-xl"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4 text-sm text-charcoal/75">
              <div className="flex items-center justify-between border-b border-[#b08d57]/15 pb-3">
                <span>Format</span>
                <span>Digital PDF</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#b08d57]/15 pb-3">
                <span>Delivery</span>
                <span>Instant, by email 📩</span>
              </div>
              <div className="flex items-center justify-between pt-3 text-base font-medium text-charcoal">
                <span>Total</span>
                <span className="font-serif-display text-3xl font-bold tabular-nums text-burgundy">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#b08d57]/15 bg-[#f7f1e8] p-4 text-sm leading-relaxed text-charcoal/75">
              <div className="flex items-center gap-2 text-burgundy">
                <ShieldCheck size={16} className="text-gold" />
                Secure by design
              </div>
              <p className="mt-2">
                We never host your PDFs publicly. Private download links are generated only after PayPal
                confirms your payment, sent straight to the email you enter below.
              </p>
            </div>
          </aside>

          <section className="rounded-[32px] border border-[#b08d57]/20 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-eyebrow mb-2">Checkout</p>
                <h2 className="font-serif-display text-3xl text-burgundy">Order Summary</h2>
              </div>
              <div className="rounded-full bg-[#efe4d4] px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
                USD
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-[#f7f1e8] p-5">
              {lineItems.map((item) => (
                <div key={item.title} className="flex items-center justify-between text-sm text-charcoal/70">
                  <span className="truncate pr-4">{item.title}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-charcoal">${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-[#b08d57]/15 pt-4 text-base font-medium text-charcoal">
                <span>Total</span>
                <span className="font-serif-display text-3xl font-bold tabular-nums text-burgundy">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="checkout-email" className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-charcoal/60">
                <Mail size={13} className="text-gold" />
                Email for your download
              </label>
              <input
                id="checkout-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#b08d57]/25 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-burgundy"
              />
              <p className="mt-2 text-xs text-charcoal/50">
                Your download link{lineItems.length > 1 ? 's are' : ' is'} sent to this exact address — double-check it before paying.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/40 p-4">
              {status === 'error' ? (
                <p className="text-sm text-red-700">{message}</p>
              ) : (
                <p className="text-sm text-charcoal/80">{message}</p>
              )}
            </div>

            <div className="mt-6">
              <div id="paypal-button-container" className="min-h-[220px]" />
              {!emailValid && (
                <p className="mt-3 text-center text-xs text-charcoal/50">
                  The PayPal button appears once your email above is valid.
                </p>
              )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal/50">
              <Lock size={13} className="text-gold" />
              Secure payment through PayPal
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-charcoal/60">
              <Sparkles size={15} className="text-gold" />
              Instant delivery — no account needed
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
