# Hunny Sindhakar — Portfolio

Portfolio website for Hunny Sindhakar, UI/UX designer. The design concept is "The Canvas": the site looks and behaves like a design workspace.

- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Supabase (Postgres, Auth, Storage), Vercel
- **Content:** every text and image lives in Supabase and is edited at `/admin`. No code change is needed for content updates.
- **SEO / AEO / GEO:** metadata and Open Graph images per page, JSON-LD (Person, ProfilePage, CreativeWork, FAQPage, Breadcrumb), `sitemap.xml`, `robots.txt` that welcomes AI crawlers, `llms.txt` and `llms-full.txt` generated from live data.
- **Analytics:** Firebase Analytics (GA4 measurement ID) and Microsoft Clarity, production only.

The full plan is in [`doc/BUILD_PLAN.md`](doc/BUILD_PLAN.md).

## Local development

```bash
pnpm install
cp .env.example .env.local   # fill in the values
pnpm dev                     # http://localhost:3000
```

## Database

```bash
pnpm db:migrate                       # apply supabase/migrations/*.sql (idempotent)
pnpm db:seed                          # (re)load initial content + images; overwrites content tables
pnpm admin:create <email> [password]  # create/reset an admin login
```

`pnpm db:seed` replaces all content with the initial data. Don't run it after real edits have been made in `/admin`.

## Admin

The admin panel lives at a secret URL, `/<NEXT_PUBLIC_ADMIN_PATH>` (for example `/studio-8f3k2q`), so it can't be found by guessing. Direct `/admin` requests return 404. Without the env var (local only) the panel falls back to `/admin`. To move it, change the variable and redeploy.

Signing in needs a Supabase Auth user listed in `public.admins`. Row Level Security allows public reads of published content only, and writes for admins only. Every save expires the content cache, so the live site updates on the next visit.

## Deploy (Vercel)

1. Import the GitHub repo in Vercel and name the project `hunny-sindhakar`, so the site is served at `hunny-sindhakar.vercel.app`.
2. Add the environment variables from `.env.example`. `DATABASE_URL` is not needed on Vercel.
3. Deploy. The daily cron in `vercel.json` pings `/api/keepalive` so the free Supabase project never pauses.
