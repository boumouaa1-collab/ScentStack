import { registerWebhookEvent, createOrderRecord, getOrderRecord, markOrder } from '../lib/store.js';
import { paypalRequest, verifyWebhook } from '../lib/paypal.js';
import { createSignedDownloadUrl } from '../lib/supabase.js';
import { sendDownloadEmail } from '../lib/email.js';
import { getProduct, productCatalog } from '../lib/products.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const event = req.body || {};
  const headers = req.headers || {};
  const eventId = event && (event.id || event.resource?.id || event.event_version || event.resource?.purchase_units?.[0]?.reference_id);

  if (!eventId) {
    return res.status(400).json({ message: 'Missing webhook event id.' });
  }

  try {
    const valid = await verifyWebhook(event, headers);
    if (!valid) {
      return res.status(401).json({ message: 'Signature verification failed.' });
    }

    if (!registerWebhookEvent(event.id || event.resource?.id || event.event_version, event)) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    const eventType = event.event_type;
    const resource = event.resource || {};
    const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id || resource.purchase_units?.[0]?.reference_id || resource.invoice_id;
    let paypalOrder = null;
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED' && orderId) {
      paypalOrder = await paypalRequest(`/v2/checkout/orders/${orderId}`, { method: 'GET' }).catch(() => null);
    }

    const purchaseUnit = paypalOrder?.purchase_units?.[0] || resource.purchase_units?.[0] || {};
    const productReference =
      resource.custom_id ||
      purchaseUnit.custom_id ||
      resource.reference_id ||
      purchaseUnit.reference_id;
    const product =
      (productReference && getProduct(productReference)) ||
      Object.values(productCatalog).find((item) => item.hostedButtonId === productReference) ||
      null;
    let order = orderId ? getOrderRecord(orderId) : null;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const capture = resource || {};
      const capturedAmount = capture.amount?.value || purchaseUnit.amount?.value || product?.price || 0;
      const emailAddress = order?.customer_email || resource.payer?.email_address || paypalOrder?.payer?.email_address || '';

      if (!order && product && orderId) {
        order = createOrderRecord({
          id: orderId,
          paypal_order_id: orderId,
          paypal_capture_id: capture.id || orderId,
          product_id: product.id,
          product_name: product.name,
          amount: Number(capturedAmount).toFixed(2),
          currency: capture.amount?.currency_code || product.currency || 'USD',
          customer_email: emailAddress,
          payment_status: 'paid',
          fulfillment_status: 'fulfilled',
          email_sent: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product_slug: product.slug,
        });
      }

      if (order) {
        markOrder(orderId, {
          payment_status: 'paid',
          fulfillment_status: 'fulfilled',
          amount: capturedAmount,
          customer_email: emailAddress,
        });
      }

      if (product) {
        const signedUrl = await createSignedDownloadUrl(product.storagePath, product.storageBucket, 3600);
        if (signedUrl) {
          if (order) {
            markOrder(orderId, { secure_download_url: signedUrl, download_created_at: new Date().toISOString() });
          }
        }

        if (order && emailAddress && !order.email_sent) {
          const emailResult = await sendDownloadEmail({
            to: emailAddress,
            productName: product.name,
            fileName: product.fileName,
            downloadUrl: signedUrl || `${process.env.APP_URL || 'https://scentstack.store'}/thank-you?product=${product.id}`,
            amount: `$${Number(capturedAmount).toFixed(2)} USD`,
            idempotencyKey: orderId,
          });
          markOrder(orderId, {
            email_sent: !!emailResult.ok,
            email_sent_at: emailResult.ok ? new Date().toISOString() : null,
            email_error: emailResult.ok ? null : emailResult.reason || 'EMAIL_FAILED',
          });
        }
      }
    }

    if (eventType === 'PAYMENT.CAPTURE.DENIED' || eventType === 'CHECKOUT.PAYMENT-APPROVAL.REVERSED' || eventType === 'PAYMENT.CAPTURE.REVERSED' || eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      if (orderId) {
        markOrder(orderId, { payment_status: 'payment_failed', fulfillment_status: 'refunded' });
      }
    }

    if (eventType === 'PAYMENT.CAPTURE.PENDING') {
      if (orderId) {
        markOrder(orderId, { payment_status: 'payment_pending', fulfillment_status: 'pending' });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Webhook processing failed.' });
  }
}
