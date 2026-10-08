export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const email = typeof request.body?.email === 'string' ? request.body.email.trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ error: 'Enter a valid email address.' });

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const recipient = process.env.SUPPORT_EMAIL || 'aymaneelmj@gmail.com';
  const from = process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';
  if (!apiKey) return response.status(503).json({ error: 'Newsletter signup is temporarily unavailable.' });

  if (audienceId) {
    const contactResult = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    if (!contactResult.ok) return response.status(502).json({ error: 'Newsletter signup is temporarily unavailable.' });
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [recipient], subject: 'New Scent Stack newsletter subscriber', text: `New subscriber: ${email}`, reply_to: email }),
  }).catch(() => null);
  return response.status(200).json({ ok: true });
}