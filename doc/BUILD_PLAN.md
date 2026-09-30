# Hunny Sindhakar — Portfolio Build Plan

Source material: `doc/resume-hunny-sindhakar-ui-ux.pdf`, `doc/social.md`.
Date: 2026-10-01.

---

## 1. Concept — "The Canvas"

A UI/UX designer's portfolio should *prove* the craft, not just describe it. The whole site is styled as a live design workspace (Figma-like), while staying real, semantic, fast HTML underneath (important for SEO).

Signature ideas:

1. **Workspace shell** — a thin top toolbar (move / frame / text / comment tools as decoration + real shortcuts), a left "Layers" panel that *is* the navigation (Home, Work, Experience, Toolkit, Writing, Contact). Collapses to a bottom dock on mobile.
2. **Live "Hunny" cursor** — a named multiplayer-style cursor drifts through the hero, "selects" words, drops a sticky-note comment ("Let's create something extraordinary together"). Pauses on `prefers-reduced-motion`.
3. **Inspect mode toggle (`I` key)** — flips the page into Dev-Mode: hovering any element shows spacing redlines, font, color tokens, grid overlay. Shows her design-system thinking in a way no template does.
4. **Case studies as Frames** — each project is a "frame" on an infinite-feel board (drag/scroll on desktop, stacked cards on mobile). Opening a frame zooms into the full case study page.
5. **Before/After slider** for redesigns (e-commerce redesign, website pages).
6. **⌘K command palette** — jump to any project, copy email, download resume, toggle theme, "Ask AI about Hunny".
7. **Lottie micro-interactions** (she uses LottieFiles) — section icons, loading states, contact success.
8. **Light / dark theme** that feels like switching Figma themes; variable fonts + kinetic type in hero.
9. **"Available for work" status badge** — controlled from admin.
10. **Ask-AI footer** — see section 6.

Performance rule: all motion is progressive enhancement. Content renders server-side first; animation JS loads after. Target Lighthouse 100/100/100/100.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (latest, App Router) + TypeScript | SSG/ISR, metadata API, OG image generation, best on Vercel |
| Styling | Tailwind CSS v4 + CSS variables (design tokens) | Tokens drive Inspect mode + theming |
| Motion | Motion (framer-motion), Lenis smooth scroll, lottie-web (light player) | |
| UI (admin) | shadcn/ui | Fast, accessible admin forms |
| DB / Auth / Storage | Supabase (Postgres + RLS, Auth, Storage) | See section 8 |
| Hosting | Vercel | See section 8 |
| Analytics | Firebase Analytics (GA4) + Microsoft Clarity | Events + heatmaps/session replay |
| Email (contact form) | Resend (free 3k/month) | |
| Spam protection | Cloudflare Turnstile | Free, invisible |
| Content validation | Zod | Same schema for seed data, DB and admin forms |

---

## 3. Site Map

| Route | Content |
|---|---|
| `/` | Hero, short "Who is Hunny" answer block, featured work, experience snapshot, toolkit, writing, testimonials, FAQ, contact CTA |
| `/work` | All case studies, filter by type (Web app, Mobile, AI, Branding) |
| `/work/[slug]` | Case study: overview, role, timeline, problem, process, solution, outcome, gallery, next project |
| `/about` | Canonical entity page: bio, journey timeline, education, certifications, languages, photo |
| `/writing` | Medium articles (auto-pulled from Medium RSS, cached) |
| `/contact` | Form + direct links |
| `/resume` | Web resume + PDF download |
| `/llms.txt`, `/llms-full.txt` | Generated from DB |
| `/sitemap.xml`, `/robots.txt` | Generated |
| `/admin/*` | Protected CMS |

Initial case studies from resume (need assets + permission, see section 10):
Botstream (AI document summarizer + chatbot), Polls (Gen-Z dating app), Sport Betting analytics (basketball), PMO Tool, Task Planner, Bombay Softwares website, Taxi app, E-commerce redesign, Matrimonial web app (Melbourne), Immencer HRM (mobile + web), plus a "Graphic Design" archive (Sayaji Advertisers work).

