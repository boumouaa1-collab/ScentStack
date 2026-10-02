# Scent Stack

This project is a Vite + React + TypeScript storefront for digital fragrance products. The app has a browser frontend in `src/` and server-side payment and delivery logic under `api/`.

If you are new to the repo, the most important things to know are:

- Frontend pages and UI live in `src/`
- Product catalog and site config live in `src/data/products.ts`
- The checkout/payment flow is handled by the API routes in `api/paypal/`
- Digital delivery, Supabase signed URLs, and email sending live in `api/lib/`
- Local environment variables go in a root-level `.env.local` file
- Production secrets go in your hosting platform (Vercel, Netlify, etc.)

---

## Project structure

```text
scentstack/
+- api/
�  +- lib/
�  �  +- email.js         # Resend email delivery
�  �  +- paypal.js        # PayPal token + request helpers
�  �  +- store.js         # in-memory order storage for local flow
�  �  +- supabase.js      # signed download URLs for digital files
�  +- paypal/
�     +- create-order.js  # create PayPal order
�     +- capture-order.js # capture payment and send delivery
�     +- webhook.js       # verify PayPal webhook events
+- public/
�  +- assets/
�  +- robots.txt
�  +- sitemap.xml
�  +- site.webmanifest
+- src/
�  +- components/
�  +- data/
�  �  +- products.ts      # product catalog, prices, file names, bucket names
�  +- lib/
�  +- pages/
�  +- App.tsx
�  +- main.tsx
�  +- index.css
+- .env.example            # template for required env vars
+- .env.local              # local development settings (do not commit)
+- package.json
+- vercel.json             # rewrites for API + SPA routing
+- vite.config.ts
+- tailwind.config.js
+- eslint.config.js
+- tsconfig.json
+- README.md
```

---

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create your local environment file

On macOS/Linux:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Fill in the values you need for local development

```bash
npm run dev
```

The app should run on the local Vite dev server, usually:

```text
http://localhost:5173
```

4. For a production deploy, put the same variables in your hosting platform (Vercel, etc.)

---

## Environment variables explained

The project uses two kinds of env vars:

- Frontend variables: start with `VITE_` and are accessible in the browser
- Backend variables: are read in Node/server code under `api/` and should stay secret

### Frontend variables

These are used in the React app:

```env
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_SUPPORT_EMAIL=support@yourdomain.com
```

Use these for client-side things like the PayPal JS SDK and UI emails.

### Backend variables

These are used by the API routes in `api/`:

```env
APP_URL=http://localhost:5174
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_SECRET_KEY=your_secret_key

RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_resend_audience_id
RESEND_SUPPORT_FROM=Scent Stack <support@yourdomain.com>
SUPPORT_EMAIL=support@yourdomain.com
```

Important:

- Never put `PAYPAL_CLIENT_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` in `VITE_` variables
- Never commit `.env.local` to Git
- `APP_URL` should be your local dev URL during development and your production domain in deployment
- Resend's `onboarding@resend.dev` sender is limited to the Resend account email. To send support acknowledgments to any client, verify your sending domain in Resend and set `RESEND_SUPPORT_FROM` to an address on that domain. Add the same variable to Vercel.
- Vercel must have `RESEND_API_KEY`, `SUPPORT_EMAIL`, and `RESEND_SUPPORT_FROM` configured for the support chat to work for visitors outside local development. Redeploy after changing environment variables.

### PayPal return URLs

Configure the PayPal Hosted Button success/return URL as follows:

```text
https://scent-stack-pink.vercel.app/thank-you?product=workbook
https://scent-stack-pink.vercel.app/thank-you?product=layering
https://scent-stack-pink.vercel.app/thank-you?product=wardrobe
https://scent-stack-pink.vercel.app/thank-you?product=bundle
```

Use the matching URL for each PayPal product button. The thank-you page is a confirmation view; fulfillment remains protected by verified PayPal capture on the server.

---

## Where to get each key

### 1) PayPal

Go to the PayPal Developer Dashboard:

- Create or open an app under Apps & Credentials
- Copy the Client ID and Secret
- Set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
- For the frontend, also set `VITE_PAYPAL_CLIENT_ID`
- Create a webhook in the dashboard and copy the webhook ID into `PAYPAL_WEBHOOK_ID`

