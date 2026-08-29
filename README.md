# Mohammed Mohsen — Portfolio & CMS

A production-ready, bilingual (EN / AR + RTL) developer portfolio with a complete
self-service admin panel. Every section on the public site — texts, projects, skills,
services, testimonials, FAQs, stats and even UI micro-copy — is editable from
`/admin` without touching the code.

Built with **Next.js 15 (App Router)**, **Prisma**, **NextAuth**, **Tailwind CSS**
and **Framer Motion**.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Quick start](#quick-start)
5. [Environment variables](#environment-variables)
6. [Database](#database)
7. [Available scripts](#available-scripts)
8. [Admin panel](#admin-panel)
9. [Deployment](#deployment)
10. [Security notes](#security-notes)
11. [Performance notes](#performance-notes)
12. [Troubleshooting](#troubleshooting)

---

## Features

### Public site

| Area | Details |
|---|---|
| Hero | Typing animation, interactive particle canvas, floating avatar with orbit rings, live terminal card |
| Tech strip | Clickable technology chips — each one plays its own animation with a particle burst |
| About | Editable bios, clickable trait chips that jump to related sections, floating domain cards |
| Why me | Icon blocks managed from the panel |
| Stats | Animated counters that run when scrolled into view |
| Skills | Category filters generated automatically from the data, progress bars with a glowing spark head |
| Services | Pricing cards with a "most requested" badge and a full in-page order modal (form + WhatsApp) |
| Experience | Vertical timeline with expandable long-form stories |
| Projects | Featured/all filters, 3D tilt cards, case-study pages at `/projects/[slug]` |
| Testimonials | Auto-rotating slider, swipe/drag, arrows, dots, pauses on hover |
| Blog | Markdown articles, tags, view counter, reading progress, share buttons |
| FAQ | Numbered luxury accordion |
| Contact | 3-step form (info → project type + budget → message), draft autosave, honeypot, rate limiting |
| Global | Dark/light theme, EN/AR with full RTL, command palette (`Ctrl/⌘ + K`), custom cursor, dot navigation, splash intro, WhatsApp float, toast system |
| SEO | Dynamic metadata, JSON-LD (Person + BlogPosting), `sitemap.xml`, `robots.txt`, PWA manifest |

### Admin panel (`/admin`)

Profile · Projects · Skills · Services · Experience · Blocks (why-me) ·
Stats · Testimonials (with approval) · FAQs · Articles (Markdown editor) ·
Messages inbox · UI texts (every kicker/badge/label) · Settings (theme, language,
meta tags, password, security question).

### Public review page

`/review` lets clients submit a testimonial. Submissions are rate limited and stay
unpublished until you approve them in the panel.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC, Route Handlers) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 + custom CSS design tokens |
| Animation | Framer Motion 11 + CSS keyframes |
| Database | SQLite (dev) / PostgreSQL — Neon (prod) |
| ORM | Prisma 5 |
| Auth | NextAuth 4 (credentials + JWT) + edge middleware |
| Editor | `@uiw/react-md-editor` |
| Icons | `react-icons` |
| Images | `next/image` + `sharp` |
| Notifications | Telegram Bot API (optional) |

---

## Project structure

```
.
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, theme/lang bootstrap, JSON-LD
│   ├── page.tsx                  # Home page (server component, single DB round-trip)
│   ├── globals.css               # Design tokens, components, animations
│   ├── manifest.ts               # PWA manifest
│   ├── robots.ts                 # robots.txt
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── not-found.tsx             # 404 page
│   ├── icon.svg                  # Favicon
│   ├── admin/                    # Admin panel (guarded by middleware.ts)
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/                # Login + password recovery
│   │   ├── change-password/      # Forced first-login change
│   │   ├── profile/  projects/  skills/  services/
│   │   ├── experience/  blocks/  stats/  testimonials/
│   │   ├── faqs/  articles/  messages/  texts/  settings/
│   ├── api/                      # Route handlers (REST)
│   │   ├── auth/                 # NextAuth, change-password, recover
│   │   ├── profile/  projects/  skills/  services/
│   │   ├── experience/  blocks/  stats/  testimonials/
│   │   ├── faqs/  articles/  snippets/  settings/
│   │   ├── contact/              # Public form + admin inbox
│   │   └── upload/               # Authenticated image upload
│   ├── blog/                     # Blog index + article pages
│   ├── projects/[slug]/          # Case-study pages
│   └── review/                   # Public testimonial submission
│
├── components/
│   ├── sections/                 # Home page sections
│   │   ├── Hero.tsx  Marquee.tsx  About.tsx  Blocks.tsx
│   │   ├── Stats.tsx  Skills.tsx  Services.tsx  Experience.tsx
│   │   ├── Projects.tsx  Testimonials.tsx  BlogPreview.tsx
│   │   ├── FaqSection.tsx  FinalCta.tsx  Contact.tsx
│   │   └── SectionHeader.tsx     # Shared luxury heading + ornament
│   ├── layout/                   # Navbar, Footer
│   ├── admin/                    # AdminNav, CrudPage, ArticleEditor, ImageUpload
│   ├── blog/                     # Reading progress, share buttons
│   └── ui/                       # Splash, Cursor, Particles, Toast, CommandPalette,
│                                 # DotsNav, BackToTop, Magnetic, Spotlight, Kicker,
│                                 # WhatsAppFloat, ImageUpload
│
├── lib/
│   ├── prisma.ts                 # Prisma singleton
│   ├── auth.ts                   # NextAuth options
│   ├── settings.ts               # Cached site settings (unstable_cache)
│   └── AppContext.tsx            # Theme + language + translations
│
├── prisma/
│   ├── schema.prisma             # Data model
│   ├── seed.js                   # Initial content + admin user
│   └── seed-snippets.js          # Editable UI text defaults
│
├── public/
│   ├── fonts/                    # Self-hosted Cairo + Nautica
│   └── uploads/                  # Runtime image uploads (git-ignored)
│
├── docs/                         # Internal notes (Arabic improvement logs)
├── middleware.ts                 # Edge auth gate for /admin
├── next.config.js                # Security headers, image + cache policy
├── netlify.toml                  # Netlify build config
└── .env.example                  # Environment template
```

---

## Quick start

Requires **Node.js 20+**.

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Create your environment file
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env

# 3. Create the database schema
npm run db:push

# 4. Seed content, admin user and UI texts
npm run db:seed
npm run db:seed:snippets

# 5. Start the dev server
npm run dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin/login>
- Default credentials: `admin` / `admin123` — **change immediately**

### Testing on a phone over the local network

```bash
npm run dev:lan
```

Then open `http://<your-computer-LAN-IP>:3000` on the phone (same Wi-Fi).
Find the IP with `ipconfig` (Windows) or `ip addr` (Linux/macOS).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | `file:./prisma/dev.db` for SQLite, or a PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Long random string used to sign JWTs |
| `NEXTAUTH_URL` | ✅ | Full site origin (`http://localhost:3000` in dev) |
| `NEXT_PUBLIC_SITE_URL` | ✅ (prod) | Public origin used by sitemap, robots and metadata |
| `TELEGRAM_TOKEN` | ➖ | Bot token for contact-form notifications |
| `TELEGRAM_CHAT_ID` | ➖ | Chat that receives notifications |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Messages are always stored in the database. Telegram is only an extra
> notification channel — leaving it empty is fine.

---

## Database

The schema ships with `provider = "sqlite"`, which is ideal for local development.

### Switching to PostgreSQL (Neon) for production

1. Edit `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Point `DATABASE_URL` at your Postgres/Neon connection string.
3. Push the schema and seed:

   ```bash
   npm run db:push
   npm run db:seed
   npm run db:seed:snippets
   ```

### Models

`Profile` · `Skill` · `Project` · `Article` · `Message` · `Admin` · `Block` ·
`Service` · `Testimonial` · `Experience` · `FAQ` · `Stat` · `TextSnippet` ·
`SiteSettings`

---

## Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run dev:lan` | Dev server exposed on the local network |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | lint + typecheck + build — run before deploying |
| `npm run db:push` | Sync schema to the database |
| `npm run db:seed` | Seed content + admin user |
| `npm run db:seed:snippets` | Seed editable UI texts |
| `npm run db:studio` | Prisma Studio GUI |
| `npm run db:reset` | Drop, recreate and reseed (destructive) |

---

## Admin panel

### First login

1. Go to `/admin/login`
2. Sign in with `admin` / `admin123`
3. Change the password immediately (`/admin/change-password`)
4. Set a security question in **Settings** so recovery works later

### Forgot the password?

Use the "Forgot password" link on the login page (needs a security question set).

Manual reset from the project directory:

```bash
node -e "const b=require('bcryptjs'),{PrismaClient}=require('@prisma/client'),p=new PrismaClient();b.hash('NewPassword123',10).then(h=>p.admin.update({where:{id:1},data:{password:h,mustChangePass:true}})).then(()=>console.log('done')).finally(()=>p.$disconnect())"
```

### Editing UI micro-copy

**Admin → Texts** exposes every kicker, badge, label and splash line as a
key/value pair with an Arabic translation. Saving revalidates the home page.

---

## Deployment

### Pre-flight

```bash
npm run verify
```

All three steps must pass before deploying.

### Netlify (configured in `netlify.toml`)

1. Push the repository to GitHub.
2. Netlify → **Add new site → Import an existing project** → pick the repo.
3. Build settings are read from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs`
4. Add the environment variables under **Site settings → Environment variables**:
   `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`,
   and optionally `TELEGRAM_TOKEN` / `TELEGRAM_CHAT_ID`.
5. Deploy, then run `npm run db:push` and the seed scripts against the production
   database once.

### Vercel

Import the repo, add the same environment variables, and keep the default
Next.js build settings.

> **Serverless uploads:** `/api/upload` writes to `public/uploads`, which is not
> persistent on serverless platforms. For production, either self-host (VPS,
> Docker, Node server) or switch the handler to object storage such as S3,
> Cloudinary or Netlify Blobs.

### Post-deploy checklist

- [ ] `/` renders with real content
- [ ] `/admin` redirects anonymous visitors to `/admin/login`
- [ ] Default password changed and a security question set
- [ ] Contact form stores a message and (optionally) pings Telegram
- [ ] `/sitemap.xml` and `/robots.txt` show the production domain
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live origin

---

## Security notes

Implemented:

- **Edge middleware** guards the whole `/admin` surface and enforces the
  first-login password change — client-only admin pages can no longer be viewed
  by anonymous visitors.
- **Every mutating API route** requires an authenticated session.
- **Field allow-lists** on public writes: the review endpoint and site settings
  ignore client-supplied `approved`, `order` and unknown columns.
- **Rate limiting** on the contact form (5 / 10 min), public reviews (3 / hour)
  and password recovery (5 / 15 min).
- **Honeypot** field on the contact form.
- **Upload hardening**: authenticated only, MIME-derived extensions, random file
  names, folder allow-list, path-traversal check, 5 MB cap.
- **Telegram HTML escaping** so message content cannot inject markup.
- **Security headers**: HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `poweredByHeader: false`.
- **Password storage**: bcrypt; security answers are SHA-256 hashed.

Recommended for a public deployment:

- Rotate `NEXTAUTH_SECRET` and never reuse the seeded credentials.
- Move uploads to object storage if hosting serverless.
- Restrict `images.remotePatterns` to the specific hosts you actually use.
- Consider a durable rate-limit store (Redis/Upstash) if you scale to multiple
  instances — the in-memory counters are per-instance.

---

## Performance notes

- Home page data is fetched in a **single `Promise.all`** and the page is ISR-cached
  (`revalidate = 3600`).
- Site settings are wrapped in `unstable_cache` and revalidated by tag, so the root
  layout no longer queries the database twice per request.
- The particle canvas **pauses when off-screen or when the tab is hidden**, uses a
  reduced particle count and DPR on touch devices, and skips the O(n²) link pass on
  mobile.
- Hero blur layers and orbit rings are lightened on small screens; the hero uses
  `100svh` to avoid mobile browser-chrome jumps.
- `optimizePackageImports` trims `react-icons` and `framer-motion` bundles.
- Long-lived immutable cache headers for `/uploads` and `/fonts`; AVIF/WebP output
  from `next/image`.
- `prefers-reduced-motion` disables the decorative animation layer.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `PrismaClientInitializationError` | `DATABASE_URL` missing or wrong; run `npm run db:push` |
| Admin login always fails | Run `npm run db:seed` to create the admin row |
| Redirect loop on `/admin` | `NEXTAUTH_SECRET` missing, or mismatched between build and runtime |
| Blank sections on the home page | Database is empty — run the seed scripts |
| Uploads disappear after redeploy | Expected on serverless; move to object storage |
| Sitemap shows `localhost` | Set `NEXT_PUBLIC_SITE_URL` in the environment |
| Prisma types out of date | `npm run db:generate` |

---

## License

Private project. All rights reserved © 2026 Mohammed Mohsen.
