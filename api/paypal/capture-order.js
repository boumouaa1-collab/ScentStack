import { resolveOrderFromReference } from '../../server/products.js';
import { createOrderRecord, markOrder } from '../../server/store.js';
import { paypalRequest } from '../../server/paypal.js';
import { createSignedDownloadUrl } from '../../server/supabase.js';
import {
  sendDownloadEmail,
  sendCartDownloadEmail,
  sendBundleDownloadEmail,
  sendFulfillmentAlert,
  isValidEmail,
} from '../../server/email.js';

// Download links stay valid for 7 days so a customer who opens the email late still gets their files.
const LINK_LIFETIME_SECONDS = 7 * 24 * 60 * 60;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { orderId, customerEmail } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ message: 'Missing PayPal order id.' });
  }

  try {
    const captureResult = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
    });

    const unit = captureResult.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    const currency = capture?.amount?.currency_code || 'USD';

    if (capture?.status !== 'COMPLETED') {
      return res.status(402).json({ message: 'Payment is not completed yet.' });
    }

    // What was bought is read back from PayPal (set by create-order), NEVER from the browser.
    let reference = capture?.custom_id || unit?.custom_id || unit?.reference_id;
    if (!reference) {
      const fetched = await paypalRequest(`/v2/checkout/orders/${orderId}`, { method: 'GET' }).catch(() => null);
      reference = fetched?.purchase_units?.[0]?.custom_id || fetched?.purchase_units?.[0]?.reference_id;
    }

    const order = resolveOrderFromReference(reference);
    const paidAmount = Number(capture?.amount?.value || 0);
    const typedEmail = typeof customerEmail === 'string' ? customerEmail.trim() : '';
    const payerEmail = (captureResult.payer?.email_address || '').trim();
    // Deliver to the address typed at checkout AND the (PayPal-verified) payer address, so one typo can never lose a paid order.
    const recipients = [...new Set([typedEmail, payerEmail].filter(isValidEmail).map((a) => a.toLowerCase()))];
    const emailAddress = typedEmail || payerEmail;

    if (order.products.length === 0 || Math.abs(paidAmount - order.total) > 0.005) {
      console.error('Order/amount mismatch — not delivering.', JSON.stringify({ orderId, reference, paidAmount, expected: order.total }));
      await sendFulfillmentAlert({
        orderId,
        customerEmail: emailAddress,
        amount: `${currency} ${paidAmount.toFixed(2)}`,
        problem: `Payment received but it does not match any order (reference: ${reference || 'none'}, expected ${order.total.toFixed(2)}). Nothing was delivered automatically.`,
      }).catch(() => null);
      return res.status(409).json({ message: 'We could not match your payment to an order. Please contact support — we will sort it out right away.' });
    }

    const amountLabel = `${currency} $${paidAmount.toFixed(2)}`;

    createOrderRecord({
      id: orderId,
      paypal_order_id: orderId,
      paypal_capture_id: capture?.id || orderId,
      product_id: order.ref,
      product_name: order.products.map((p) => p.name).join(', '),
      amount: paidAmount.toFixed(2),
      currency,
      customer_email: emailAddress,
      payment_status: 'paid',
      fulfillment_status: 'fulfilled',
      email_sent: false,
    });

    // A private signed link for every product in this order.
    const links = await Promise.all(
      order.products.map(async (p) => ({
        id: p.id,
        name: p.name,
        fileName: p.fileName,
        url: await createSignedDownloadUrl(p.storagePath, p.storageBucket, LINK_LIFETIME_SECONDS),
      }))
    );
    const ready = links.filter((item) => item.url);
    const missing = links.filter((item) => !item.url);

    // A missing file in Supabase must never fail silently — tell the owner exactly what to fix/send.
    if (missing.length > 0) {
      await sendFulfillmentAlert({
        orderId,
        customerEmail: emailAddress,
        amount: amountLabel,
        problem: `These files could not be found in Supabase storage: ${missing.map((m) => `${m.name} (${m.fileName})`).join(', ')}. Upload them with exactly these names and send them to the customer.`,
      }).catch(() => null);
    }

    const sendOne = (to, key) => {
      if (order.isBundle) return sendBundleDownloadEmail({ to, items: ready, amount: amountLabel, idempotencyKey: key });
      if (ready.length === 1) {
        return sendDownloadEmail({
          to,
          productName: ready[0].name,
          fileName: ready[0].fileName,
          downloadUrl: ready[0].url,
          amount: amountLabel,
          idempotencyKey: key,
        });
      }
      return sendCartDownloadEmail({ to, items: ready, amount: amountLabel, idempotencyKey: key });
    };

    let emailResult = { ok: false, reason: ready.length === 0 ? 'NO_FILES_AVAILABLE' : 'NO_VALID_EMAIL_ADDRESS' };
    const sentTo = [];
    if (ready.length > 0) {
      for (const [index, to] of recipients.entries()) {
        const result = await sendOne(to, index === 0 ? orderId : `${orderId}-${index + 1}`).catch((error) => ({ ok: false, reason: error.message }));
        if (result.ok) {
          sentTo.push(to);
          emailResult = result;
        } else if (!emailResult.ok) {
          emailResult = result;
        }
      }
    }

    if (sentTo.length > 0) {
      markOrder(orderId, { email_sent: true, email_sent_at: new Date().toISOString() });
    } else {
      markOrder(orderId, { email_sent: false, email_error: emailResult.reason || 'EMAIL_FAILED' });
      // The customer has paid — if the email did not go out, the owner gets the links to forward by hand.
      if (ready.length > 0) {
        await sendFulfillmentAlert({
          orderId,
          customerEmail: emailAddress,
          amount: amountLabel,
          problem: `The delivery email to the customer FAILED (${emailResult.reason || 'unknown'}). Forward these links manually.`,
          links: ready,
        }).catch(() => null);
      }
    }

    return res.status(200).json({
      ok: true,
      orderId,
      productIds: order.products.map((p) => p.id),
      paymentStatus: 'paid',
      amount: paidAmount.toFixed(2),
      currency,
      downloadUrl: ready.length === 1 && !order.isBundle ? ready[0].url : null,
      emailSent: sentTo.length > 0,
      sentTo: sentTo.map((a) => `${a.split('@')[0].slice(0, 1)}***@${a.split('@')[1]}`),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Payment could not be completed.' });
  }
}