---

## 4. Build Plan — Everything in One Go (Phase 1)

Decision (2026-10-01): Supabase + Vercel are final. Database and admin are built **in Phase 1 together with the design**, not later. Only launch tasks that need a real domain wait until the end.

### Step 1 — Foundation
- Next.js + TypeScript + Tailwind v4, ESLint/Prettier, design tokens, fonts.
- Local Supabase (Supabase CLI + Docker) so development runs **without waiting for cloud keys**. Switching to the cloud project later is only an `.env` change.
- SQL migrations for all tables (section 7), RLS policies, storage buckets.
- Seed script fills the DB with all resume data + placeholder images.

### Step 2 — Public site
- All pages (section 3), Canvas shell, Inspect mode, ⌘K palette, before/after slider, Lottie, light/dark theme.
- Fully responsive for every device class (section 4b).
- Data read from Supabase through a `lib/data/*` layer with cache tags; pages are statically generated.

### Step 3 — Admin panel
- `/admin` with Supabase Auth, all editors (section 7), image upload, drag reorder, draft/publish, live preview, messages inbox.
- Every save calls `revalidateTag()`, so the live site updates in seconds.

### Step 4 — SEO / AEO / GEO + analytics + contact
- Everything in section 5 and 6, generated from DB (metadata, JSON-LD, sitemap, `llms.txt`, OG images).
- Firebase Analytics + Clarity loaders, Resend contact email, Turnstile spam check. Each one is switched on by its env key; with no key it stays off and nothing breaks.

### Step 5 — QA + deploy
- Device matrix test (section 4b), Lighthouse, accessibility (WCAG 2.2 AA), schema validation.
- Deploy to Vercel on the free `*.vercel.app` URL.

### Step 6 — Go-live (needs domain)
- Connect custom domain, Google Search Console, Bing Webmaster Tools, IndexNow.
- Supabase keep-alive cron (daily Vercel Cron).
- Replace placeholder images/text with final content from the admin panel (no developer needed).

---

## 4b. 100% Responsive — All Devices

Approach: mobile-first, fluid layout. No fixed pixel widths; typography and spacing use `clamp()`, layouts use container queries so every component adapts to its own space, not only to the screen.

| Device class | Width | Canvas behaviour |
|---|---|---|
| Small phones (iPhone SE, Galaxy A) | 320–374px | Bottom dock nav, stacked frames, no cursor animation |
| Phones | 375–479px | Same, larger type scale |
| Large phones / foldables folded | 480–767px | 2-column project grid where it fits |
| Tablets portrait (iPad, Tab) | 768–1023px | Collapsible Layers panel, swipeable board |
| Tablets landscape / small laptops | 1024–1279px | Full Canvas shell, Layers panel open |
| Laptops / desktops | 1280–1919px | Full shell + Inspect mode + live cursor |
| Large / ultra-wide monitors | 1920px+ | Content capped at readable width, board uses extra space |
| TV / 4K | 2560px+ | Scaled type, same layout |

Also covered:
- Portrait and landscape; foldables (Galaxy Fold / Z Flip) using the `horizontal-viewport-segments` media query.
- Touch vs mouse: `(hover: hover)` and `(pointer: coarse)` checks. Hover-only features (Inspect mode, custom cursor) turn into tap/long-press or are hidden on touch.
- Notches and home bars: `env(safe-area-inset-*)`; `100dvh` instead of `100vh` so mobile browser bars don't cut content.
- Touch targets at least 44×44px; no horizontal scroll at any width.
- Browsers: Chrome, Safari (iOS + macOS), Firefox, Edge, Samsung Internet — last 2 versions.
- Accessibility modes: keyboard only, screen readers (VoiceOver, TalkBack), 200% zoom, `prefers-reduced-motion`, `prefers-color-scheme`, high contrast / forced colors.
- Slow networks: images sized per device (`srcset`), animation assets lazy-loaded, site usable on 3G.
- Print: `/resume` prints cleanly to A4.

Testing: Playwright screenshot tests across the widths above + real-device checks on at least one iPhone, one Android and one iPad.

