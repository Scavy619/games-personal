# Scavy B2

Scavy's personal corner of the internet — a full-stack rebuild of the original single-file HTML site. Five tabs (Personal, Gaming, Journal, Entertainment, Contact) backed by a real database and an admin panel, instead of hardcoded JS arrays.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Prisma 7** ORM with **SQLite** locally (`prisma/dev.db`), using the new driver-adapter client (`@prisma/adapter-better-sqlite3`)
- **Tailwind CSS v4** with the site's design tokens (dark bg, violet `#8B5CF6` + cyan `#06EFC9` accents) mapped in `app/globals.css`
- **Chart.js** (`react-chartjs-2`) for the 8 Gaming analytics charts
- **RAWG.io** (games) + **TMDb** (movies) for the admin "search & auto-fill" enrichment tool
- Simple password-gated admin (`/admin`) using a signed JWT cookie (`jose`), enforced in `proxy.ts` (Next 16's renamed `middleware.ts`)

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db from prisma/schema.prisma
npx tsx scripts/import-games.ts   # one-time import of scripts/data/scavy_games_export.json
npm run dev
```

Open http://localhost:3000 for the public site, http://localhost:3000/admin for the admin panel.

## Environment variables

Copy `.env.example` → `.env` (or `.env.local`) and fill in:

```
DATABASE_URL="file:./dev.db"     # sqlite locally; becomes a postgres URL when you move to Supabase
RAWG_API_KEY=                    # free key: rawg.io/apidocs — needed for game auto-fill
TMDB_API_KEY=                    # free key: themoviedb.org/settings/api — needed for movie auto-fill
ADMIN_PASSWORD=                  # password for /admin
SESSION_SECRET=                  # random string used to sign the admin session cookie
```

A `.env` with dev-only defaults (`ADMIN_PASSWORD=scavy-dev`) is already present so you can try the admin panel immediately — **change this before deploying anywhere public.**

## Adding games/movies going forward

- **One at a time**: `/admin/games/new` or `/admin/movies/new` → use the "Search & Auto-fill" box (needs the API keys above) to pull in genre/score/cover/synopsis from RAWG or TMDb, then edit anything before saving.
- **In bulk**: append new entries to `scripts/data/scavy_games_export.json` and re-run `npx tsx scripts/import-games.ts` — it's idempotent (skips games that already exist by name).
- **Custom fields**: every entity (games, movies, journal entries, sports logs, profile) has a "Custom Fields" key/value editor in its admin form, backed by a `Json` column — so you can add a new attribute without a code change or migration.

## Architecture notes for future expansion

- `lib/enrich/` is a pluggable provider interface (`EnrichmentProvider`) — RAWG and TMDb are the two providers today. A future AI-powered provider (semantic search, LLM-drafted reviews) can be added as a third file here without touching the API routes or admin UI.
- The Prisma schema only uses provider-agnostic types (`String/Int/Float/Boolean/DateTime/Json`, `cuid()` ids) — switching `prisma/schema.prisma`'s `provider = "sqlite"` to `"postgresql"` and pointing `DATABASE_URL` at a Supabase connection string is the entire migration needed to go from local to hosted.
- Uploaded images live under `public/uploads/{avatars,gallery,covers}` as plain files with the path stored as a string in the DB. This **will not persist on Vercel's ephemeral filesystem** — before actually deploying, swap `lib/uploads.ts`/`app/api/upload/route.ts`'s destination for S3 or Cloudflare R2 and return the bucket URL instead; no schema change is needed since those fields are already just `String` URLs.

## Deployment (when you're ready to host)

1. Create a free [Supabase](https://supabase.com) project, grab its Postgres connection string.
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `"postgresql"`.
3. Set `DATABASE_URL` to the Supabase connection string, run `npx prisma migrate deploy`.
4. Swap local file uploads for S3/Cloudflare R2 (see note above).
5. Push to GitHub, import into [Vercel](https://vercel.com/new), set the env vars from `.env.example` in the Vercel project settings.
6. (Optional) point a custom domain from Namecheap/Cloudflare at the Vercel deployment.
