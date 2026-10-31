# Shuktara Transport Agency — core platform
Next.js 15 · TypeScript strict · Tailwind · Supabase. EN/BN routes at `/en` and `/bn`.

## Setup
1. `npm install`; copy `.env.example` to `.env.local` and fill in values.
2. Create a Supabase project; run `supabase/migrations/0001_init.sql` then `0002_site_content.sql` in the SQL editor (optionally `seed.sql`, dev only).
3. `npm run dev`.

## First admin
Create a user in Supabase Auth, then in SQL: `insert into user_roles(user_id, role) values ('<uuid>', 'admin');`

## Modes
- No Supabase env: tracking only answers the demo ID `SHK-DEMO000000` (labelled as demo); quotes return 503 and are never reported as sent.
- With env: tracking reads real shipments through a column whitelist; quotes are stored in `quote_requests`.

## Admin
`/admin` (sign in with the Supabase Auth user you granted a role). Dashboard counts, shipments (create, search, paginate, add events, auto-delivered timestamp) and quote inquiries (filter, status, internal notes). Every action re-checks the session and `user_roles` server-side and writes `admin_activity_logs`. Admin UI is English only.

## Not yet built
Fleet/services/testimonial/content/user-role admin modules (content still lives in `src/data`), photography. Legal pages are drafts needing legal review. Nothing here has been installed, built or run.

## Map & tests
`/network` uses Leaflet; set `NEXT_PUBLIC_MAP_TILE_URL` to change the tile provider (default CARTO dark, OSM data; check the provider's usage terms for production). Locations and routes in `src/data/network.ts` are ILLUSTRATIVE only; replace with the verified network. `npm test` runs Vitest unit/route tests; `npx playwright install` then `npm run test:e2e` runs the browser tests.

## Email, stats, testimonials
Set `RESEND_API_KEY`, `RESEND_FROM` (verified sender) and `QUOTE_NOTIFY_EMAIL` to get quote notifications; quotes are saved first, so email failure never loses one. Homepage stats and testimonials come from `src/data/stats.ts` and stay hidden until you add verified values and set `published: true`.

## Content & users (admin)
`/admin/content` edits stats, testimonials and company details (validated JSON, falls back to `src/data` when unset). `/admin/users` (admin role only) grants/revokes roles for existing Supabase Auth users. Services, fleet and industries are also editable there (run migration `0003_content_keys.sql`).

## Logo & photography
`public/logo-*.svg` (symbol, primary, light-background, mono). Wordmark text is live text with a font fallback: convert to outlines in a design tool before print use. The site ships with generated placeholder artwork (`public/images/{hero,road,marine,port,industrial,warehouse}.svg`), NOT real photographs. To use real photos, add a `.jpg` with the same name (e.g. `hero.jpg`); it takes precedence automatically. Motion: Framer Motion reveals + GSAP hero parallax, all disabled under prefers-reduced-motion.
