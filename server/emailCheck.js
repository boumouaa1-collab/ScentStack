import { promises as dns } from 'node:dns';

// Decides whether an address can really receive the paid download BEFORE any money is taken.
// 1) well-formed  2) not a known typo (gmail.con ...)  3) not a throw-away inbox
// 4) the domain really accepts mail (MX/A record) — big providers are trusted instantly.

const STRICT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const TYPO_DOMAINS = {
  'gmail.c': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com',
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotmai.com': 'hotmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'outlook.con': 'outlook.com', 'outlok.com': 'outlook.com',
  'icloud.con': 'icloud.com', 'iclould.com': 'icloud.com',
};

const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'yopmail.com',
  'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com', 'maildrop.cc', 'throwawaymail.com',
]);

const TRUSTED = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com',
  'msn.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com',
  'comcast.net', 'att.net', 'verizon.net', 'sky.com', 'btinternet.com',
]);

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), ms))]);

export async function checkEmail(raw, resolver = dns) {
  const email = String(raw || '').trim();
  if (!STRICT_EMAIL_RE.test(email) || email.includes('..')) {
    return { ok: false, reason: 'INVALID', message: 'That email address doesn’t look right. Please check it.' };
  }
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();

  if (TYPO_DOMAINS[domain]) {
    const suggestion = `${email.slice(0, email.lastIndexOf('@'))}@${TYPO_DOMAINS[domain]}`;
    return { ok: false, reason: 'TYPO', suggestion, message: `Did you mean ${suggestion}?` };
  }
  if (DISPOSABLE.has(domain)) {
    return { ok: false, reason: 'DISPOSABLE', message: 'Please use a permanent email address — temporary inboxes can’t receive your download reliably.' };
  }
  if (TRUSTED.has(domain)) return { ok: true };

  try {
    const mx = await withTimeout(resolver.resolveMx(domain), 3000);
    if (mx && mx.length > 0) return { ok: true };
  } catch (error) {
    if (!['ENOTFOUND', 'ENODATA'].includes(error.code)) return { ok: true }; // DNS hiccup: never block a real customer
  }
  try {
    const a = await withTimeout(resolver.resolve4(domain), 3000);
    if (a && a.length > 0) return { ok: true };
  } catch (error) {
    if (!['ENOTFOUND', 'ENODATA'].includes(error.code)) return { ok: true };
  }
  return { ok: false, reason: 'NO_MAIL_SERVER', message: `We couldn’t find a mail server for “${domain}”. Please check the part after the @.` };
}
