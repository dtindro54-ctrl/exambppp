# EXAMBPPP — status kesiapan UTS

Saya sedang mengubah autentikasi dari akun hard-coded ke Supabase Auth. Login sekarang menolak akun demo dan memeriksa profil dari database; middleware memerlukan sesi Supabase untuk membuka rute aplikasi saat konfigurasi Supabase tersedia.

## Konfigurasi hosting

1. Buat project Supabase milik sekolah dan uji dahulu dengan data fiktif.
2. Terapkan secara berurutan `supabase/migrations/202611140001_initial_exam_schema.sql`, lalu `202611140002_exam_guardrails.sql`.
3. Buat akun Auth untuk admin dan siswa, kemudian profil `public.profiles` yang `id`-nya sama dengan `auth.users.id`. Tetapkan role admin melalui proses tepercaya. Jangan pernah mengekspos service-role key ke browser atau Git.
4. Di pengaturan Vercel project, tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` untuk Preview dan Production, lalu redeploy.
5. Login saat ini memakai email + password Supabase. ID siswa hanya ditampilkan sebagai identitas profil; login langsung dengan ID siswa belum tersedia.

## Peringatan penting: belum siap untuk ujian resmi

Login dan middleware merupakan fondasi awal, tetapi halaman ujian, bank soal, hasil, siswa, dan mapel belum semuanya dimigrasikan dari `localStorage` ke database. Ujian siswa tidak boleh dijalankan sampai seluruh halaman memakai Supabase dengan server-side authorization/RLS, jawaban disimpan berkala, penilaian berasal dari RPC server, admin bisa melihat data lintas perangkat, skema diuji, dan deploy lulus simulasi.

Middleware menegakkan keberadaan sesi Supabase, bukan seluruh role authorization. Rute sensitif dan operasi data tetap wajib divalidasi oleh RLS/database. Jangan anggap localStorage sebagai bukti identitas atau izin.

Situs web tidak bisa mengunci seluruh HP. Untuk perangkat sekolah gunakan kiosk/lockdown browser resmi, perangkat terkelola, dan pengawas. Perpindahan tab hanya sinyal dan bukan bukti kecurangan.

## Uji lokal

Salin `.env.example` menjadi `.env.local`, isi URL dan anon key dari Supabase, kemudian:

```bash
npm install
npm run dev
npm run build
```
