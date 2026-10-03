import { getProduct } from '../lib/products.js';
import { createOrderRecord, getOrderRecord, markOrder } from '../lib/store.js';
import { paypalRequest } from '../lib/paypal.js';
import { createSignedDownloadUrl } from '../lib/supabase.js';
import { sendDownloadEmail, sendCartDownloadEmail } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { orderId, productId, productIds, customerEmail } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ message: 'Missing PayPal order id.' });
  }

  const ids = Array.isArray(productIds) && productIds.length > 0
    ? productIds
    : (productId ? [productId] : []);

  const resolvedProducts = ids.map((id) => getProduct(id)).filter(Boolean);
  if (resolvedProducts.length === 0) {
    return res.status(400).json({ message: 'Invalid product.' });
  }

  try {
    const captureResult = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
    });

    const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
    const amount = capture?.amount?.value;
    const currency = capture?.amount?.currency_code || 'USD';
    const status = capture?.status;

    if (status !== 'COMPLETED') {
      return res.status(402).json({ message: 'Payment is not completed yet.' });
    }

    const expectedTotal = resolvedProducts.reduce((sum, p) => sum + Number(p.price), 0);
    const normalizedAmount = Number(amount || expectedTotal).toFixed(2);
    const existing = getOrderRecord(orderId);
    const emailAddress = customerEmail || captureResult.payer?.email_address || existing?.customer_email || 'unknown@example.com';

    createOrderRecord({
      id: orderId,
      paypal_order_id: orderId,
      paypal_capture_id: capture?.id || orderId,
      product_id: resolvedProducts.map((p) => p.id).join('+'),
      product_name: resolvedProducts.map((p) => p.name).join(', '),
      amount: normalizedAmount,
      currency,
      customer_email: emailAddress,
      payment_status: 'paid',
      fulfillment_status: 'fulfilled',
      download_created_at: new Date().toISOString(),
      email_sent_at: null,
      email_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_slug: resolvedProducts.map((p) => p.slug).join('+'),
    });

    // Generate a private signed download link for every item in this order.
    const itemLinks = await Promise.all(
      resolvedProducts.map(async (p) => {
        const url = await createSignedDownloadUrl(p.storagePath, p.storageBucket, 3600);
        return {
          id: p.id,
          name: p.name,
          fileName: p.fileName,
          url: url || `${process.env.APP_URL || 'https://scentstack.store'}/thank-you?product=${p.id}`,
        };
      })
    );

    if (itemLinks.length === 1) {
      markOrder(orderId, {
        secure_download_url: itemLinks[0].url,
        download_created_at: new Date().toISOString(),
      });
    }

    const emailResult = resolvedProducts.length > 1
      ? await sendCartDownloadEmail({
          to: emailAddress,
          items: itemLinks,
          amount: `${currency} $${normalizedAmount}`,
          idempotencyKey: orderId,
        })
      : await sendDownloadEmail({
          to: emailAddress,
          productName: resolvedProducts[0].name,
          fileName: resolvedProducts[0].fileName,
          downloadUrl: itemLinks[0].url,
          amount: `${currency} $${normalizedAmount}`,
          idempotencyKey: orderId,
        });

    if (emailResult.ok) {
      markOrder(orderId, { email_sent: true, email_sent_at: new Date().toISOString() });
    } else {
      markOrder(orderId, { email_sent: false, email_error: emailResult.reason || 'EMAIL_FAILED' });
    }

    return res.status(200).json({
      ok: true,
      orderId,
      productIds: resolvedProducts.map((p) => p.id),
      paymentStatus: 'paid',
      amount: normalizedAmount,
      currency,
      downloadUrl: itemLinks.length === 1 ? itemLinks[0].url : null,
      emailSent: emailResult.ok,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Payment could not be completed.' });
  }
}
