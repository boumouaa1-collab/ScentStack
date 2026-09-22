import { useDocumentMeta } from '@/lib/useDocumentMeta';

const faqs = [
  {
    q: 'What is included in my purchase?',
    a: 'Each product is a downloadable PDF workbook or guide designed for digital use or printing at home.',
  },
  {
    q: 'When do I receive my PDF?',
    a: 'Your file is generated only after payment is confirmed and the secure download is created on the server.',
  },
  {
    q: 'Can I print the workbook?',
    a: 'Yes. The PDFs are designed to be printable and also usable in apps like GoodNotes or Notability.',
  },
  {
    q: 'What if my payment succeeds but I do not receive the email?',
    a: 'The thank-you page still provides a verified purchase download link, and the system can retry email delivery later.',
  },
];

export default function FAQPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  useDocumentMeta('FAQ | Scent Stack', 'Questions about the Scent Stack digital fragrance workbooks, PDFs, and secure checkout.');

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <p className="section-eyebrow">FAQ</p>
        <h1 className="font-serif-display text-5xl text-burgundy">Questions & answers</h1>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-[22px] border border-[#b08d57]/15 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none text-lg font-medium text-burgundy">{faq.q}</summary>
              <p className="mt-3 text-base leading-relaxed text-charcoal/75">{faq.a}</p>
            </details>
          ))}
        </div>
        <button onClick={() => onNavigate('home')} className="mt-8 btn-secondary">
          Back to shop
        </button>
      </div>
    </div>
  );
}
