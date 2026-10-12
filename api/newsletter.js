export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const email = typeof request.body?.email === 'string' ? request.body.email.trim() : '';
  const source = typeof request.body?.source === 'string' ? request.body.source.replace(/[^a-z0-9:_-]/gi, '').slice(0, 40) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ error: 'Enter a valid email address.' });

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const recipient = process.env.SUPPORT_EMAIL || 'aymaneelmj@gmail.com';
  const from = process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';
  if (!apiKey) {
    console.error('newsletter: RESEND_API_KEY is not set on this deployment.');
    return response.status(503).json({ error: 'Newsletter signup is temporarily unavailable.' });
  }

  const isRestock = source.startsWith('restock-');
  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };

  // 1) Save the contact in your Resend audience (when one is configured).
  let saved = false;
  if (audienceId) {
    try {
      const contactResult = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, unsubscribed: false }),
      });
      saved = contactResult.ok;
      if (!contactResult.ok) console.error('newsletter: audience save failed', contactResult.status, await contactResult.text().catch(() => ''));
    } catch (error) {
      console.error('newsletter: audience save error', error);
    }
  }

  // 2) Email YOU every signup, so nothing is lost even without an audience.
  let notified = false;
  try {
    const subject = isRestock
      ? `Restock request: ${source.replace('restock-', '')}`
      : 'New Scent Stack newsletter subscriber';
    const emailResult = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from,
        to: [recipient],
        subject,
        text: `${isRestock ? 'Someone wants to be told when this product is back' : 'New subscriber'}: ${email}${source ? `\nSource: ${source}` : ''}`,
        reply_to: email,
      }),
    });
    notified = emailResult.ok;
    if (!emailResult.ok) console.error('newsletter: notification email failed', emailResult.status, await emailResult.text().catch(() => ''));
  } catch (error) {
    console.error('newsletter: notification email error', error);
  }

  // Only report success if the signup actually reached you somewhere.
  if (!saved && !notified) return response.status(502).json({ error: 'Newsletter signup is temporarily unavailable.' });
  return response.status(200).json({ ok: true });
}
