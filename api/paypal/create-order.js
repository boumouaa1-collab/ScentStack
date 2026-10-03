import { getProduct } from '../lib/products.js';
import { getPaypalAccessToken, paypalRequest } from '../lib/paypal.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { productId, productIds, customerEmail } = req.body || {};

  // Accept either a single productId (legacy, still used by direct "Buy Now" buttons)
  // or a productIds array (cart checkout with multiple items).
  const ids = Array.isArray(productIds) && productIds.length > 0
    ? productIds
    : (productId ? [productId] : []);

  const resolvedProducts = ids.map((id) => getProduct(id)).filter(Boolean);

  if (resolvedProducts.length === 0) {
    return res.status(400).json({ message: 'Invalid product selected.' });
  }

  const currency = resolvedProducts[0].currency || 'USD';
  const itemTotal = resolvedProducts.reduce((sum, p) => sum + Number(p.price), 0).toFixed(2);

  try {
    const accessToken = await getPaypalAccessToken();
    const order = await paypalRequest('/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: resolvedProducts.map((p) => p.id).join('+'),
            description: resolvedProducts.map((p) => p.name).join(', ').slice(0, 125),
            custom_id: JSON.stringify(resolvedProducts.map((p) => p.id)).slice(0, 127),
            amount: {
              currency_code: currency,
              value: itemTotal,
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: itemTotal,
                },
              },
            },
            items: resolvedProducts.map((p) => ({
              name: p.name,
              unit_amount: {
                currency_code: p.currency || 'USD',
                value: Number(p.price).toFixed(2),
              },
              quantity: '1',
              category: 'DIGITAL_GOODS',
            })),
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

    return res.status(200).json({ id: order.id, status: order.status });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create PayPal order.' });
  }
}
