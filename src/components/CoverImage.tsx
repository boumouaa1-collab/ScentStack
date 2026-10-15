type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  // The first big picture on a page: load it right away and ahead of everything else.
  priority?: boolean;
  // Adds a soft blurred copy behind the picture. Only use it on a single large picture
  // (it is costly to draw), e.g. the product page, never in long lists of cards.
  blurBackdrop?: boolean;
};

// Phones download the smaller 720px version of the pictures that have one.
const hasSmall = (src: string) =>
  /^\/productImages\/soon\/[a-z-]+\.webp$/.test(src) ||
  src === '/productImages/prod1/cover.webp' ||
  /^\/blog\/covers\/[a-z0-9-]+\.jpg$/.test(src) ||
  /^\/blog\/[a-z0-9-]+\.jpg$/.test(src);

const smallOf = (src: string) => src.replace(/\.(webp|jpg)$/, '-720.$1');

// Fills its (relative, sized) parent edge to edge without ever cropping the picture.
// Square covers fill the box exactly; other shapes are shown whole on the parent's background.
const SIZES = '(min-width: 1024px) 400px, (min-width: 640px) 45vw, 92vw';

export default function CoverImage({ src, alt, className = '', eager = false, priority = false, blurBackdrop = false }: CoverImageProps) {
  return (
    <>
      {blurBackdrop && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
        />
      )}
      <img
        src={src}
        alt={alt}
        srcSet={hasSmall(src) ? `${smallOf(src)} 720w, ${src} 1200w` : undefined}
        sizes={hasSmall(src) ? SIZES : undefined}
        width={1200}
        height={1200}
        loading={eager || priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain ${className}`}
      />
    </>
  );
}
