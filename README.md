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
  your current pantry (prioritizing what's about to go bad)

> Camera features (barcode scanning, camera capture) require a secure context. They work on
> `http://localhost:3000` during development; a production deployment needs HTTPS.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npx prisma studio` | Browse the database in a UI |
| `npx prisma migrate dev` | Create/apply a migration |
| `npx prisma db seed` | Re-run the seed script |
