import { productCatalog } from './products.js';

export function getPaypalBaseUrl() {
  const env = (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase();
  return env === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

export async function getPaypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured.');
  }

  const baseUrl = getPaypalBaseUrl();
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error_description || 'PayPal authentication failed.');
  }

  const payload = await response.json();
  return payload.access_token;
}

export async function paypalRequest(path, options = {}) {
  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${getPaypalBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload.error?.message || `PayPal request failed (${response.status}).`;
    throw new Error(message);
  }

  return payload;
}

export async function verifyWebhook(event, reqHeaders) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!webhookId || !clientId || !clientSecret) {
    throw new Error('Webhook configuration is incomplete.');
  }

  const verifyPayload = {
    auth_algo: reqHeaders['paypal-auth-algorithm'],
    cert_url: reqHeaders['paypal-cert-url'],
    transmission_id: reqHeaders['paypal-transmission-id'],
    transmission_sig: reqHeaders['paypal-transmission-sig'],
    transmission_time: reqHeaders['paypal-transmission-time'],
    webhook_id: webhookId,
    webhook_event: event,
  };

  const response = await fetch(`${getPaypalBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verifyPayload),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error_description || 'Webhook verification failed.');
  }

  const payload = await response.json();
  return payload.verification_status === 'SUCCESS';
}

export function ensureValidProductId(productId) {
  if (!productId) return null;
  return productCatalog[productId] ? productId : null;
}
