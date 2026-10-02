import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import ScentGif from '@/components/ScentGif';
import Reveal from '@/components/Reveal';
import TiltCard from '@/components/TiltCard';

type BlogPageProps = {
  onNavigate: (page: string) => void;
};

export default function BlogPage({ onNavigate }: BlogPageProps) {
  useDocumentMeta(
    'The Scent Letter — Fragrance Guides & Tips | Scent Stack',
    'Guides on organizing your perfume collection, layering fragrance, finding your signature scent, and building a fragrance wardrobe.'
  );

  return (
    <div className="fade-in mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="mb-14 text-center">
        <p className="section-eyebrow">The Scent Letter</p>
        <h1 className="font-serif-display text-5xl text-burgundy md:text-6xl">Fragrance Guides &amp; Tips</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
          Practical guides on building, organizing, and enjoying a fragrance collection you actually love.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 70}>
          <TiltCard className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#b08d57]/15 bg-white transition-shadow hover:shadow-lg">
            <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#efe4d4]/60">
              <ScentGif number={post.coverGifNumber} alt={post.title} className="blog-card-gif" />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <span className="text-xs uppercase tracking-widest text-gold">{post.publishedLabel}</span>
              <h2 className="mt-2 font-serif-display text-2xl leading-snug text-burgundy">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">{post.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-charcoal/50">
                <span>{post.readTime}</span>
                <button
                  type="button"
                  onClick={() => onNavigate(`blog-${post.slug}`)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest text-burgundy transition-colors hover:text-plum"
                >
                  Read <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
