type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
};

// Fills its (relative, sized) parent edge to edge without ever cropping the picture:
// the image is shown whole, and a blurred copy behind it fills any leftover space.
// Square covers fill the box exactly.
export default function CoverImage({ src, alt, className = '', eager = false }: CoverImageProps) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
      />
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
