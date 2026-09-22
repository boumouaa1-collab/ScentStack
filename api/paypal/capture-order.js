import { getProduct } from '../lib/products.js';
import { createOrderRecord, getOrderRecord, markOrder } from '../lib/store.js';
import { paypalRequest } from '../lib/paypal.js';
import { createSignedDownloadUrl } from '../lib/supabase.js';
import { sendDownloadEmail } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { orderId, productId, customerEmail } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ message: 'Missing PayPal order id.' });
  }

  const product = getProduct(productId);
  if (!product) {
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

    const normalizedAmount = Number(amount || product.price).toFixed(2);
    const existing = getOrderRecord(orderId);
    const emailAddress = customerEmail || captureResult.payer?.email_address || existing?.customer_email || 'unknown@example.com';

    createOrderRecord({
      id: orderId,
      paypal_order_id: orderId,
      paypal_capture_id: capture?.id || orderId,
      product_id: product.id,
      product_name: product.name,
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
      product_slug: product.slug,
    });

    const downloadUrl = await createSignedDownloadUrl(product.storagePath, product.storageBucket, 3600);
    if (downloadUrl) {
      markOrder(orderId, {
        secure_download_url: downloadUrl,
        download_created_at: new Date().toISOString(),
      });
    }

    const emailResult = await sendDownloadEmail({
      to: emailAddress,
      productName: product.name,
      fileName: product.fileName,
      downloadUrl: downloadUrl || `${process.env.APP_URL || 'https://scentstack.store'}/thank-you?product=${product.id}`,
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
      productId: product.id,
      paymentStatus: 'paid',
      amount: normalizedAmount,
      currency,
      downloadUrl,
      emailSent: emailResult.ok,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Payment could not be completed.' });
  }
}
