import { Check, Heart, Mail, Sparkles } from 'lucide-react';
import { bundle, getProductById, siteConfig, isConfigured } from '@/data/products';
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

  const purchasedTitle = isBundle ? bundle.name : product?.title || 'your order';

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
          <p className="mt-2 text-sm text-charcoal/70">
            Scent Stack will email you a secure download link for {isBundle ? 'all three PDFs' : 'your PDF'} after PayPal confirms your payment.
          </p>
        </div>

        {cross && !isBundle && product && (
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

        {!isBundle && (
          <div className="mt-6 rounded-2xl border border-[#b08d57]/20 bg-white p-6">
            <p className="text-sm text-charcoal/70">
              Want all three? Grab the <strong className="text-burgundy">{bundle.name}</strong> for{' '}
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
