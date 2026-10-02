# NJP Tour Skardu

Public tour website and admin dashboard for NJP Tour Skardu. The frontend is a React, TypeScript, and Vite single-page app; Supabase provides authentication and the PostgreSQL database.

## Requirements

- Node.js 20 or later
- A Supabase project for bookings, packages, reviews, contact messages, and admin sign-in

## Setup

```powershell
npm ci
Copy-Item .env.example .env.local
```

Set the values in `.env.local` before running the app. The frontend only uses the Supabase project URL and public anon/publishable key; never add a service-role key to a `VITE_` variable.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes for database features | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes for database features | Supabase anon/public key; `VITE_SUPABASE_PUBLISHABLE_KEY` is also accepted by the client |
| `VITE_EASYPAISA_PAYMENT_LINK` | No | Public payment URL used by payment buttons |

## Commands

```powershell
npm run dev
npm run build
npm run preview
```

`npm run build` type-checks the TypeScript app and creates the production site in `dist/`. Deploy the contents of `dist/` to a static host configured to rewrite unknown paths to `index.html` so `/contact` and `/admin/*` work on direct navigation.

## Supabase setup

1. In the Supabase SQL Editor, review and run [`supabase/schema.sql`](supabase/schema.sql). It creates the tables, indexes, and row-level security policies, and adds the current guest-booking fields to an existing `bookings` table; it does not delete table data.
2. Create the administrator through Supabase Auth. Set that user's **app metadata** to `{"role":"admin"}` using a trusted Supabase Dashboard/server-side operation. Do not set this in user-editable metadata.
3. Sign out and back in so the user's JWT contains the admin claim. The dashboard and all admin database policies require this claim.
4. Configure the production site's URL and allowed redirect URLs in Supabase Auth settings.

The browser intentionally has no service-role credential. Public inserts are restricted by RLS; admin reads and mutations require the server-controlled `app_metadata.role` claim.

## Deployment

Configure the three environment variables in the hosting provider's environment settings, run `npm ci` and `npm run build`, then publish `dist/`. Use HTTPS and enable SPA fallback/rewrite behavior. Apply the SQL in the intended Supabase project and verify both an admin account and anonymous public submissions before launch. Configure the payment link only after confirming it is the provider's intended public checkout URL.

There is no separate application server or API in this project; Supabase is the backend. Booking/contact submissions, admin permissions, and review moderation cannot be confirmed against production until the SQL and credentials are configured.