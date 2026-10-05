export async function sendDownloadEmail({ to, productName, fileName, downloadUrl, amount, idempotencyKey }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';

  if (!apiKey) {
    return { ok: false, reason: 'EMAIL_NOT_CONFIGURED' };
  }

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { ok: false, reason: 'CUSTOMER_EMAIL_MISSING' };
  }

  const safeProductName = escapeHtml(productName);
  const safeFileName = escapeHtml(fileName || 'digital product file');
  const safeDownloadUrl = escapeHtml(downloadUrl);
  const safeAmount = escapeHtml(amount);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': `download-email/${idempotencyKey}` } : {}),
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${productName} is ready to download | Scent Stack`,
      text: `Thank you for your purchase. Your ${productName} is ready. Download it here: ${downloadUrl}\n\nFile: ${fileName || 'digital product file'}\nAmount: ${amount}\n\nThis secure link expires in 7 days.`,
      html: `
        <div style="margin:0;background:#f7f1e8;padding:32px 16px;font-family:Arial,sans-serif;color:#2b2522;">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2d3bd;border-radius:18px;overflow:hidden;">
            <div style="background:#4a1c2c;padding:30px 34px;">
              <div style="color:#f7f1e8;font-family:Georgia,serif;font-size:28px;letter-spacing:.02em;">Scent Stack</div>
              <div style="margin-top:8px;color:#d9c7b0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">Your digital delivery</div>
            </div>
            <div style="padding:34px;">
              <div style="color:#b08d57;font-size:11px;font-weight:bold;letter-spacing:.18em;text-transform:uppercase;">Purchase confirmed</div>
              <h1 style="margin:10px 0 18px;color:#4a1c2c;font-family:Georgia,serif;font-size:29px;font-weight:normal;line-height:1.2;">Your Scent Stack is ready ✨</h1>
              <p style="margin:0;color:#2b2522;font-size:16px;line-height:1.7;">Thank you for your purchase. Your digital product is ready to enjoy.</p>
              <div style="margin-top:26px;border-left:3px solid #b08d57;background:#f7f1e8;padding:16px 18px;">
                <div style="color:#806b55;font-size:11px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;">Your product</div>
                <div style="margin-top:7px;color:#4a1c2c;font-size:17px;font-weight:bold;">${safeProductName}</div>
                <div style="margin-top:7px;color:#806b55;font-size:13px;">File: ${safeFileName}<br />Amount: ${safeAmount}</div>
              </div>
              <div style="margin-top:28px;text-align:center;">
                <a href="${safeDownloadUrl}" style="display:inline-block;background:#b08d57;color:#ffffff;text-decoration:none;border-radius:999px;padding:15px 26px;font-size:13px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;">Download your product</a>
              </div>
              <p style="margin:24px 0 0;color:#806b55;font-size:13px;line-height:1.6;">This secure download link expires in 7 days. Please download and save your file. If you have any problem accessing it, contact Scent Stack support.</p>
            </div>
            <div style="border-top:1px solid #eadfce;background:#efe4d4;padding:18px 34px;color:#806b55;font-size:12px;line-height:1.5;">Scent Stack &middot; Premium digital fragrance tools<br />Thank you for being here.</div>
          </div>
        </div>
      `,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { ok: false, reason: payload.message || 'EMAIL_FAILED' };
  }

  return { ok: true, id: payload.id || null };
}

export async function sendBundleDownloadEmail({ to, items, amount, idempotencyKey }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';

  if (!apiKey) return { ok: false, reason: 'EMAIL_NOT_CONFIGURED' };
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { ok: false, reason: 'CUSTOMER_EMAIL_MISSING' };

  const safeAmount = escapeHtml(amount);
  const rows = items
    .map(
      (item) => `
        <div style="margin-top:14px;border-left:3px solid #b08d57;background:#f7f1e8;padding:14px 16px;">
          <div style="color:#4a1c2c;font-size:15px;font-weight:bold;">${escapeHtml(item.name)}</div>
          <a href="${escapeHtml(item.url)}" style="display:inline-block;margin-top:8px;background:#b08d57;color:#ffffff;text-decoration:none;border-radius:999px;padding:10px 20px;font-size:12px;font-weight:bold;letter-spacing:.1em;text-transform:uppercase;">Download</a>
        </div>`
    )
    .join('');
  const textLinks = items.map((item) => `${item.name}: ${item.url}`).join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': `bundle-email/${idempotencyKey}` } : {}),
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Your complete Scent Stack bundle is ready | Scent Stack`,
      text: `Thank you for your purchase. All six of your workbooks are ready:\n\n${textLinks}\n\nAmount: ${amount}\n\nEach link expires in 7 days.`,
      html: `
        <div style="margin:0;background:#f7f1e8;padding:32px 16px;font-family:Arial,sans-serif;color:#2b2522;">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2d3bd;border-radius:18px;overflow:hidden;">
            <div style="background:#4a1c2c;padding:30px 34px;">
              <div style="color:#f7f1e8;font-family:Georgia,serif;font-size:28px;letter-spacing:.02em;">Scent Stack</div>
              <div style="margin-top:8px;color:#d9c7b0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">Your complete bundle</div>
            </div>
            <div style="padding:34px;">
              <div style="color:#b08d57;font-size:11px;font-weight:bold;letter-spacing:.18em;text-transform:uppercase;">Purchase confirmed</div>
              <h1 style="margin:10px 0 18px;color:#4a1c2c;font-family:Georgia,serif;font-size:29px;font-weight:normal;line-height:1.2;">All six workbooks, ready ✨</h1>
              <p style="margin:0;color:#2b2522;font-size:16px;line-height:1.7;">Thank you for your purchase (${safeAmount}). Here is every file in your bundle:</p>
              ${rows}
              <p style="margin:24px 0 0;color:#806b55;font-size:13px;line-height:1.6;">Each secure link expires in 7 days. Please download and save your files. If you have any problem accessing them, contact Scent Stack support.</p>
            </div>
            <div style="border-top:1px solid #eadfce;background:#efe4d4;padding:18px 34px;color:#806b55;font-size:12px;line-height:1.5;">Scent Stack &middot; Premium digital fragrance tools<br />Thank you for being here.</div>
          </div>
        </div>
      `,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, reason: payload.message || 'EMAIL_FAILED' };
  return { ok: true, id: payload.id || null };
}

