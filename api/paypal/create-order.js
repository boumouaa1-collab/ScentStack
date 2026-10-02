import { getProduct } from '../lib/products.js';
import { getPaypalAccessToken, paypalRequest } from '../lib/paypal.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { productId, customerEmail } = req.body || {};
  const product = getProduct(productId);

  if (!product) {
    return res.status(400).json({ message: 'Invalid product selected.' });
  }

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
            reference_id: product.id,
            description: product.name,
            custom_id: product.id,
            amount: {
              currency_code: product.currency || 'USD',
              value: Number(product.price).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: product.currency || 'USD',
                  value: Number(product.price).toFixed(2),
                },
              },
            },
            items: [
              {
                name: product.name,
                unit_amount: {
                  currency_code: product.currency || 'USD',
                  value: Number(product.price).toFixed(2),
                },
                quantity: '1',
                category: 'DIGITAL_GOODS',
              },
            ],
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
