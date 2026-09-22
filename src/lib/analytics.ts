declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 event and a matching Pinterest tag event, if those scripts
 * are actually installed (see index.html). Does nothing otherwise — safe
 * to call everywhere even before you've added real tracking IDs.
 */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event, params);
  window.pintrk?.('track', 'custom', { event_id: event, ...params });
}