The webhook endpoint for this app should be something like:

```text
https://yourdomain.com/api/paypal/webhook
```

Use `PAYPAL_ENVIRONMENT=sandbox` while testing, and switch to `production` when live.

### 2) Supabase

In your Supabase project:

- Open Project Settings > API
- Copy the project URL
- Copy the Service Role key for server-side signed URLs
- Add the secret key if needed for your current setup

This app uses Supabase Storage for digital files. The bucket name and file path are defined in `src/data/products.ts`.

Typical setup:

- Create a bucket named `digital-products`
- Upload your PDFs there
- Make sure each product's `storageBucket` and `storagePath` match the actual file names

### 3) Resend

For email delivery:

- Create an API key in Resend
- Verify the sending domain or use the default test address
- Set `RESEND_API_KEY` and `EMAIL_FROM`

Example:

```env
RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM=hello@yourdomain.com
```

The app uses these values when sending order confirmation and digital-download emails.

### 4) Vercel / deployment environment

When deploying, put the same env vars in your hosting project settings:

- Vercel Dashboard > Project > Settings > Environment Variables

Add all backend variables there, not only the frontend ones.

---

## Important files to edit

### Product catalog

File:

```text
src/data/products.ts
```

This file controls:

- product titles and pricing
- file names
- storage bucket names
- cover/preview images
- `siteConfig.siteUrl`
- default support email

Update this when you add or change products.

### Site URL

Also in `src/data/products.ts`:

```ts
export const siteConfig = {
  siteUrl: 'https://yourdomain.com',
  ...
};
```

Set this to your real domain before going live.

### Product files in Supabase

The app expects PDFs in a Supabase Storage bucket. Each product entry contains values such as:

```ts
fileName: 'personal-fragrance-workbook.pdf',
storageBucket: 'digital-products',
storagePath: 'personal-fragrance-workbook.pdf',
```

Make sure those match the actual uploaded files.

---

## Local development notes

- `.env.local` is for your machine only
- `api/` functions read environment variables on the backend
- `src/` files read browser-safe variables via `import.meta.env`
- If PayPal is not configured, the checkout page shows a warning from `src/pages/CheckoutPage.tsx`

---

## Production checklist

Before going live, make sure you have:

- [ ] Valid PayPal app credentials
- [ ] PayPal webhook configured and verified
- [ ] Supabase project URL and Service Role key added
- [ ] PDFs uploaded to the correct storage bucket
- [ ] Resend key and verified sending domain configured
- [ ] `APP_URL` set to your production domain
- [ ] `siteConfig.siteUrl` updated in `src/data/products.ts`
- [ ] `.env.local` removed from Git tracking and not used in production

### Test a delivery email without charging a customer

Add a private `TEST_DELIVERY_SECRET` environment variable to Vercel, then send a POST request to the test endpoint. This creates a one-hour Supabase signed URL and sends the same branded email used after a real PayPal payment.

```powershell
$headers = @{ 'x-test-delivery-secret' = 'YOUR_TEST_DELIVERY_SECRET' }
$body = @{ productId = 'workbook'; customerEmail = 'your-email@example.com' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'https://scent-stack-pink.vercel.app/api/test-delivery-email' -Headers $headers -ContentType 'application/json' -Body $body
```

Use `layering`, `wardrobe`, or `bundle` as `productId` to test the other files after uploading them to the `digital-products` bucket. Remove `TEST_DELIVERY_SECRET` from Vercel after testing.

---

## Useful commands

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
```

If you need to debug checkout or delivery setup, start by checking these files:

- `src/pages/CheckoutPage.tsx`
- `api/paypal/create-order.js`
- `api/paypal/capture-order.js`
- `api/paypal/webhook.js`
- `api/lib/paypal.js`
- `api/lib/supabase.js`
- `api/lib/email.js`

That is the core flow for payment, verification, secure download, and email delivery.

---

## Summary

This repo is basically:

- a storefront website in React
- a PayPal checkout flow
- a Supabase-powered digital delivery system
- an email system for download links
- environment variables that must be set correctly in both local and production environments

If you keep your `.env.local` file filled in and make sure the PayPal + Supabase + Resend keys match your live services, the app is ready to test and deploy.
