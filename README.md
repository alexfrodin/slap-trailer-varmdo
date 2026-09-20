# Släp & Trailer Värmdö

Static marketing site for a local trailer workshop on Värmdö, Sweden.

Stack: Astro, TypeScript, Tailwind CSS, Vercel. Visible copy is Swedish. Business facts live in `src/data/site.ts`.

See `IMPLEMENTATION_PLAN.md` for architecture, SEO, and launch checklist.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` — local server
- `npm run check` — Astro / TypeScript
- `npm run build` — typecheck + production build
- `npm run preview` — preview the build

## Configuration

Replace every `[PLACEHOLDER]` in `src/data/site.ts` before launch:

- legal company name and organisation number
- phone, email, address, coordinates
- opening hours
- Google Maps directions URL

Environment variables are documented in `.env.example`. The contact form needs Resend and Cloudflare Turnstile in production. In `astro dev`, submissions can succeed without email so the flow can be tested.

## Deploy

Connect the GitHub repo to Vercel (Astro preset, Node 22). Set production env vars and `PUBLIC_SITE_URL` to the live origin without a trailing slash.

Canonical domain is expected to be `https://slapochtrailervarmdo.se` (apex). Point DNS at Vercel and verify the sending domain in Resend.

## Content

- `src/data/site.ts` — NAP, legal line, hours
- `src/data/services.ts` — six service pages
- `src/data/home.ts` — homepage and chrome copy

Do not add stock photos. Add real workshop images under `src/assets/photos/` when they exist.
