import { CheckCircle2 } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

type SuccessPageProps = {
  onNavigate: (page: string) => void;
};

export default function SuccessPage({ onNavigate }: SuccessPageProps) {
  useDocumentMeta('Payment successful | Scent Stack', 'Your Scent Stack purchase has been confirmed and the download is being prepared.');

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-16">
      <div className="mx-auto max-w-xl px-6 text-center lg:px-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="text-green-600" size={42} />
        </div>
        <p className="section-eyebrow mt-8">Payment confirmed</p>
        <h1 className="font-serif-display text-5xl text-burgundy">You’re all set.</h1>
        <p className="mt-4 text-lg text-charcoal/70">
          We’ve received your payment and are preparing your digital workbook. You’ll be redirected to the secure thank-you page momentarily.
        </p>
        <button onClick={() => onNavigate('home')} className="mt-8 btn-secondary">
          Continue shopping
        </button>
      </div>
    </div>
  );
}
