# ListingMaker — Setup Guide

Everything you need to go from code to live.

---

## 1. Install Dependencies

```bash
cd listingmaker
npm install
```

This installs:
- `firebase` (client-side SDK)
- `firebase-admin` (server-side SDK)
- `@anthropic-ai/sdk` (Claude AI)
- `stripe` (payments)
- All Next.js dependencies

---

## 2. Configure Firebase

### Get Firebase Credentials

1. Go to **Firebase Console** → Your Project (986848086554)
2. Click **Settings icon** → **Project Settings**
3. Under **Your apps**, click your web app (or create one if needed)
4. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId` (should be `986848086554`)
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Set Up Firestore

1. Go to **Firestore Database** in your Firebase Console
2. Click **Create Database** (if you don't have one)
3. Choose **Start in production mode**
4. Choose a region (closest to your users)
5. Once created, go to **Rules** tab and paste the rules from `FIRESTORE_SCHEMA.md`

### Set Up Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google** and add OAuth client ID
4. In **Settings**, add your app domain as an authorized domain

### Get Service Account Key (for server-side)

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate new private key**
3. A JSON file downloads — this is your service account key
4. Keep this **secret** — never commit to git

---

## 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in all Firebase values in `.env.local`:

```env
# Firebase (from step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=986848086554.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=986848086554
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=986848086554.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...:web:abc...

# Server-side (set this when deploying)
# Local: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Anthropic API key (get from https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# Stripe (leave blank for now, set up later)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_BUSINESS=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Set Up Service Account Locally

Create a file `.env.local.secrets` (add to `.gitignore`):

```bash
# Option 1: Point to your service account key file
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

Then before running dev:
```bash
source .env.local.secrets
npm run dev
```

Or copy-paste the JSON content into your terminal:
```bash
export GOOGLE_APPLICATION_CREDENTIALS='{"type": "service_account", ...}'
```

---

## 5. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

**Test the flow:**
1. Click **Try Free** → Sign up with email
2. Go to **/create** → Try creating a listing (will fail without API key)
3. Go to **/dashboard** → See your profile (1 free credit)
4. Test Stripe payment flow (if configured)

---

## 6. Configure Stripe (When Ready)

1. Create Stripe account at https://stripe.com
2. Go to **Products → Create Product**
   - **Starter** — $29.00 (one-time) → copy Price ID
   - **Pro** — $49.00 (one-time) → copy Price ID
   - **Business** — $79.00 (one-time) → copy Price ID
3. Set up webhook: **Developers → Webhooks → Add endpoint**
   - URL: `http://localhost:3000/api/webhooks/stripe` (locally)
   - Events: `checkout.session.completed`
   - Copy the signing secret
4. Add to `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_STARTER=price_...
   STRIPE_PRICE_PRO=price_...
   STRIPE_PRICE_BUSINESS=price_...
   ```
5. Test payment flow on localhost (will fail without valid Stripe keys, that's OK)

---

## 7. Get Anthropic API Key (When Ready)

1. Go to https://console.anthropic.com
2. Create API key
3. Add to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ```

Test it:
- Go to /create → fill form → should work and generate listings

---

## 8. Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com → Import your repo
3. Add environment variables:
   - All `NEXT_PUBLIC_*` values
   - `ANTHROPIC_API_KEY`
   - `STRIPE_SECRET_KEY` and webhook secret
   - **For `GOOGLE_APPLICATION_CREDENTIALS`**: paste your entire service account JSON as one env var (paste the raw JSON)

4. Deploy

After deploy:
- Update Stripe webhook URL to your Vercel domain
- Add your Vercel domain to Firebase authorized domains
- Update `NEXT_PUBLIC_APP_URL` in Vercel env to your domain

---

## File Structure

```
listingmaker/
├── .env.example                    ← Template for env vars
├── .env.local                      ← YOUR local secrets (git ignored)
├── .env.local.secrets              ← Service account key pointer
├── lib/
│   ├── firebase.ts                 ← Firebase client/admin setup
│   ├── auth-context.tsx            ← React auth (Firebase Auth)
│   ├── claude.ts                   ← Anthropic integration
│   ├── stripe.ts                   ← Stripe config
│   └── types.ts                    ← TypeScript types
├── app/
│   ├── layout.tsx                  ← Root + AuthProvider
│   ├── page.tsx                    ← Landing
│   ├── login/                      ← Sign in (Firebase Auth UI)
│   ├── signup/                     ← Create account
│   ├── dashboard/                  ← User dashboard (Firestore)
│   ├── create/                     ← Listing form
│   ├── result/                     ← Generated listing display
│   └── api/
│       ├── generate/               ← AI generation (Anthropic + Firestore)
│       ├── checkout/               ← Stripe Checkout session
│       └── webhooks/stripe/        ← Payment webhook handler
├── components/                     ← Landing page sections
├── FIRESTORE_SCHEMA.md             ← Database structure
└── SETUP.md                        ← This file
```

---

## Troubleshooting

**"Missing GOOGLE_APPLICATION_CREDENTIALS"**
→ Set the env var before starting. Check step 4.

**"Firebase: Error (auth/invalid-credential-object)"**
→ Check that Firebase config values are correct in `.env.local`

**"Stripe: Invalid API Key"**
→ Use test keys (sk_test_...) during development

**"Firestore: Permission denied"**
→ Check Security Rules in Firestore Console match `FIRESTORE_SCHEMA.md`

**"Anthropic: 401 Unauthorized"**
→ Check `ANTHROPIC_API_KEY` is set and valid

---

## Next Steps

Once everything is set up:
1. ✅ npm install
2. ✅ Firebase configured
3. ✅ Environment variables set
4. ✅ Anthropic API key added
5. ✅ Stripe (when ready)
6. ✅ Deploy to Vercel

Then you can:
- Start generating listings
- Track user data in Firestore
- Process payments with Stripe
- Scale to users worldwide
