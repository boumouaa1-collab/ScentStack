import { resolveOrder } from '../lib/products.js';
import { getPaypalAccessToken, paypalRequest } from '../lib/paypal.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { productId, productIds, customerEmail } = req.body || {};

  // Accept either a single productId (Buy Now / bundle / test) or a productIds array (cart).
  const ids = Array.isArray(productIds) && productIds.length > 0
    ? productIds
    : (productId ? [productId] : []);

  // Prices always come from the server catalog — the browser never decides what things cost.
  const order = resolveOrder(ids);
  if (order.products.length === 0) {
    return res.status(400).json({ message: 'Invalid product selected.' });
  }

  const currency = order.products[0].currency || 'USD';
  const itemTotal = order.total.toFixed(2);
  const description = order.isBundle
    ? 'Build Your Complete Scent Stack (6 workbooks)'
    : order.products.map((p) => p.name).join(', ').slice(0, 125);
  const items = order.isBundle
    ? [{
        name: 'Build Your Complete Scent Stack',
        unit_amount: { currency_code: currency, value: itemTotal },
        quantity: '1',
        category: 'DIGITAL_GOODS',
      }]
    : order.products.map((p) => ({
        name: p.name,
        unit_amount: { currency_code: p.currency || 'USD', value: Number(p.price).toFixed(2) },
        quantity: '1',
        category: 'DIGITAL_GOODS',
      }));

  try {
    const accessToken = await getPaypalAccessToken();
    const paypalOrder = await paypalRequest('/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            // `ref` (e.g. "discovery,journal" or "bundle") is what capture-order trusts later.
            reference_id: order.ref,
            custom_id: order.ref,
            description,
            amount: {
              currency_code: currency,
              value: itemTotal,
              breakdown: {
                item_total: { currency_code: currency, value: itemTotal },
              },
            },
            items,
          },
        ],
        application_context: {
          brand_name: 'Scent Stack',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          return_url: `${process.env.APP_URL || 'https://scentstack.store'}/success`,
          cancel_url: `${process.env.APP_URL || 'https://scentstack.store'}/checkout`,
        },
        payer: customerEmail ? { email_address: customerEmail } : undefined,
      }),
    });

    return res.status(200).json({ id: paypalOrder.id, status: paypalOrder.status });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create PayPal order.' });
  }
}
