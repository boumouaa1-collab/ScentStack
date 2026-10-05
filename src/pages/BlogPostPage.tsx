import { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type BlogPost, getPublishAt, getPublishedPosts } from '@/data/blog';
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
  useDocumentMeta(post.metaTitle, post.metaDescription, false, post.coverImage || heroProduct?.coverImage);

  useEffect(() => {
    const url = `${siteConfig.siteUrl}/blog/${post.slug}`;
    const publishAt = getPublishAt(post.slug);
    const image = post.coverImage || heroProduct?.coverImage;

    // Canonical URL for this article.
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Structured data: Article (+ FAQPage when the article has a FAQ).
    const graph: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        ...(image ? { image: image.startsWith('http') ? image : `${siteConfig.siteUrl}${image}` } : {}),
        ...(publishAt ? { datePublished: new Date(publishAt).toISOString() } : {}),
        author: { '@type': 'Organization', name: 'Scent Stack' },
        publisher: { '@type': 'Organization', name: 'Scent Stack' },
        mainEntityOfPage: url,
      },
    ];
    if (post.faq && post.faq.length > 0) {
      graph.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      });
    }

    const scriptId = 'blog-post-schema';
    document.getElementById(scriptId)?.remove();
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(graph);
    document.head.appendChild(script);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [post, heroProduct]);

  const product = heroProduct;
  const related = getPublishedPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

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
      {post.subtitle && <p className="mt-4 text-lg leading-relaxed text-charcoal/70">{post.subtitle}</p>}
      <p className="mt-4 text-sm text-charcoal/50">{post.readTime}</p>

      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-[#efe4d4]/60">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            className="h-full w-full object-contain p-4"
            decoding="async"
          />
        ) : (
          <ScentGif number={post.coverGifNumber ?? 1} alt={post.title} className="blog-hero-gif" />
        )}
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
            {section.list && (
              <ul className="mt-4 space-y-2 pl-1">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed text-charcoal/80">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b08d57]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.image && (
              <figure className="mt-6">
                <img
                  src={section.image.src}
                  alt={section.image.alt}
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-2xl border border-[#b08d57]/20"
                />
                {section.image.caption && (
                  <figcaption className="mt-2 text-center text-xs text-charcoal/50">{section.image.caption}</figcaption>
                )}
              </figure>
            )}
            {section.quote && (
              <blockquote className="mt-6 border-l-2 border-gold bg-[#efe4d4]/40 py-4 pl-6 pr-4">
                <p className="font-serif-display text-xl italic leading-snug text-burgundy">“{section.quote.text}”</p>
                {section.quote.cite && <cite className="mt-2 block text-xs not-italic text-charcoal/50">— {section.quote.cite}</cite>}
              </blockquote>
            )}
          </section>
        ))}
      </div>

      {post.faq && post.faq.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif-display text-2xl text-burgundy">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-[#b08d57]/15 rounded-2xl border border-[#b08d57]/15 bg-white">
            {post.faq.map((item) => (
              <details key={item.q} className="group p-5">
                <summary className="cursor-pointer list-none font-medium text-burgundy marker:hidden">{item.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

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
