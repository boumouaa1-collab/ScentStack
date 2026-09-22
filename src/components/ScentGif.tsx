type ScentGifProps = {
  number: number;
  alt: string;
  className?: string;
};

export default function ScentGif({ number, alt, className = '' }: ScentGifProps) {
  return (
    <img
      src={`/assets/gifs/${number}.gif`}
      alt={alt}
      className={`scent-gif ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}