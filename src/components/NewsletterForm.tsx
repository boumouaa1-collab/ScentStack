import { useState } from 'react';
import { track } from '@/lib/analytics';

type NewsletterFormProps = { source?: string; productTitle?: string; productUrl?: string; buttonLabel?: string; successMessage?: string; className?: string };

export default function NewsletterForm({
  source = 'home',
  productTitle,
  productUrl,
  buttonLabel = 'Join the list',
  successMessage = "You're on the list. Watch your inbox for the next Scent Letter.",
  className = 'mx-auto mt-8 max-w-xl',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, productTitle, productUrl }),
      });
      if (!response.ok) throw new Error('Newsletter signup failed');
      track('newsletter_signup');
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <label htmlFor={`newsletter-email-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-email-${source}`}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        className="min-w-0 flex-1 rounded-full border border-[#b08d57]/30 bg-[#f7f1e8] px-5 py-3.5 text-sm text-charcoal outline-none transition focus:border-gold focus:ring-1 focus:ring-[#b08d57]"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary whitespace-nowrap disabled:cursor-wait disabled:opacity-60"
      >
        {status === 'sending' ? 'Joining...' : buttonLabel}
      </button>
      {status === 'success' && (
        <p className="basis-full text-sm text-green-700">{successMessage}</p>
      )}
      {status === 'error' && (
        <p className="basis-full text-sm text-red-700">We couldn't save that email. Please try again.</p>
      )}
    </form>
  );
}