export async function sendCartDownloadEmail({ to, items, amount, idempotencyKey }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';

  if (!apiKey) return { ok: false, reason: 'EMAIL_NOT_CONFIGURED' };
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { ok: false, reason: 'CUSTOMER_EMAIL_MISSING' };

  const safeAmount = escapeHtml(amount);
  const rows = items
    .map(
      (item) => `
        <div style="margin-top:14px;border-left:3px solid #b08d57;background:#f7f1e8;padding:14px 16px;">
          <div style="color:#4a1c2c;font-size:15px;font-weight:bold;">${escapeHtml(item.name)}</div>
          <a href="${escapeHtml(item.url)}" style="display:inline-block;margin-top:8px;background:#b08d57;color:#ffffff;text-decoration:none;border-radius:999px;padding:10px 20px;font-size:12px;font-weight:bold;letter-spacing:.1em;text-transform:uppercase;">Download</a>
        </div>`
    )
    .join('');
  const textLinks = items.map((item) => `${item.name}: ${item.url}`).join('\n');
  const itemCount = items.length;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': `cart-email/${idempotencyKey}` } : {}),
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Your ${itemCount} Scent Stack downloads are ready | Scent Stack`,
      text: `Thank you for your purchase. Your ${itemCount} items are ready:\n\n${textLinks}\n\nAmount: ${amount}\n\nEach link expires in 7 days.`,
      html: `
        <div style="margin:0;background:#f7f1e8;padding:32px 16px;font-family:Arial,sans-serif;color:#2b2522;">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2d3bd;border-radius:18px;overflow:hidden;">
            <div style="background:#4a1c2c;padding:30px 34px;">
              <div style="color:#f7f1e8;font-family:Georgia,serif;font-size:28px;letter-spacing:.02em;">Scent Stack</div>
              <div style="margin-top:8px;color:#d9c7b0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">Your digital delivery</div>
            </div>
            <div style="padding:34px;">
              <div style="color:#b08d57;font-size:11px;font-weight:bold;letter-spacing:.18em;text-transform:uppercase;">Purchase confirmed</div>
              <h1 style="margin:10px 0 18px;color:#4a1c2c;font-family:Georgia,serif;font-size:29px;font-weight:normal;line-height:1.2;">Your ${itemCount} items are ready ✨</h1>
              <p style="margin:0;color:#2b2522;font-size:16px;line-height:1.7;">Thank you for your purchase (${safeAmount}). Here is every file from your order:</p>
              ${rows}
              <p style="margin:24px 0 0;color:#806b55;font-size:13px;line-height:1.6;">Each secure link expires in 7 days. Please download and save your files. If you have any problem accessing them, contact Scent Stack support.</p>
            </div>
            <div style="border-top:1px solid #eadfce;background:#efe4d4;padding:18px 34px;color:#806b55;font-size:12px;line-height:1.5;">Scent Stack &middot; Premium digital fragrance tools<br />Thank you for being here.</div>
          </div>
        </div>
      `,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, reason: payload.message || 'EMAIL_FAILED' };
  return { ok: true, id: payload.id || null };
}

export async function sendUnmatchedPurchaseAlert({ orderId, amount, customerEmail, debugInfo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';
  const to = process.env.SUPPORT_EMAIL;
  if (!apiKey || !to) return { ok: false, reason: 'NOT_CONFIGURED' };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `⚠️ Unmatched Scent Stack payment — manual fulfillment needed (order ${orderId})`,
      text: `A payment came in that could not be automatically matched to a product, so no delivery email was sent.\n\nOrder ID: ${orderId}\nAmount: ${amount}\nCustomer email: ${customerEmail || 'unknown'}\n\nDebug info: ${JSON.stringify(debugInfo)}\n\nPlease send the correct PDF to this customer manually.`,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  return response.ok ? { ok: true, id: payload.id || null } : { ok: false, reason: payload.message || 'EMAIL_FAILED' };
}

export async function sendFulfillmentAlert({ orderId, amount, customerEmail, problem, links }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>';
  const to = process.env.SUPPORT_EMAIL || 'aymaneelmj@gmail.com';
  if (!apiKey || !to) return { ok: false, reason: 'NOT_CONFIGURED' };

  const linkLines = (links || []).map((item) => `${item.name}: ${item.url}`).join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `⚠️ Scent Stack order needs attention (order ${orderId})`,
      text: `${problem}\n\nOrder ID: ${orderId}\nAmount: ${amount}\nCustomer email: ${customerEmail || 'unknown'}${linkLines ? `\n\nDownload links (valid 7 days):\n${linkLines}` : ''}`,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  return response.ok ? { ok: true, id: payload.id || null } : { ok: false, reason: payload.message || 'EMAIL_FAILED' };
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[character]));
}
