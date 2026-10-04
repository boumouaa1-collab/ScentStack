type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

/**
 * Branded loading indicator — two counter-rotating rings in the site's gold/burgundy
 * palette, a soft pulsing core, and an optional label. Pure CSS/SVG, no dependencies.
 */
export default function LoadingSpinner({ label, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner-wrap ${className}`} role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="loading-spinner-ring loading-spinner-ring-outer">
          <circle cx="32" cy="32" r="27" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray="90 300" />
        </svg>
        <svg viewBox="0 0 64 64" className="loading-spinner-ring loading-spinner-ring-inner">
          <circle cx="32" cy="32" r="18" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray="60 200" />
        </svg>
        <span className="loading-spinner-core" />
      </span>
      {label && <span className="loading-spinner-label">{label}</span>}
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  );
}
