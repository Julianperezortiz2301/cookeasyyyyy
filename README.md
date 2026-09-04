# CookEasy

CookEasy is a full-stack web application that suggests recipes based on the ingredients you
already have at home. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and
NextAuth.js.

## Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite via Prisma ORM (swap the provider + `DATABASE_URL` to move to PostgreSQL)
- **Auth:** NextAuth.js (credentials provider, JWT sessions, bcrypt password hashing)
- **Validation:** Zod
- **Icons:** lucide-react

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and adjust if needed:

   ```bash
   cp .env.example .env
   ```

3. Run the database migrations:

   ```bash
   npx prisma migrate dev
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

This repo deploys to [Vercel](https://vercel.com) in a few clicks (import the GitHub repo, it
detects Next.js automatically) — that also gives you the HTTPS needed for the barcode scanner.
Two things to know before you do:

1. **Database**: this project ships with SQLite, which is a single file on disk. That works
   great locally, but most serverless hosts (including Vercel) don't give you persistent disk
   storage, so the database would reset on every deploy. For a real deployment, create a free
   Postgres database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com)), then:
   - change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
   - set `DATABASE_URL` in your host's environment variables to the Postgres connection string
   - run `npx prisma migrate deploy` once against it (or let your deploy pipeline do it)
2. **Uploaded photos**: files saved to `public/uploads` (recipe photos, avatars) also won't
   persist on a serverless host. For production, swap the upload route
   (`src/app/api/upload/route.ts`) to upload to a service like
   [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or Cloudinary instead of the local
   filesystem.

Also set `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in your host's environment variables (generate a
secret with `openssl rand -base64 32`).

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npx prisma studio` | Browse the database in a UI |
| `npx prisma migrate dev` | Create/apply a migration |
| `npx prisma db seed` | Re-run the seed script |
