import { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type BlogPost, blogPosts } from '@/data/blog';
import { getProduct, siteConfig } from '@/data/products';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import BuyButton from '@/components/BuyButton';
import ScentGif from '@/components/ScentGif';
import Reveal from '@/components/Reveal';

type BlogPostPageProps = {
  post: BlogPost;
  onNavigate: (page: string) => void;
};

export default function BlogPostPage({ post, onNavigate }: BlogPostPageProps) {
  const heroProduct = getProduct(post.relatedProductId);
  useDocumentMeta(post.metaTitle, post.metaDescription, false, heroProduct?.coverImage);

  useEffect(() => {
    const scriptId = 'blog-post-schema';
    document.getElementById(scriptId)?.remove();
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      author: { '@type': 'Organization', name: 'Scent Stack' },
      publisher: { '@type': 'Organization', name: 'Scent Stack' },
      mainEntityOfPage: `${siteConfig.siteUrl}/blog/${post.slug}`,
    });
    document.head.appendChild(script);
    return () => document.getElementById(scriptId)?.remove();
  }, [post]);

  const product = heroProduct;
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="fade-in mx-auto max-w-3xl px-6 py-28 lg:px-10">
      <button
        type="button"
        onClick={() => onNavigate('blog')}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-burgundy transition-colors hover:text-plum"
      >
        <ArrowLeft size={15} /> All guides
      </button>

      <p className="section-eyebrow">{post.publishedLabel}</p>
      <h1 className="font-serif-display mt-3 text-4xl leading-tight text-burgundy md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-charcoal/50">{post.readTime}</p>

      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-[#efe4d4]/60">
        <ScentGif number={post.coverGifNumber} alt={post.title} className="blog-hero-gif" />
      </div>

      <div className="mt-10 space-y-8">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif-display text-2xl text-burgundy">{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index} className="mt-3 text-base leading-relaxed text-charcoal/80">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {product && (
        <div className="mt-14 rounded-2xl border border-[#b08d57]/20 bg-[#efe4d4]/45 p-8 text-center">
          <p className="section-eyebrow">Put this into practice</p>
          <h3 className="font-serif-display mt-2 text-2xl text-burgundy">{product.title}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-charcoal/70">{product.shortDescription}</p>
          <div className="mt-6 flex justify-center">
            <BuyButton
              label={product.ctaLabel}
              price={product.price}
              itemId={product.id}
              productId={product.id}
              productSlug={product.slug}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      )}

      {related.length > 0 && (
        <Reveal className="mt-16 border-t border-[#b08d57]/15 pt-10">
          <p className="section-eyebrow mb-5">Keep reading</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => onNavigate(`blog-${r.slug}`)}
                className="group flex items-start justify-between gap-3 rounded-xl border border-[#b08d57]/15 bg-white p-5 text-left transition-shadow hover:shadow-md"
              >
                <span className="font-serif-display text-lg text-burgundy">{r.title}</span>
                <ArrowRight size={16} className="mt-1 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </Reveal>
      )}
    </article>
  );
}
