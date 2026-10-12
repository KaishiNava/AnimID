# AnimID — Starter Project

AnimID is a clean, dark anime discovery and watchlist website. The repository is split into:

- `frontend/`: Next.js App Router + TypeScript + Tailwind-free custom CSS + Lucide icons.
- `backend/`: Node.js Express API that wraps the AnimeIn scraper. Secrets remain on Railway.
- `supabase/schema.sql`: initial database schema and Row Level Security policies.

## Run locally

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Set `ANIMEIN_PROXY_SECRET` to a valid secret approved for the upstream API. The source file supplied to us hard-coded a secret; it has deliberately been removed from runtime code and must not be committed.

### 2) Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api`.

## Deploy
- Push this folder to GitHub.
- Deploy `frontend/` as the Vercel project root.
- Deploy `backend/` as the Railway service root.
- Add `ANIMEIN_PROXY_SECRET` and `FRONTEND_ORIGIN` to Railway variables.
- Add Supabase project URL and anon key to Vercel variables.
- Run `supabase/schema.sql` in Supabase SQL Editor.

## Important
- The UI, search, favorite/watchlist toggles, and Supabase auth foundation are implemented as a starter.
- Admin/premium/giveaway/payment workflows need secure server-side transaction logic before production use; do not treat client-only UI as authorization.
- Streaming source availability and use must comply with the source site's terms and applicable distribution rights. This app does not proxy or download video files; it only returns metadata and available stream links from the configured source.
