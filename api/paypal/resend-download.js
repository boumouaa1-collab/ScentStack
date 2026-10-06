import { resolveOrderFromReference } from '../lib/products.js';
import { paypalRequest } from '../lib/paypal.js';
import { createSignedDownloadUrl } from '../lib/supabase.js';
import { sendDownloadEmail, sendCartDownloadEmail, sendBundleDownloadEmail, isValidEmail } from '../lib/email.js';

const LINK_LIFETIME_SECONDS = 7 * 24 * 60 * 60;

// Sends a paid order's download links again. They ONLY ever go to the PayPal account's own email
// (read from PayPal, never from the browser), so knowing an order id can't redirect someone's files.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });

  const orderId = String(req.body?.orderId || '').trim();
  if (!/^[A-Za-z0-9]{10,30}$/.test(orderId)) return res.status(400).json({ message: 'Invalid order.' });

  try {
    const paypalOrder = await paypalRequest(`/v2/checkout/orders/${orderId}`, { method: 'GET' });
    const unit = paypalOrder.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    const payerEmail = (paypalOrder.payer?.email_address || '').trim();

    if (capture?.status !== 'COMPLETED') return res.status(402).json({ message: 'This order is not paid.' });
    const ageMs = Date.now() - Date.parse(capture.create_time || '');
    if (!(ageMs >= 0 && ageMs < LINK_LIFETIME_SECONDS * 1000)) {
      return res.status(410).json({ message: 'This order is too old to resend automatically. Please contact support.' });
    }
    if (!isValidEmail(payerEmail)) return res.status(422).json({ message: 'We could not find a valid PayPal email for this order. Please contact support.' });

    const order = resolveOrderFromReference(capture.custom_id || unit?.custom_id || unit?.reference_id);
    if (order.products.length === 0 || Math.abs(Number(capture.amount?.value) - order.total) > 0.005) {
      return res.status(409).json({ message: 'We could not match this order. Please contact support.' });
    }

    const items = (
      await Promise.all(
        order.products.map(async (p) => ({
          id: p.id,
          name: p.name,
          fileName: p.fileName,
          url: await createSignedDownloadUrl(p.storagePath, p.storageBucket, LINK_LIFETIME_SECONDS),
        }))
      )
    ).filter((item) => item.url);
    if (items.length === 0) return res.status(503).json({ message: 'Your files are being prepared. Please contact support.' });

    const amount = `${capture.amount.currency_code} $${Number(capture.amount.value).toFixed(2)}`;
    // One resend per minute per order (guards against double-clicks and spam).
    const idempotencyKey = `${orderId}-resend-${Math.floor(Date.now() / 60000)}`;
    const result = order.isBundle
      ? await sendBundleDownloadEmail({ to: payerEmail, items, amount, idempotencyKey })
      : items.length === 1
        ? await sendDownloadEmail({ to: payerEmail, productName: items[0].name, fileName: items[0].fileName, downloadUrl: items[0].url, amount, idempotencyKey })
        : await sendCartDownloadEmail({ to: payerEmail, items, amount, idempotencyKey });

    if (!result.ok) return res.status(502).json({ message: 'The email could not be sent. Please contact support.' });
    return res.status(200).json({ ok: true, sentTo: `${payerEmail.split('@')[0].slice(0, 1)}***@${payerEmail.split('@')[1]}` });
  } catch (error) {
    return res.status(500).json({ message: 'We could not resend it right now. Please try again or contact support.' });
  }
}
