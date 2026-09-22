export function createSupportEmail({ issue, message, clientEmail }) {
  const safeIssue = escapeHtml(issue);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const safeClientEmail = escapeHtml(clientEmail);

  return `
    <div style="margin:0;background:#f7f1e8;padding:32px 16px;font-family:Arial,sans-serif;color:#2b2522;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2d3bd;border-radius:18px;overflow:hidden;">
        <div style="background:#4a1c2c;padding:30px 34px;">
          <div style="color:#f7f1e8;font-family:Georgia,serif;font-size:28px;letter-spacing:.02em;">Scent Stack</div>
          <div style="margin-top:8px;color:#d9c7b0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">Customer support</div>
        </div>
        <div style="padding:34px;">
          <div style="color:#b08d57;font-size:11px;font-weight:bold;letter-spacing:.18em;text-transform:uppercase;">New message 💌</div>
          <h1 style="margin:10px 0 24px;color:#4a1c2c;font-family:Georgia,serif;font-size:27px;font-weight:normal;line-height:1.2;">A customer needs your help ✨</h1>
          <div style="border-left:3px solid #b08d57;background:#f7f1e8;padding:16px 18px;">
            <div style="color:#806b55;font-size:11px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;">Issue selected</div>
            <div style="margin-top:7px;color:#4a1c2c;font-size:16px;font-weight:bold;">${safeIssue}</div>
          </div>
          <div style="margin-top:18px;color:#806b55;font-size:13px;">Customer email 📧: <a href="mailto:${safeClientEmail}" style="color:#4a1c2c;font-weight:bold;">${safeClientEmail}</a></div>
          <div style="margin-top:24px;">
            <div style="color:#806b55;font-size:11px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;">Customer message</div>
            <div style="margin-top:9px;color:#2b2522;font-size:16px;line-height:1.7;">${safeMessage}</div>
          </div>
          <div style="margin-top:30px;border-top:1px solid #eadfce;padding-top:18px;color:#806b55;font-size:13px;line-height:1.6;">
            Reply to this email to respond directly to the customer.
          </div>
        </div>
        <div style="border-top:1px solid #eadfce;background:#efe4d4;padding:18px 34px;color:#806b55;font-size:12px;line-height:1.5;">
          Scent Stack &middot; Premium digital fragrance tools<br />Sent from the website support chat
        </div>
      </div>
    </div>
  `;
}

export function createSupportAcknowledgement({ issue }) {
  const safeIssue = escapeHtml(issue);

  return `
    <div style="margin:0;background:#f7f1e8;padding:32px 16px;font-family:Arial,sans-serif;color:#2b2522;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2d3bd;border-radius:18px;overflow:hidden;">
        <div style="background:#4a1c2c;padding:30px 34px;">
          <div style="color:#f7f1e8;font-family:Georgia,serif;font-size:28px;letter-spacing:.02em;">Scent Stack</div>
          <div style="margin-top:8px;color:#d9c7b0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">Support received</div>
        </div>
        <div style="padding:34px;">
          <div style="color:#b08d57;font-size:11px;font-weight:bold;letter-spacing:.18em;text-transform:uppercase;">Thank you for reaching out 💌</div>
          <h1 style="margin:10px 0 18px;color:#4a1c2c;font-family:Georgia,serif;font-size:29px;font-weight:normal;line-height:1.2;">We have received your message.</h1>
          <p style="margin:0;color:#2b2522;font-size:16px;line-height:1.7;">Your support request about <strong style="color:#4a1c2c;">${safeIssue}</strong> is safely with our team. We will review it and reply to you as soon as possible.</p>
          <div style="margin-top:26px;border-left:3px solid #b08d57;background:#f7f1e8;padding:16px 18px;color:#806b55;font-size:14px;line-height:1.6;">You can simply reply to this email if you need to add more details ✨</div>
        </div>
        <div style="border-top:1px solid #eadfce;background:#efe4d4;padding:18px 34px;color:#806b55;font-size:12px;line-height:1.5;">Scent Stack &middot; Premium digital fragrance tools<br />Thank you for your patience.</div>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[character]));
}
