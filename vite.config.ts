import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';
import { createSupportAcknowledgement, createSupportEmail } from './api/lib/support-email.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'local-support-api',
        configureServer(server) {
          server.middlewares.use('/api/support', async (request, response, next) => {
            if (request.method !== 'POST') {
              next();
              return;
            }

            const chunks: Buffer[] = [];
            for await (const chunk of request) chunks.push(Buffer.from(chunk));
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
            const message = typeof body.message === 'string' ? body.message.trim() : '';
            const issue = typeof body.issue === 'string' ? body.issue.trim() : 'General support';
            const clientEmail = typeof body.clientEmail === 'string' ? body.clientEmail.trim() : '';

            if (!message || message.length > 2000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
              response.statusCode = 400;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ error: 'Please enter a message up to 2,000 characters.' }));
              return;
            }

            if (!env.RESEND_API_KEY) {
              response.statusCode = 503;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ error: 'Support is not configured on this server yet.' }));
              return;
            }

            const emailResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>',
                to: [env.SUPPORT_EMAIL || 'aymaneelmj@gmail.com'],
                reply_to: clientEmail,
                subject: `Scent Stack support: ${issue.slice(0, 80)}`,
                text: `Issue selected: ${issue}\nCustomer email: ${clientEmail}\n\nMessage:\n${message}`,
                html: createSupportEmail({ issue, message, clientEmail }),
              }),
            });

            if (emailResponse.ok) {
              const acknowledgementResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${env.RESEND_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>',
                  to: [clientEmail],
                  subject: 'We received your Scent Stack support request 💌',
                  text: `Thank you for contacting Scent Stack. We received your message about ${issue} and will reply as soon as possible.`,
                  html: createSupportAcknowledgement({ issue }),
                }),
              }).catch(() => null);

              response.statusCode = 200;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ ok: true, acknowledgementSent: Boolean(acknowledgementResponse?.ok) }));
              return;
            }

            response.statusCode = 502;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({
              ok: emailResponse.ok,
              error: emailResponse.ok ? undefined : 'The support email service rejected this message. Please try again or use the email fallback.',
            }));
          });
          server.middlewares.use('/api/newsletter', async (request, response, next) => {
            if (request.method !== 'POST') {
              next();
              return;
            }
            const chunks: Buffer[] = [];
            for await (const chunk of request) chunks.push(Buffer.from(chunk));
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
            const email = typeof body.email === 'string' ? body.email.trim() : '';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              response.statusCode = 400;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ error: 'Enter a valid email address.' }));
              return;
            }
            if (!env.RESEND_API_KEY) {
              response.statusCode = 503;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ error: 'Newsletter signup is not configured on this server.' }));
              return;
            }
            let contactResult = { ok: true };
            if (env.RESEND_AUDIENCE_ID) {
              const audienceResponse = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(env.RESEND_AUDIENCE_ID)}/contacts`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, unsubscribed: false }),
              });
              contactResult = { ok: audienceResponse.ok };
            }
            if (contactResult.ok) {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  from: env.RESEND_SUPPORT_FROM || 'Scent Stack <onboarding@resend.dev>',
                  to: [env.SUPPORT_EMAIL || 'aymaneelmj@gmail.com'],
                  subject: 'New Scent Stack newsletter subscriber',
                  text: `New subscriber: ${email}`,
                  reply_to: email,
                }),
              }).catch(() => null);
            }
            response.statusCode = contactResult.ok ? 200 : 502;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ ok: contactResult.ok, error: contactResult.ok ? undefined : 'Newsletter signup is temporarily unavailable.' }));
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
