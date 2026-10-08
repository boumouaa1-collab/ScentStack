import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck, Sparkles, X } from 'lucide-react';
import { bundle, testProduct, getProductBySlugOrId, products, type Product } from '@/data/products';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { outOfStock, stockMessage } from '@/lib/stock';
import { STRICT_EMAIL_RE, suggestEmailFix, maskEmail } from '@/lib/emailCheck';
import { useCart } from '@/lib/cartContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const PAYPAL_SCRIPT_URL = 'https://www.paypal.com/sdk/js';
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

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

  // Bundle and the $1 live-test product are fixed-price, stand-alone purchases —
  // they never merge with the cart. Everything else does.
  const isBundleMode = requestedProductId === bundle.id;
  const isTestMode = requestedProductId === testProduct.id;
  const isSpecialMode = isBundleMode || isTestMode;

  const { items: cartItemIds, addItem, removeItem, clearCart } = useCart();

  // Visiting a product's checkout link (?product=<id>) folds that product into the
  // cart instead of charging for it in isolation — so if you already had other
  // items picked, "Get [Product]" adds to what you're buying rather than replacing it.
  useEffect(() => {
    if (isSpecialMode || requestedProductId === 'cart' || outOfStock) return;
    const match = getProductBySlugOrId(requestedProductId);
    if (match) addItem(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedProductId, isSpecialMode]);

  const cartProducts: Product[] = useMemo(
    () => cartItemIds.map((id) => getProductBySlugOrId(id)).filter(Boolean) as Product[],
    [cartItemIds]
  );

  const selectedProduct = useMemo(() => {
    if (isBundleMode) {
      return {
        ...products[0],
        id: bundle.id,
        title: bundle.name,
        price: bundle.price,
        format: 'Six digital PDFs',
      };
    }
    if (isTestMode) return testProduct;
    return null;
  }, [isBundleMode, isTestMode]);

  const lineItems = isSpecialMode
    ? [{ title: selectedProduct!.title, price: Number(selectedProduct!.price) }]
    : cartProducts.map((p) => ({ title: p.title, price: Number(p.price) }));
  const totalPrice = lineItems.reduce((sum, item) => sum + Number(item.price), 0);
  const cartIsEmpty = !isSpecialMode && cartProducts.length === 0;

  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  // The download goes to this exact address, so it must be well-formed, free of common typos
  // (like "gmail.c") and typed twice the same way before the PayPal button appears.
  const emailFix = suggestEmailFix(email);
  const emailsMatch = email.trim().toLowerCase() === emailConfirm.trim().toLowerCase();
  const emailLooksOk = STRICT_EMAIL_RE.test(email.trim()) && !emailFix && emailsMatch;
  // The server also confirms the address can really receive mail (its domain has a mail server).
  const [emailCheck, setEmailCheck] = useState<{ email: string; ok: boolean; message?: string } | null>(null);
  const emailKey = email.trim().toLowerCase();
  const emailChecked = emailCheck?.email === emailKey;
  const checkingEmail = emailLooksOk && !emailChecked;
  const emailValid = emailLooksOk && emailChecked && Boolean(emailCheck?.ok);

  useEffect(() => {
    if (!emailLooksOk || emailChecked) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailKey }),
        });
        const result = await response.json();
        if (!cancelled) setEmailCheck({ email: emailKey, ok: Boolean(result.ok), message: result.message });
      } catch {
        // Network hiccup: let them continue — the server checks again before any payment starts.
        if (!cancelled) setEmailCheck({ email: emailKey, ok: true });
      }
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [emailKey, emailLooksOk, emailChecked]);
  // Real products are not for sale while the shop is marked out of stock (the $1 test always is).
  const blocked = outOfStock && !isTestMode;

  const [status, setStatus] = useState<CheckoutState>('idle');
  const [message, setMessage] = useState<string>('Enter your email to unlock secure checkout. 📩');
  const [paypalReady, setPaypalReady] = useState(false);

  const headlineTitle = isSpecialMode
    ? selectedProduct!.title
    : cartProducts.length === 1
      ? cartProducts[0].title
      : `${cartProducts.length} items`;

  useDocumentMeta(
    `Checkout — ${headlineTitle} | Scent Stack`,
    `Secure PayPal checkout for ${headlineTitle}. Instant, email-delivered digital download${lineItems.length > 1 ? 's' : ''}.`
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

    if (blocked || !paypalReady || cartIsEmpty || lineItems.length === 0) return;
    if (!emailValid) {
      setMessage(emailTouched ? '⚠️ Enter your email twice, exactly the same — that\u2019s where your download goes.' : 'Enter your email to unlock secure checkout. 📩');
      return;
    }

    const paypalWindow = window as PaypalButtonsWindow;
    if (!paypalWindow.paypal?.Buttons) return;

    setStatus('idle');
    setMessage('Complete payment with PayPal to get your download instantly. ✨');

    const orderBody = isSpecialMode
      ? { productId: selectedProduct!.id, customerEmail: email.trim() }
      : { productIds: cartProducts.map((p) => p.id), customerEmail: email.trim() };

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
          try {
            sessionStorage.setItem(
              'scentstack_last_order',
              JSON.stringify({ orderId: data.orderID, emailSent: Boolean(result.emailSent), sentTo: result.sentTo || [] })
            );
          } catch {
            // Storage unavailable — the thank-you page just shows its generic message.
          }
          if (isSpecialMode) {
            onNavigate(isBundleMode ? 'thankyou-bundle' : `thankyou-${selectedProduct!.id}`);
          } else {
            clearCart();
            onNavigate('thankyou-cart');
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
  }, [paypalReady, emailValid, isSpecialMode, cartIsEmpty, cartProducts, selectedProduct]);

  if (blocked) {
    return (
      <div className="fade-in flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f1e8] px-6 pt-24 pb-16 text-center">
        <p className="section-eyebrow">Out of stock</p>
        <h1 className="font-serif-display text-3xl text-burgundy">{stockMessage}</h1>
        <p className="max-w-md text-sm text-charcoal/60">
          Our PDFs are being restocked. Follow Scent Stack on Pinterest or check back soon — they will be available again very shortly.
        </p>
        <button onClick={() => onNavigate('shop')} className="btn-primary mt-2">
          Back to the shop
        </button>
      </div>
    );
  }

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
          onClick={() => onNavigate(isSpecialMode ? (isBundleMode ? 'bundle' : 'shop') : 'shop')}
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 transition-colors hover:text-burgundy"
        >
          <ArrowLeft size={15} />
          {isSpecialMode ? 'Back' : 'Back to shop'}
        </button>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <aside className="rounded-[32px] border border-[#b08d57]/20 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow mb-2">Your order</p>
                <h1 className="font-serif-display text-4xl text-burgundy">{headlineTitle}</h1>
              </div>
              <div className="rounded-full bg-[#efe4d4] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-burgundy">
                USD
              </div>
            </div>

            {isSpecialMode ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#b08d57]/15 bg-[#efe4d4]/60 p-4">
                <div className="flex justify-center rounded-xl p-4" style={{ background: selectedProduct!.accent }}>
                  <img
                    src={selectedProduct!.coverImage}
                    alt={`${selectedProduct!.title} cover`}
                    className="max-h-[260px] w-auto rounded-sm object-contain shadow-xl"
                  />
                </div>
              </div>
            ) : (
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
                    <span className="font-serif-display text-xl font-bold tabular-nums text-burgundy">${Number(p.price).toFixed(2)}</span>
                    {cartProducts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(p.id)}
                        aria-label={`Remove ${p.title}`}
                        title="Remove"
                        className="shrink-0 rounded-full p-1.5 text-charcoal/40 transition-colors hover:bg-white hover:text-burgundy"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
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
              {emailFix && (
                <p className="mt-2 text-xs text-red-700">
                  Did you mean <strong>{emailFix}</strong>?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(emailFix);
                      setEmailConfirm(emailFix);
                    }}
                    className="font-semibold underline"
                  >
                    Yes, use it
                  </button>
                </p>
              )}
              <label htmlFor="checkout-email-confirm" className="mb-2 mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-charcoal/60">
                <Mail size={13} className="text-gold" />
                Confirm your email
              </label>
              <input
                id="checkout-email-confirm"
                type="email"
                inputMode="email"
                autoComplete="off"
                required
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="Type it again"
                className="w-full rounded-xl border border-[#b08d57]/25 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-burgundy"
              />
              {emailConfirm && !emailsMatch && <p className="mt-2 text-xs text-red-700">The two emails don’t match yet.</p>}
              {checkingEmail && <p className="mt-2 text-xs text-charcoal/60">Checking your email…</p>}
              {emailLooksOk && emailChecked && !emailCheck?.ok && <p className="mt-2 text-xs text-red-700">{emailCheck?.message}</p>}
              {emailValid && <p className="mt-2 text-xs text-green-700">✓ Email verified</p>}
              <p className="mt-2 text-xs text-charcoal/50">
                Your download link{lineItems.length > 1 ? 's are' : ' is'} sent to this exact address — double-check it before paying.
                {email && emailValid ? ` We’ll send it to ${maskEmail(email.trim())}.` : ''}
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
              {!paypalReady && status !== 'error' && (
                <LoadingSpinner label="Loading secure checkout" />
              )}
              {paypalReady && status === 'loading' && <LoadingSpinner label="Setting up your secure order" />}
              {paypalReady && status === 'processing' && <LoadingSpinner label="Confirming your payment" />}
              <div id="paypal-button-container" className="min-h-[220px]" />
              {!emailValid && paypalReady && (
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
