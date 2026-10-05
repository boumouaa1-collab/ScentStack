import { resolveOrderFromReference } from '../lib/products.js';
import { createOrderRecord, markOrder } from '../lib/store.js';
import { paypalRequest } from '../lib/paypal.js';
import { createSignedDownloadUrl } from '../lib/supabase.js';
import {
  sendDownloadEmail,
  sendCartDownloadEmail,
  sendBundleDownloadEmail,
  sendFulfillmentAlert,
} from '../lib/email.js';

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
    const emailAddress = customerEmail || captureResult.payer?.email_address || '';

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

    let emailResult = { ok: false, reason: 'NO_FILES_AVAILABLE' };
    if (ready.length > 0) {
      if (order.isBundle) {
        emailResult = await sendBundleDownloadEmail({ to: emailAddress, items: ready, amount: amountLabel, idempotencyKey: orderId });
      } else if (ready.length === 1) {
        emailResult = await sendDownloadEmail({
          to: emailAddress,
          productName: ready[0].name,
          fileName: ready[0].fileName,
          downloadUrl: ready[0].url,
          amount: amountLabel,
          idempotencyKey: orderId,
        });
      } else {
        emailResult = await sendCartDownloadEmail({ to: emailAddress, items: ready, amount: amountLabel, idempotencyKey: orderId });
      }
    }

    if (emailResult.ok) {
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
      emailSent: emailResult.ok,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Payment could not be completed.' });
  }
}
