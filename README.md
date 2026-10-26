# teacup. — React tea store

A responsive, modern and vibrant tea-brand storefront built with React + Vite. Includes a product collection, cart drawer, quantity controls, free-shipping threshold, newsletter interaction, mobile navigation and a Stripe Checkout server integration.

## Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm
- A Stripe account to enable real checkout (test mode is fine)

## Run the storefront locally

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

The storefront UI and cart work without Stripe. Checkout requires the small Express server and Stripe test credentials.

## Enable Stripe Checkout (test mode)

1. Copy `.env.example` to `.env`.
2. In your Stripe Dashboard, open Developers → API keys and copy your **test secret key** (`sk_test_...`) into `.env`.
3. Keep `CLIENT_URL=http://localhost:5173` and `PORT=4242` for local development.
4. In a second terminal, run:

```bash
npm run server
```

5. Keep both terminals running. Add a product to the bag and choose **Continue to secure checkout**. Stripe Checkout will open in test mode. Use Stripe's documented test card, for example `4242 4242 4242 4242`, a future expiry date, any CVC, and any postal code.

**Important:** Never put the Stripe secret key in a `VITE_*` variable or in frontend code. The server validates product IDs and uses its own price catalog. Before going live, add order persistence, fulfillment/email notifications, webhook signature verification, tax/shipping rules, refund handling, and production monitoring.

## Build for production

```bash
npm run build
npm run preview
```

The static production site is generated in `dist/`.

## Deploy the frontend to Vercel (easy option)

1. Create a GitHub repository and push this project.
2. Import the repository at https://vercel.com/new.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. The current Stripe server is a separate Express process. Deploy it as a Node service (for example, Render or Railway), and set:
   - `STRIPE_SECRET_KEY` — production secret key only on the server
   - `CLIENT_URL` — your deployed frontend URL
   - `PORT` — supplied by the hosting provider
5. In Vercel project environment variables, set `VITE_API_URL` to the deployed API base URL (no trailing slash), then redeploy.
6. Update the API's CORS allowlist to your exact frontend domain. Do not use a wildcard for a production store.

## Deploy on AWS Amplify

1. Push the project to GitHub and connect the repository in AWS Amplify Hosting.
2. Build settings:
   - Build command: `npm run build`
   - Artifact directory: `dist`
3. Deploy `server.js` separately to a Node-capable service such as AWS App Runner, ECS, or a suitable Lambda/API Gateway implementation. Amplify static hosting does not run this Express server by itself.
4. Set `VITE_API_URL` to the API URL in Amplify environment variables and redeploy the frontend.
5. Set `STRIPE_SECRET_KEY`, `CLIENT_URL`, and CORS settings on the server environment, not in frontend code.

## Product content and design

- Edit product copy, prices, IDs and image URLs in `src/data.js`.
- The server has a separate price allowlist in `server.js`. Keep IDs and prices aligned when editing products.
- Global styles and responsive breakpoints are in `src/styles.css`.
- Replace the example `hello@teacup.example` address and placeholder social links before launch.
- Images are loaded from Unsplash URLs, and fonts from Google Fonts; use licensed brand-owned assets for a commercial launch.

## Before accepting real payments

This is a launch-ready starter, not a fully operational order-management system. Stripe Checkout session creation is implemented, but you must add a verified Stripe webhook and persist orders before fulfilling paid orders. Test all payment, shipping, tax, privacy, accessibility and consumer-law requirements for your business and region.
