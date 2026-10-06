// Strict email check + typo detection, so a mistyped address (e.g. "name@gmail.c")
// can never be used to deliver a paid download.

export const STRICT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const DOMAIN_FIXES: Record<string, string> = {
  'gmail.c': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'outlook.con': 'outlook.com',
  'outlok.com': 'outlook.com',
  'icloud.con': 'icloud.com',
  'iclould.com': 'icloud.com',
};

/** Returns a corrected address if the domain looks like a common typo, otherwise null. */
export function suggestEmailFix(email: string): string | null {
  const value = email.trim();
  const at = value.lastIndexOf('@');
  if (at < 1) return null;
  const fixed = DOMAIN_FIXES[value.slice(at + 1).toLowerCase()];
  return fixed ? `${value.slice(0, at)}@${fixed}` : null;
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  return `${name.slice(0, 1)}***@${domain}`;
}
