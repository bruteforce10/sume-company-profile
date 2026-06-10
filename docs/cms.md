# CMS Terjemahan (Supabase)

Panel admin untuk mengedit seluruh teks situs (Bahasa Indonesia & English).
Sumber data kini berada di **Supabase**, bukan lagi file `messages/*.json`
(file JSON tetap dipakai sebagai _fallback_ dan sebagai sumber tipe TypeScript).

## Arsitektur singkat

- **Tabel `translation_messages`** — katalog pesan: `namespace`, `key`, `locale`, `value`.
  Bisa dibaca publik (situs merender ini), hanya admin yang bisa menulis (RLS).
- **Tabel `admin_users`** — daftar user yang boleh mengedit. Fungsi `is_admin()`
  dipakai di policy RLS.
- **`src/i18n/request.ts`** memuat pesan dari Supabase (di-cache + tag
  `translation-messages`), ditumpuk di atas JSON bawaan agar tidak pernah kosong.
  Setiap simpan memanggil `revalidateTag(..., "max")` sehingga perubahan tayang.
- **`src/proxy.ts`** menggabungkan middleware i18n + refresh sesi Supabase, dan
  menjaga `/admin` (harus login). Peran admin dicek ulang di layout & server action.
- **UI** memakai shadcn/ui (`/login`, `/admin/messages`).

## Setup sekali jalan

### 1. Environment

Pastikan `.env.local` berisi (sudah ada):

```
NEXT_PUBLIC_SUPABASE_URL=https://egrneczouptvozcytfia.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 2. Buat user admin

Di Supabase Dashboard → **Authentication → Users**, pastikan
`audifirdi@gmail.com` ada **dan punya password** (Add user / Reset password).
Login CMS memakai email + password.

### 3. Terapkan skema + data ke database

**Opsi A — Supabase CLI** (butuh login & DB password):

```bash
npx supabase login
npx supabase link --project-ref egrneczouptvozcytfia
npx supabase db push
```

**Opsi B — Dashboard SQL Editor** (tanpa CLI): buka **SQL Editor**, lalu jalankan
isi kedua file ini secara berurutan:

1. `supabase/migrations/20260610090000_cms_translations.sql` (tabel, RLS, admin)
2. `supabase/migrations/20260610090100_seed_translations.sql` (388 baris pesan)

> Migrasi pertama otomatis menandai `audifirdi@gmail.com` sebagai admin
> (selama user-nya sudah dibuat di langkah 2).

### 4. Jalankan

```bash
npm run dev
```

Buka `http://localhost:3000/login`, masuk, lalu kelola teks di
`http://localhost:3000/admin/messages`.

## Cara pakai editor

- Tiap **namespace** (Header, Home, AboutPage, …) berisi daftar **key**.
- Kolom kiri = **Bahasa Indonesia**, kolom kanan = **English**.
- Gunakan kotak **Cari** untuk memfilter key/teks.
- Klik **Simpan** per namespace. Perubahan langsung tayang di situs.
- Placeholder ICU seperti `{year}` dan tag seperti `<link>…</link>` /
  `<strong>…</strong>` harus dipertahankan persis seperti aslinya.

## Memperbarui katalog dari kode

Jika menambah key baru di `messages/{id,en}.json`, regenerasi seed lalu push:

```bash
node scripts/generate-translations-seed.mjs
npx supabase db push   # atau jalankan file seed di SQL Editor
```

Seed bersifat _idempotent_ (`on conflict do nothing`) — nilai yang sudah
diedit lewat CMS tidak akan ditimpa.
