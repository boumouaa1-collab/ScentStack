import { ArrowLeft, Home, WifiOff } from 'lucide-react';

type ErrorPageProps = {
  status: '404' | '403' | 'offline';
  onNavigate: (page: string) => void;
};

const copy = {
  '404': { eyebrow: 'Page not found', title: 'This page has drifted away.', text: 'The address may be incorrect, or the page may have moved.' },
  '403': { eyebrow: 'Access restricted', title: 'This page is private.', text: 'You do not have permission to view this page.' },
  offline: { eyebrow: 'Connection issue', title: 'You are offline.', text: 'Check your connection and try again when you are back online.' },
};

export default function ErrorPage({ status, onNavigate }: ErrorPageProps) {
  const content = copy[status];
  return (
    <div className="fade-in flex min-h-[70vh] items-center justify-center bg-[#f7f1e8] px-6 py-24 text-center">
      <div className="max-w-xl">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#efe4d4] text-gold">
          {status === 'offline' ? <WifiOff size={34} /> : <span className="font-serif-display text-3xl">{status}</span>}
        </div>
        <p className="section-eyebrow">{content.eyebrow}</p>
        <h1 className="mt-3 font-serif-display text-5xl text-burgundy md:text-6xl">{content.title}</h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-charcoal/70">{content.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => onNavigate('home')} className="btn-primary"><Home size={16} /> Back to home</button>
          <button type="button" onClick={() => window.history.back()} className="btn-secondary"><ArrowLeft size={16} /> Go back</button>
        </div>
      </div>
    </div>
  );
}