---

## 5. SEO + AEO + GEO

"100%" realistically means: every technical and content signal done, Lighthouse SEO 100, zero schema errors. Rankings and AI citations cannot be guaranteed, but this is the full checklist.

### SEO (classic search)
- Server-rendered HTML, one `h1` per page, semantic landmarks.
- Per-page title/description/canonical via Next.js Metadata API (editable from admin).
- Dynamic OG/Twitter images per page and per case study (`opengraph-image.tsx`).
- `sitemap.xml` (auto from DB, with `lastmod`), `robots.txt`.
- Image: `next/image`, AVIF/WebP, descriptive alt text (admin field is required).
- Core Web Vitals: LCP < 1.5s, CLS ≈ 0, INP < 100ms. Fonts self-hosted with `next/font`.
- Internal linking between case studies, clean slugs, 404 page, no broken links.
- Search Console + Bing Webmaster Tools + IndexNow ping on publish.

### AEO (answer engines: Google AI Overviews, featured snippets, voice)
- "Answer-first" blocks: a 40–60 word definitional paragraph at the top of `/` and `/about` ("Hunny Sindhakar is a UI/UX designer based in Ahmedabad, India, currently Executive UI/UX Designer at Bombay Softwares...").
- FAQ section with `FAQPage` schema: "Who is Hunny Sindhakar?", "What tools does she use?", "Is she available for freelance?", "What kind of products has she designed?", etc. (admin-editable).
- Question-shaped H2s in case studies ("What problem did Botstream solve?").
- Structured data (JSON-LD):
  - `Person` (name, jobTitle, worksFor, alumniOf, knowsAbout, knowsLanguage, address, image, `sameAs` LinkedIn/Behance/Medium)
  - `ProfilePage` on `/about`
  - `WebSite` + `Organization`-less personal brand
  - `CreativeWork` per case study, `BreadcrumbList`, `FAQPage`, `Article` for writing.

### GEO (generative engines: ChatGPT, Claude, Perplexity, Gemini)
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, CCBot.
- `/llms.txt` (summary + links) and `/llms-full.txt` (full bio, experience, case study text), generated from DB so always current.
- Entity consistency: same name, title, city and one-line bio across site, LinkedIn, Behance, Medium. (Flag: name is spelled "Sindhakar" but email/Medium use "sindhkar" — keep the site canonical as "Hunny Sindhakar" and mention the variant once in `alternateName` so AI engines merge both.)
- Citable facts: dates, companies, numbers, outcomes written as plain sentences, not only in images.
- Markdown-friendly content, no key text hidden behind JS-only interactions.
- Off-site: update LinkedIn/Behance/Medium bios to link back to the site; optional Wikidata entry later to help a Google Knowledge Panel.

---

## 6. Footer — "Ask AI about Hunny"

Row of AI buttons in the footer (and in the ⌘K palette). Each opens the AI with a prefilled prompt, so visitors see what AI knows about her — and the prompt points AI at the site, which reinforces GEO.

Prompt (editable in admin):
> Who is Hunny Sindhakar, the UI/UX designer from Ahmedabad? Summarize her experience and best work using https://&lt;domain&gt;

| AI | URL pattern |
|---|---|
| ChatGPT | `https://chatgpt.com/?q=<prompt>` |
| Claude | `https://claude.ai/new?q=<prompt>` |
| Perplexity | `https://www.perplexity.ai/search?q=<prompt>` |
| Gemini / Google AI Mode | `https://www.google.com/search?udm=50&q=<prompt>` |
| Grok | `https://grok.com/?q=<prompt>` |
| Copilot | `https://copilot.microsoft.com/?q=<prompt>` |

Each click is tracked as an analytics event (`ask_ai_click`, `ai=<name>`). The list is admin-managed (toggle, reorder, edit URL) in case any provider changes its URL format.

---

## 7. Supabase Schema + Admin

