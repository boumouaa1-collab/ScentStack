import { useDocumentMeta } from '@/lib/useDocumentMeta';

type LegalPageProps = {
  page: 'privacy' | 'terms' | 'refund-policy';
  onNavigate: (page: string) => void;
};

const copy = {
  privacy: {
    title: 'Privacy Policy',
    content: [
      'Scent Stack collects only the information needed to process your purchase and provide your digital download securely.',
      'We use your email address to send purchase confirmation, delivery links, and support communications for your order.',
      'We do not sell your personal information. We may securely process payment through PayPal and use Supabase for private digital delivery storage.',
      'We retain information only as long as needed to provide purchased products, customer support, and required business records.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    content: [
      'Scent Stack sells digital PDF products for personal use only. Please do not redistribute, resell, or share your purchase files without permission.',
      'By purchasing a digital product, you agree that the purchase is final and that you are receiving a digital file, not a physical product.',
      'We reserve the right to update product descriptions, pricing, or availability without notice.',
      'If you have questions about these terms, contact Scent Stack before purchasing.',
    ],
  },
  'refund-policy': {
    title: 'Refund Policy',
    content: [
      'Because digital products are delivered instantly, refunds are generally not issued once a file has been downloaded or accessed.',
      'If there is a payment error, a technical problem with your delivery, or a duplicate purchase, please contact support and we will review the case.',
      'For payment errors, technical delivery problems, or duplicate purchases, contact support promptly so we can review the order.',
    ],
  },
};

export default function LegalPage({ page, onNavigate }: LegalPageProps) {
  const info = copy[page];
  useDocumentMeta(`${info.title} | Scent Stack`, `Scent Stack ${info.title.toLowerCase()} for digital fragrance products.`);

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <p className="section-eyebrow">Legal</p>
        <h1 className="font-serif-display text-5xl text-burgundy">{info.title}</h1>
        <div className="mt-8 rounded-[28px] border border-[#b08d57]/15 bg-white p-8 shadow-sm">
          {info.content.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-base leading-relaxed text-charcoal/75">
              {paragraph}
            </p>
          ))}
        </div>
        <button onClick={() => onNavigate('home')} className="mt-8 btn-secondary">
          Back to shop
        </button>
      </div>
    </div>
  );
}
