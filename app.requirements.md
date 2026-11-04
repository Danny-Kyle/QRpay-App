## QRpay-App

### Local setup

- Install Node.js and npm. Use Node.js 24 for the verification commands below.
- Start MongoDB locally or use a development MongoDB database.
- Copy `api/.env.example` to `api/.env`. Set `MONGO_URI` and a unique `JWT_SECRET`. For registration email, verification and password reset, configure a Brevo SMTP login and verified `SENDER_EMAIL`.
- In `api`, run `npm ci` and `npm start`. The API defaults to port 4000.
- In `client`, run `npm ci` and `npm run dev`. Open the URL Vite prints. The client defaults to `http://localhost:4000` for its API. Set `VITE_BACKEND_URL` in `client/.env` when targeting another API.
- Run `npm run build` in `client` to build the static frontend.

### Portfolio demo

Add items from one vendor, open checkout, and scan the QR code to open the demo information page. Use **Simulate checkout** on the device with the cart to see a sample receipt. The demo does not collect money, update wallet balances, or create orders. The QR code contains only the demo page URL. A second device needs a reachable frontend URL, such as a hosted preview. Vercel needs the `client` directory as its project root so the route rewrite applies.
