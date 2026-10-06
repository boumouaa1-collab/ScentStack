import { createSupportAcknowledgement, createSupportEmail } from './lib/support-email.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  // Single short line only: this text is echoed back in an auto-reply, so it must not be a free-form message.
  const issue = (typeof request.body?.issue === 'string' ? request.body.issue : 'General support').replace(/\s+/g, ' ').trim().slice(0, 80) || 'General support';
  const clientEmail = typeof request.body?.clientEmail === 'string' ? request.body.clientEmail.trim() : '';
  if (!message || message.length > 2000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return response.status(400).json({ error: 'Please enter a message up to 2,000 characters.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.SUPPORT_EMAIL || 'aymaneelmj@gmail.com';
  const from = process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';
  if (!apiKey) {
    return response.status(503).json({ error: 'Support is not configured on this server yet.' });
  }

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: clientEmail,
      subject: `Scent Stack support: ${issue.slice(0, 80)}`,
      text: `Issue selected: ${issue}\n\nMessage:\n${message}`,
      html: createSupportEmail({ issue, message, clientEmail }),
    }),
  });

  if (!emailResponse.ok) {
    return response.status(502).json({ error: 'The support email service rejected this message. Please try again or use the email fallback.' });
  }

  const acknowledgementResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [clientEmail],
      subject: 'We received your Scent Stack support request 💌',
      text: `Thank you for contacting Scent Stack. We received your message about ${issue} and will reply as soon as possible.`,
      html: createSupportAcknowledgement({ issue }),
    }),
  }).catch(() => null);

  return response.status(200).json({ ok: true, acknowledgementSent: Boolean(acknowledgementResponse?.ok) });
}
