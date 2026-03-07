This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase + Google OAuth

This project includes Supabase and **Google OAuth** (easiest provider to set up).

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy the **Project URL** and **anon** (public) key.

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` – your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – your anon key

### 3. Enable Google in Supabase

1. In the Supabase dashboard: **Authentication → Providers**.
2. Enable **Google** and open the Google provider settings.
3. You’ll need a **Google OAuth Client ID** and **Client Secret** from [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Create an OAuth 2.0 Client ID (Web application).
   - Add **Authorized redirect URI**: `https://<your-project-ref>.supabase.co/auth/v1/callback`  
     (use your Supabase project URL; for local Supabase use `http://127.0.0.1:54321/auth/v1/callback`).
4. Paste the Client ID and Secret into the Supabase Google provider and save.

### 4. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000), click **Sign in with Google**, and complete the flow. The callback route and middleware handle session cookies.
# Mandarin-Language-Learning-Platform
