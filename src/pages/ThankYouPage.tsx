import { useState } from 'react';
import { AlertTriangle, Check, Heart, Mail, Sparkles } from 'lucide-react';
import { bundle, getProductById, siteConfig, isConfigured, testProduct } from '@/data/products';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

type ThankYouPageProps = {
  itemId: string;
  onNavigate: (page: string) => void;
};

export default function ThankYouPage({ itemId, onNavigate }: ThankYouPageProps) {
  const isBundle = itemId === 'bundle';
  const product = getProductById(itemId);
  const related = !isBundle && product ? product.relatedIds.map((id) => getProductById(id)).filter(Boolean) : [];
  const cross = related[0];

  const isTest = itemId === testProduct.id;
  const purchasedTitle = isBundle ? bundle.name : isTest ? testProduct.title : product?.title || 'your order';

  // What happened to the delivery email (saved by the checkout page right after payment).
  const lastOrder = (() => {
    try {
      const raw = sessionStorage.getItem('scentstack_last_order');
      return raw ? (JSON.parse(raw) as { orderId?: string; emailSent?: boolean; sentTo?: string[] }) : null;
    } catch {
      return null;
    }
  })();
  const [resend, setResend] = useState<{ state: 'idle' | 'sending' | 'sent' | 'error'; to?: string; error?: string }>({ state: 'idle' });

  const resendDownload = async () => {
    if (!lastOrder?.orderId) return;
    setResend({ state: 'sending' });
    try {
      const response = await fetch('/api/paypal/resend-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: lastOrder.orderId }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.ok) setResend({ state: 'sent', to: result.sentTo });
      else setResend({ state: 'error', error: result.message || 'We could not resend it right now.' });
    } catch {
      setResend({ state: 'error', error: 'We could not resend it right now.' });
    }
  };

  useDocumentMeta('Thank You | Scent Stack', 'Your Scent Stack order is confirmed — check your email for your download.', true);

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <Check className="text-green-600" size={40} />
        </div>

        <p className="section-eyebrow">Order Confirmed</p>
        <h1 className="font-serif-display text-4xl text-burgundy md:text-5xl">Thank you for your purchase</h1>
        <p className="mt-4 text-lg text-charcoal/70">
          Your order for <strong>{purchasedTitle}</strong> is confirmed.
        </p>

        <div className="mt-10 rounded-3xl border border-[#b08d57]/20 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#efe4d4]/60">
            <Mail className="text-gold" size={28} />
          </div>
          <h2 className="font-serif-display text-2xl text-burgundy">Check your email</h2>
          {lastOrder?.emailSent === false ? (
            <div className="mt-3 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-left text-sm text-amber-900">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <p>
                Your payment went through, but we couldn’t send the email to the address you typed. Don’t worry — we’ve been alerted and will send your
                download manually. You can also try sending it again to your PayPal email below.
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-charcoal/70">
              {lastOrder?.sentTo && lastOrder.sentTo.length > 0
                ? `We sent a secure download link for ${isBundle ? 'all six PDFs' : 'your PDF'} to ${lastOrder.sentTo.join(' and ')}. If you can’t see it, check your spam or Promotions folder.`
                : `Scent Stack will email you a secure download link for ${isBundle ? 'all six PDFs' : 'your PDF'} after PayPal confirms your payment.`}
            </p>
          )}
          {lastOrder?.orderId && (
            <div className="mt-4">
              {resend.state === 'sent' ? (
                <p className="text-sm text-green-700">Sent again to {resend.to}. It can take a minute to arrive.</p>
              ) : (
                <button type="button" onClick={resendDownload} disabled={resend.state === 'sending'} className="btn-secondary">
                  {resend.state === 'sending' ? 'Sending…' : 'Didn’t get it? Send it again to my PayPal email'}
                </button>
              )}
              {resend.state === 'error' && <p className="mt-2 text-sm text-red-700">{resend.error}</p>}
            </div>
          )}
        </div>

        {cross && !isBundle && !isTest && product && (
          <div className="mt-8 overflow-hidden rounded-3xl p-8 text-left" style={{ background: cross.accent }}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#b08d57]">One more thing</p>
            <h3 className="mt-2 font-serif-display text-2xl text-[#f7f1e8]">
              Add {cross.title} for ${cross.price}
            </h3>
            <p className="mt-3 text-[#f7f1e8]/70">{product.upsellMessage}</p>
            <button
              onClick={() => onNavigate(`product-${cross.slug}`)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b08d57] px-6 py-3 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-[#c5a36c]"
            >
              Add to my collection
              <Sparkles size={15} />
            </button>
          </div>
        )}

        {!isBundle && !isTest && (
          <div className="mt-6 rounded-2xl border border-[#b08d57]/20 bg-white p-6">
            <p className="text-sm text-charcoal/70">
              Want the complete set? Grab the <strong className="text-burgundy">{bundle.name}</strong> for{' '}
              <strong className="text-burgundy">${bundle.price}</strong> and complete your collection.
            </p>
            <button onClick={() => onNavigate('bundle')} className="mt-4 btn-secondary">
              View Bundle
            </button>
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-[#efe4d4]/40 p-8 text-left">
          <h3 className="mb-4 font-serif-display text-xl text-burgundy">How to enjoy your workbook</h3>
          <ul className="space-y-3 text-sm text-charcoal/70">
            {[
              'Open the PDF on your tablet, laptop, or phone.',
              'For digital use, import into GoodNotes or Notability to write with a stylus.',
              'To print, use US Letter paper (A4 works too — select "Fit to page").',
              'Print the tracker and review pages as many times as you need.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          {isConfigured(siteConfig.pinterestUrl) && (
            <a
              href={siteConfig.pinterestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-charcoal/60 transition-colors hover:text-burgundy"
            >
              <Heart size={15} className="text-gold" />
              Follow Scent Stack on Pinterest
            </a>
          )}
          <p className="flex items-center gap-2 text-xs text-charcoal/50">
            <Mail size={13} />
            Need help? Open the support chat below.
          </p>
          <button onClick={() => onNavigate('home')} className="mt-4 btn-secondary">
            Back to shop
          </button>
        </div>
      </div>
    </div>
  );
}
