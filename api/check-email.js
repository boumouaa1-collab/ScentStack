import { checkEmail } from '../server/emailCheck.js';

// Lets the checkout page verify an email before the PayPal button appears.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  const result = await checkEmail(req.body?.email);
  return res.status(200).json(result);
}
