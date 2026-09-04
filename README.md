# CookEasy

CookEasy is a full-stack web application that suggests recipes based on the ingredients you
already have at home. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and
NextAuth.js.

## Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Prisma ORM (works locally and on Vercel — a free
  [Neon](https://neon.tech) database works great)
- **Auth:** NextAuth.js (credentials provider, JWT sessions, bcrypt password hashing)
- **Validation:** Zod
- **Icons:** lucide-react

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your own Postgres connection string (a free
   [Neon](https://neon.tech) database takes about 2 minutes to create) plus a `NEXTAUTH_SECRET`:

   ```bash
   cp .env.example .env
   ```

3. Push the schema to your database:

   ```bash
   npx prisma db push
   ```

4. Seed the database with categories, sample recipes, and a demo user:

   ```bash
   npx prisma db seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

> **Note on Neon:** if your connection string's hostname contains `-pooler` (Neon's pooled
> connection), add a second, direct connection string (same string with `-pooler` removed from
> the hostname) as `DIRECT_URL` in `.env` — see `.env.example`. The app uses the pooled URL at
> runtime; Prisma's CLI (migrate/db push/studio) uses the direct one, since Neon's pooler doesn't
> support the advisory lock some Prisma CLI commands take.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| User | `demo@cookeasy.com` | `password123` |
| Admin | `admin@cookeasy.com` | `admin123` |

Log in with the admin account and open the "Admin Dashboard" link in the user menu (or go to
`/admin`) to manage users, recipes, and categories.

## Project structure

- `src/app` — pages and API routes (App Router)
- `src/components` — shared UI components
- `src/lib` — Prisma client, auth config, validation schemas, search/matching logic
- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — seed script (categories, recipes, ingredients, demo user)
- `public/uploads` — recipe photos and avatars uploaded through the app (gitignored)

## Features

- Search recipes by the ingredients you have, ranked by percentage of matching ingredients
- Recipe detail pages with ingredients, step-by-step instructions, and related recipes
- Categories, favorites, and user-created recipes (full CRUD)
- Email/password authentication with protected routes
- Profile and password management
- Newsletter signup
- Admin dashboard (`/admin`) to manage users, recipes, and categories
- Upload a photo for a recipe (drag & drop or camera) instead of only pasting an image URL
- Scan a product barcode with your camera to auto-fill an ingredient (via the free
  [Open Food Facts](https://openfoodfacts.org) API — no API key required)
- Admin section to add foods (`/admin/ingredients`) by scanning a barcode, and to create recipes
- **My Pantry** (`/pantry`): track what you have at home with optional expiration dates, get
  warned about items that are expired or expiring soon, and see recipe suggestions generated from
  your current pantry — including exactly which ingredients you're still missing
- **Shopping List** (`/shopping-list`): add missing ingredients with one click from a pantry
  suggestion, scan a barcode, or add manually; check items off as you shop
- Recipe ratings (1-5 stars + optional comment), shown as an average on every recipe card

> Camera features (barcode scanning, camera capture) require a secure context. They work on
> `http://localhost:3000` during development, and on any real deployment since those serve over
> HTTPS automatically (see Deploying below).

## Deploying (e.g. to Vercel)

This repo already talks to a real Postgres database, so it deploys to
[Vercel](https://vercel.com) in a few clicks (import the GitHub repo, it detects Next.js
automatically) — that also gives you the HTTPS needed for the barcode scanner.

1. Import this repo on Vercel.
2. In the project's environment variables, set: `DATABASE_URL`, `DIRECT_URL` (if using a pooled
   connection), `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` (your Vercel deployment URL).
3. Deploy. The build script (`prisma db push && next build`) syncs the schema to your database on
   every deploy, so there's no separate migration step to run by hand.
4. Run `npx prisma db seed` once (locally, pointed at the same `DATABASE_URL`) if you want the
   demo categories/recipes/accounts in your production database too.

> **Uploaded photos**: files saved to `public/uploads` (recipe photos, avatars) won't persist on
> a serverless host like Vercel — each deploy gets a fresh, read-only filesystem. For production,
> swap the upload route (`src/app/api/upload/route.ts`) to upload to a service like
> [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or Cloudinary instead of the local
> filesystem.

> **On `db push` vs. `migrate deploy`**: the build script uses `prisma db push`, which syncs the
> schema directly without keeping a migration history — simple and reliable at this stage. Once
> this app has real production data you can't afford to lose, switch back to a
> `prisma migrate dev` / `prisma migrate deploy` workflow so schema changes are reviewable and
> reversible.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npx prisma studio` | Browse the database in a UI |
| `npx prisma db push` | Sync the schema to your database |
| `npx prisma db seed` | Re-run the seed script |
