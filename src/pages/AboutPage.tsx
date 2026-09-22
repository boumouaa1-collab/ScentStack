import { useDocumentMeta } from '@/lib/useDocumentMeta';

export default function AboutPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  useDocumentMeta('About | Scent Stack', 'Learn more about the Scent Stack fragrance philosophy and digital workbook collections.');

  return (
    <div className="fade-in min-h-screen bg-[#f7f1e8] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <p className="section-eyebrow">About</p>
        <h1 className="font-serif-display text-5xl text-burgundy">A fragrance system for real life.</h1>
        <div className="mt-8 rounded-[28px] border border-[#b08d57]/15 bg-white p-8 shadow-sm text-base leading-relaxed text-charcoal/75">
          <p>
            Scent Stack is designed for fragrance lovers who want more intention behind the scents they choose and wear.
          </p>
          <p className="mt-4">
            The collection blends editorial design, scent psychology, and practical organization tools so you can understand your preferences, refine your wardrobe, and layer with confidence.
          </p>
          <p className="mt-4">
            Each workbook is a digital PDF created to help you plan, track, and enjoy your fragrance life in a calmer, more beautiful way.
          </p>
        </div>
        <button onClick={() => onNavigate('home')} className="mt-8 btn-secondary">
          Back to shop
        </button>
      </div>
    </div>
  );
}