### Tables
- `profile` (single row): name, alternate_name, headline, short_bio, long_bio, answer_block, location, email, photo, resume_pdf, availability_status, languages[]
- `social_links`: platform, url, handle, sort_order, visible
- `projects`: slug, title, client, category, role, timeline, platform, summary, problem, process, solution, outcome, metrics (jsonb), cover, gallery (jsonb), before_after (jsonb), tags[], featured, sort_order, status (draft/published), seo_title, seo_description, og_image
- `experiences`: company, role, location, start, end, bullets[], sort_order
- `education`, `certifications`
- `skills`: group, name, icon, sort_order
- `testimonials`: name, role, company, quote, avatar, visible
- `faqs`: question, answer, page, sort_order
- `ai_links`: name, url_template, icon, enabled, sort_order
- `site_settings`: key/value (default SEO, theme accents, ask-AI prompt, analytics toggles)
- `messages`: contact form submissions (name, email, message, created_at, read)
- `admins`: user_id allowed to write

RLS: public `select` only on published/visible rows; `insert/update/delete` only when `auth.uid()` is in `admins`. `messages`: public insert (through server action with Turnstile), admin read only.

Storage buckets: `media` (public), `resume` (public).

### Admin (`/admin`)
- Login: Supabase Auth magic link / Google, restricted to her email.
- Dashboard: message count, last edits, quick "Availability" toggle.
- Editors: Profile, Projects (with image upload, drag reorder, draft/publish, live preview), Experience, Skills, Testimonials, FAQ, Social links, Ask-AI links, SEO settings, Resume upload, Messages inbox.
- Each save revalidates affected pages and regenerates `llms.txt` / sitemap. No developer needed for content updates.

---

## 8. DB + Hosting Decision

### Database: Supabase vs Firebase — **Supabase**

| | Supabase Free | Firebase Spark (free) |
|---|---|---|
| DB | Postgres 500 MB, relational, SQL | Firestore 1 GiB, 50k reads/day, 20k writes/day |
| File storage | 1 GB included on free | Cloud Storage for new projects needs the paid Blaze plan (card on file) |
| Auth | 50k MAU | Generous |
| Fit for CMS content | Relational (projects → blocks, ordering, drafts) is natural; Row Level Security | Doable but denormalized |
| Catch | Free project **pauses after 7 days of no activity** | Storage/App Hosting push you to Blaze |

Decision: **final** (2026-10-01).

Pause mitigation: the public site is statically generated, so visitors never wait on the DB, and a daily Vercel Cron job pings Supabase to keep it awake.

### Hosting: Vercel vs Firebase — **Vercel**

| | Vercel Hobby | Firebase |
|---|---|---|
| Next.js support | Native (ISR, server actions, OG images, `revalidateTag`) | Static Hosting only on free; Next.js SSR (App Hosting) needs Blaze |
| Free limits | ~100 GB bandwidth/month, preview deploy per push, cron jobs | 10 GB storage, ~360 MB/day transfer |
| Terms | Hobby is for personal, non-commercial use — a personal portfolio fits | |

Final: **Next.js on Vercel + Supabase (DB/Auth/Storage) + Firebase only for Analytics + Microsoft Clarity**. Total cost: domain only (~₹800–1,200/year for `.com` / `.in`).

---

## 9. Analytics Events

Firebase (GA4) + Clarity, loaded after consent banner (lightweight, no cookie wall).
Events: `view_project`, `resume_download`, `contact_submit`, `copy_email`, `ask_ai_click`, `social_click`, `inspect_mode_toggle`, `command_palette_open`, `theme_toggle`.

---

## 10. Needed From You

The build starts now with defaults. Everything below can be added later; each item lists what stays off until it arrives.

### Defaults chosen for now (change any time)
- Local Supabase for development; free `*.vercel.app` URL for preview.
- Colours, fonts and visual style: picked by us to fit the Canvas concept; editable later.
- Photos and case study images: placeholder frames.
- Case study text: written from the resume bullets.
- Canonical name "Hunny Sindhakar" with "Hunny Sindhkar" as alternate name.
- Availability badge: "Open to opportunities".
- Ask-AI prompt uses the `vercel.app` URL until a domain exists.

### Will NOT work until you share it

