# iGrowth — Aplikasi Monitoring Tumbuh Kembang Anak (PWA)

Aplikasi PWA untuk memantau tumbuh kembang anak berbasis standar **WHO Child Growth Standards 2006** & **Permenkes RI No. 2 Tahun 2020**.

**Stack:**
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend & Auth:** Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)
- **Hosting:** Vercel (integrasi langsung GitHub–Vercel)

---

## 1. Menjalankan & Menguji Secara Lokal

1. **Install dependency dari lockfile:**
   ```bash
   npm ci
   ```

2. **Siapkan environment variables lokal:**
   Salin `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan nilai dari proyek Supabase Anda. File `.env.local` sudah diabaikan oleh `.gitignore` sehingga tidak akan ikut ter-commit ke GitHub.

3. **Jalankan server development:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000`.

4. **Jalankan pemeriksaan kualitas kode (lint, typecheck, build):**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

---

## 2. Menyiapkan Supabase (Database, Auth, dan RLS)

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **SQL Editor** di dashboard Supabase, lalu jalankan isi file migrasi:
   - `supabase/migrations/001_initial_schema.sql`
   Migrasi ini membuat tabel `caregivers`, `children`, `growth_records`, `milestone_progress`, `meal_records`, `food_allergy_tests`, `activity_logs`, dan `vaccine_records` beserta kebijakan **Row Level Security (RLS)** agar setiap pengguna hanya dapat membaca dan mengubah data anak miliknya sendiri (`auth.uid() = user_id`).
3. Buka **Authentication -> Providers** dan pastikan **Email** provider aktif.
4. Buka **Project Settings -> API**, lalu salin:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   > **Catatan Keamanan:** Jangan pernah menaruh `service_role` key di kode frontend atau variabel `NEXT_PUBLIC_*`.

---

## 3. Menghubungkan GitHub dan Vercel (Deploy Otomatis)

Deployment menggunakan **integrasi native GitHub–Vercel** (bukan deploy dari GitHub Actions agar tidak ada dua mekanisme deploy yang tumpang tindih):

1. Push kode ke repository GitHub Anda.
2. Masuk ke [Vercel Dashboard](https://vercel.com/dashboard), pilih **Add New... -> Project**, lalu impor repository GitHub `igrowth`.
3. Pastikan konfigurasi proyek di Vercel:
   - **Framework Preset:** Next.js
   - **Production Branch:** `main` (di **Settings -> Git -> Production Branch**).
     - Setiap **Pull Request** ke `main` otomatis menghasilkan **Preview Deployment**.
     - Setiap **push/merge ke `main`** otomatis menghasilkan **Production Deployment**.
4. Tambahkan **Environment Variables** di **Vercel -> Settings -> Environment Variables** untuk environment **Production**, **Preview**, dan **Development**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Di Supabase Dashboard (**Authentication -> URL Configuration**), tambahkan URL domain Vercel Anda (misalnya `https://nama-proyek.vercel.app`) ke **Site URL** dan **Redirect URLs**.
