import { FormEvent, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = { from: 'visitor' | 'support'; text: string };
const supportEmail = 'aymaneelmj@gmail.com';
const quickIssues = [
  '💳 I have a payment problem',
  '📥 I cannot download my product',
  '📖 I have a product question',
  '🛒 I need help with checkout',
];

export default function SupportButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');

  const emailFallback = (text: string) => `mailto:${supportEmail}?subject=${encodeURIComponent('Scent Stack Support Request')}&body=${encodeURIComponent(`Client email: ${clientEmail.trim()}\n\nIssue: ${text}`)}`;

  const sendMessage = async (text: string) => {
    if (!text || sending) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      setChatError('Enter your email first so we can reply to you.');
      return;
    }
    setChatError('');
    setFallbackMessage(text);
    setSending(true);
    setMessages((current) => [...current, { from: 'visitor', text }]);
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, issue: text, clientEmail: clientEmail.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Support request failed');
      const confirmation = result.acknowledgementSent === false
        ? '💌 We received your message! Our team will reply soon. The confirmation email could not be sent, but your support request was delivered.'
        : '💌 Thanks! Your message is with the Scent Stack team. We will reply soon.';
      setMessages((current) => [...current, { from: 'support', text: confirmation }]);
      setMessage('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '⚠️ We could not send that message right now.';
      setMessages((current) => [...current, { from: 'support', text: errorMessage }]);
      setChatError('You can still contact us directly by email while support chat is being restored.');
    } finally {
      setSending(false);
    }
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(message.trim());
  };

  return (
    <div className="support-widget">
      {open && (
        <section className="support-panel" aria-label="Scent Stack support chat">
          <div className="flex items-center justify-between border-b border-[#b08d57]/20 px-4 py-3">
            <div>
              <h2 className="font-serif-display text-xl text-burgundy">Scent Stack Support</h2>
              <p className="text-xs text-charcoal/55">We usually reply within 1–2 business days 💌</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-charcoal/55 hover:text-burgundy" aria-label="Close support chat">
              <X size={18} />
            </button>
          </div>
          <div className="support-email-field">
            <p className="support-email-note">Please enter your email so we know who to reply to 📧</p>
            <label htmlFor="support-email" className="sr-only">Your email address</label>
            <input id="support-email" type="email" required value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} placeholder="Your email address" disabled={sending} />
          </div>
          <div className="support-messages">
            {messages.length === 0 && <p className="text-sm text-charcoal/65">How can we help with your order or product? ✨</p>}
            {messages.length === 0 && (
              <div className="support-quick-issues">
                {quickIssues.map((issue) => (
                  <button key={issue} type="button" onClick={() => void sendMessage(issue)} disabled={sending} className="support-quick-issue">
                    {issue}
                  </button>
                ))}
              </div>
            )}
            {messages.map((item, index) => (
              <p key={`${item.from}-${index}`} className={`support-message ${item.from === 'visitor' ? 'support-message-visitor' : ''}`}>{item.text}</p>
            ))}
          </div>
          {chatError && <p className="px-3 pb-2 text-xs text-red-700">{chatError}</p>}
          {chatError && fallbackMessage && <a href={emailFallback(fallbackMessage)} className="mx-3 mb-2 inline-flex text-xs font-medium text-burgundy underline">Open your email app instead</a>}
          <form onSubmit={submitMessage} className="border-t border-[#b08d57]/20 p-3">
            <div className="flex gap-2">
              <label htmlFor="support-message" className="sr-only">Your support message</label>
              <input id="support-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." disabled={sending} className="min-w-0 flex-1 rounded-full border border-[#b08d57]/25 bg-[#f7f1e8] px-3 py-2 text-sm outline-none focus:border-gold" />
              <button type="submit" disabled={sending || !message.trim()} className="support-send" aria-label="Send support message"><Send size={16} /></button>
            </div>
          </form>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="support-button group"
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        aria-expanded={open}
        title="Need help?"
      >
        {open ? <X size={20} strokeWidth={1.8} /> : <MessageCircle size={20} strokeWidth={1.8} />}
        <span className="support-tooltip">Need help?</span>
      </button>
    </div>
  );
}