| Item | What stays off without it |
|---|---|
| Supabase cloud project (URL, anon key, service role key) | Live deployed site has no DB, admin and contact form; everything works only on local |
| Vercel account + GitHub repo | No live URL; site runs only locally |
| Admin login email (Hunny's) | She can't log in to the admin panel |
| Domain name | Search Console / Bing verification, IndexNow, final canonical URLs, domain in `llms.txt` and Ask-AI prompt, branded email links. Site still works on `vercel.app` |
| Resend API key + receiving email | Contact messages are saved in the DB but no email notification |
| Cloudflare Turnstile keys | Contact form works but without spam protection (we won't go live without it) |
| Firebase web config | No Firebase Analytics events |
| Microsoft Clarity project ID | No heatmaps or session recordings |
| Case study permission (NDA check) | Client projects stay in draft; only allowed ones get published |

### Content — site works with placeholders, but final quality needs it
1. 2–3 professional photos.
2. Per case study: cover + 4–10 screens, problem, process, outcome/metrics.
3. Which Behance projects to feature.
4. 2–5 testimonials.
5. Extra socials (Dribbble, Instagram, X, Figma community).
6. Real availability status.
7. Brand preferences (colours, 2–3 reference sites, things to avoid).
8. Confirm name spelling.
9. Latest resume PDF (if changed).

All content items can be entered by Hunny directly in the admin panel after launch.

---

## 11. Definition of Done (Phase 1)
- Lighthouse 100 on Performance, Accessibility, Best Practices, SEO (mobile + desktop).
- Rich Results Test: Person, FAQPage, Breadcrumb valid, zero errors.
- `llms.txt`, sitemap, robots live; site verified in Google + Bing.
- All content editable from admin; change visible on live site within seconds.
- Passes the device matrix in section 4b (320px to 4K, touch and mouse, portrait and landscape), keyboard-navigable, reduced-motion respected.

---

## 12. Phase 2 — Grow & Convert (after launch, ~weeks 1–6)

Goal: turn visitors (recruiters, founders, clients) into conversations, and keep content fresh with zero dev effort.

### 12.1 Recruiter & client experience
- **Private case studies (NDA mode)** — projects that cannot be public get a password or expiring share link (`/work/botstream?key=...`). She sends it to a recruiter; admin shows who opened it and when. Solves the biggest designer-portfolio problem: best work under NDA.
- **Personalised links** — `/for/<company>` shows "Hi Google team 👋", reorders projects by relevance (AI / mobile / web) and pre-fills the contact form. Admin creates links in seconds and sees opens.
- **Book a call** — Cal.com embed (free) on contact page and ⌘K palette.
- **Smart contact form** — asks "Hiring / Freelance project / Just saying hi"; freelance path asks budget + timeline. Messages land in admin as a simple pipeline (New → Replied → Closed).
- **Always-synced resume** — resume PDF generated from the DB (ATS-friendly layout) so the download never goes out of date. Manual upload still possible.

### 12.2 "Ask Hunny's portfolio" AI assistant
- Chat widget that answers questions about her work ("Has she designed AI products?", "What was her role in Botstream?"), with links to the matching case study.
- Fitting story: she designed Botstream, an AI document-chat product — the portfolio uses the same idea.
- Built with Supabase `pgvector` (free) for search over her own content + Claude Haiku for answers. Auto re-indexes when content is saved in admin.
- Rate-limited, answers only from her content, falls back to "contact Hunny" when unsure.
- Cost: not free — roughly $1–3/month at portfolio traffic. Optional; off unless an API key is added.

### 12.3 Content engine
- **Native journal** — write articles in admin (rich editor, images, code, embeds). Published on her domain first, then cross-posted to Medium with a canonical link back, so Google credits her site.
- **Figma / prototype embeds** in case studies (live Figma prototypes, Lottie, video walkthroughs).
- **Playground / Daily UI** — small shots and experiments (image, GIF, Lottie) with a lighter format than case studies. Keeps the site active, which also helps SEO freshness.
- **Testimonial collector** — shareable form link for ex-colleagues/clients; submissions appear in admin for approval.

### 12.4 Admin upgrades
- In-admin analytics dashboard: page views, top projects, resume downloads, Ask-AI clicks, private-link opens (Supabase counts + GA4 data).
- Scheduled publishing and content version history (undo any edit).
- Notifications on new message: email + optional Telegram/WhatsApp.
- Weekly auto backup of Supabase data to a private GitHub repo (free tier has no point-in-time restore).

### Needed from you for Phase 2
| Item | For |
|---|---|
| Cal.com account (free) | Book a call |
| Anthropic API key (optional, paid ~$1–3/month) | AI assistant |
| Medium integration token or manual cross-post | Journal cross-posting |
| Private GitHub repo for backups | Backups |
| Telegram bot token (optional) | Instant message alerts |
| List of projects that need NDA mode | Private case studies |

---

## 13. Phase 3 — Authority & AI-Native Presence (~months 2–4)

Goal: make "Hunny Sindhakar" a recognised entity for Google and AI engines, and open a freelance income path.

### 13.1 AI-agent ready site
- **Public profile API** — `/api/profile.json` and `/api/projects.json` (clean, documented), linked from `llms.txt`.
- **MCP server / WebMCP** — AI agents (Claude, ChatGPT agents) can query her portfolio directly: "list her AI projects", "get her availability". Early-adopter signal few designer portfolios have.
- **AI visibility tracker** — weekly cron asks AI search engines "Who is Hunny Sindhakar?" and "best UI/UX designers in Ahmedabad", stores whether she is mentioned/cited, shows a trend chart in admin. (Small API cost, optional.)

### 13.2 Entity & authority building
- Wikidata entry + Google Knowledge Panel claim (once there is enough third-party coverage).
- **Press / talks / features page** — podcasts, interviews, awards, design community mentions, each with `sameAs` / citation schema.
- Consistent profiles audit: LinkedIn, Behance, Medium, Dribbble, Figma Community, Contra, Read.cv — same bio + link back.
- Local SEO: "UI/UX designer in Ahmedabad / Gujarat" landing content (only if freelance is a goal).

### 13.3 Freelance & services (only if she wants it)
- **Services page** — what she offers (UX audit, app design, design system, landing page), process, FAQs, starting prices or "request quote".
- **Project brief wizard** — multi-step brief form, produces a summary PDF for both sides.
- **Free resources** — Figma freebies / UI kits / checklists as downloads with optional email capture (lead magnet + backlinks from design communities).
- Note: selling services or products counts as commercial use; Vercel then needs Pro ($20/month). Decide before enabling.

### 13.4 Reach & polish
- **Multi-language** — English + Hindi (and optionally Gujarati) with `hreflang`; she speaks 4 languages, which is a real differentiator for Indian clients.
- **PWA** — installable, offline-friendly portfolio (useful when she presents on a phone/tablet in interviews).
- **Presentation mode** — any case study turns into full-screen slides for interviews and client calls.
- **A/B testing** of hero headline and CTA (PostHog free tier or Vercel flags).
- Yearly "portfolio refresh" checklist in admin (stale projects, broken links, outdated resume).

### Needed from you for Phase 3
| Item | For |
|---|---|
| Decision: freelance yes/no, services + price ranges | Services page, local SEO |
| Hindi / Gujarati translations (or approval of AI-drafted ones) | Multi-language |
| Press links, talks, awards (if any) | Authority page |
| Freebie files (Figma kits, templates) | Resources |
| API budget decision (~$2–5/month) | AI visibility tracker |

---

## 14. Phase Summary

| Phase | Theme | Key outcome | Cost |
|---|---|---|---|
| 1 | Launch | Full Canvas site + DB + admin + SEO/AEO/GEO, all devices | Domain only |
| 2 | Grow & convert | NDA links, personalised links, AI assistant, journal, pipeline | Free + optional ~$1–3/month AI |
| 3 | Authority & AI-native | Agent-ready API/MCP, AI visibility tracking, multi-language, freelance path | Free, or Vercel Pro $20/month if commercial |
