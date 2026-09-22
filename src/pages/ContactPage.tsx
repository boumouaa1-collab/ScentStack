import { Mail, MessageCircle } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export default function ContactPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  useDocumentMeta('Contact | Scent Stack', 'Contact Scent Stack customer support for digital product delivery and order help.');

  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'aymaneelmj@gmail.com';

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <p className="section-eyebrow">Support</p>
        <h1 className="font-serif-display text-5xl text-burgundy">Contact Scent Stack</h1>
        <div className="mt-8 rounded-[28px] border border-[#b08d57]/15 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-burgundy">
            <Mail size={18} className="text-gold" />
            <a href={`mailto:${supportEmail}`} className="text-lg font-medium underline-offset-4 hover:underline">
              {supportEmail}
            </a>
          </div>
          <p className="mt-4 text-base leading-relaxed text-charcoal/75">
            For payment issues, download problems, or product support, email us and we’ll help as quickly as possible.
          </p>
          <div className="mt-6 rounded-2xl bg-[#f7f1e8] p-4 text-sm text-charcoal/70">
            <div className="flex items-center gap-2 font-medium text-burgundy">
              <MessageCircle size={16} className="text-gold" />
              Response time
            </div>
            <p className="mt-2">We aim to respond within 1–2 business days.</p>
          </div>
        </div>
        <button onClick={() => onNavigate('home')} className="mt-8 btn-secondary">
          Back to shop
        </button>
      </div>
    </div>
  );
}
