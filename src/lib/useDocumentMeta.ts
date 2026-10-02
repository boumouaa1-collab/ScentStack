import { useEffect } from 'react';

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    // selector is always of the form [property="..."] or [name="..."]
    const match = selector.match(/\[(\w+)="([^"]+)"\]/);
    if (match) el.setAttribute(match[1], match[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function useDocumentMeta(title: string, description: string, noindex = false, image?: string) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);

    if (image) {
      const absoluteImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;
      setMeta('meta[property="og:image"]', 'content', absoluteImage);
      setMeta('meta[name="twitter:image"]', 'content', absoluteImage);
    }

    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, noindex, image]);
}
