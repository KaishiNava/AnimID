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

## Update komunitas & player

- Halaman detail anime kini memiliki komponen komentar (login Supabase diperlukan) dan daftar giveaway Premium.
- Player mencoba `<video>` untuk URL media langsung (`mp4`, `webm`, `ogg`) dan iframe untuk URL HTTPS lain. Sebagian penyedia memblokir iframe; gunakan tautan sumber jika begitu.
- Jalankan ulang seluruh `supabase/schema.sql` di SQL Editor Supabase setelah backup database. Schema menambah `profiles.is_verified`, fungsi klaim giveaway atomik, dan fungsi penghitung klaim.
- Badge biru yang tampil adalah badge komunitas **AnimID**, bukan verifikasi resmi dari Meta. Untuk akun staf yang sudah diverifikasi, admin database harus mengatur `profiles.is_verified = true` untuk UUID akun yang benar. Jangan berikan hak update kolom tersebut kepada pengguna biasa.
- Giveaway harus dibuat oleh admin melalui dashboard/SQL tepercaya; UI ini hanya menampilkan giveaway aktif dan memanggil fungsi klaim aman. Dashboard admin/pembelian pembayaran belum disediakan oleh starter ini.
