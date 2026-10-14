type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  // Adds a soft blurred copy behind the picture. Only use it on a single large picture
  // (it is costly to draw), e.g. the product page, never in long lists of cards.
  blurBackdrop?: boolean;
};

// Fills its (relative, sized) parent edge to edge without ever cropping the picture.
// Square covers fill the box exactly; other shapes are shown whole on the parent's background.
export default function CoverImage({ src, alt, className = '', eager = false, blurBackdrop = false }: CoverImageProps) {
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
        width={1200}
        height={1200}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain ${className}`}
      />
    </>
  );
}
