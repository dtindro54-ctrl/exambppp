# EXAMBPPP

Aplikasi web ujian sederhana berbasis Next.js untuk demo/pilot: beranda publik, login demo, dashboard, bank soal, ujian bertimer, penilaian otomatis, dan riwayat hasil.

## Jalankan lokal

Butuh Node.js 18.17 atau lebih baru.

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Akun demo

- Admin: `admin` / `admin123`
- Peserta: `peserta` / `peserta123`

Alur: login admin → dashboard → bank soal (`/soal`) untuk mengubah soal → logout → login peserta → mulai ujian → lihat hasil. Admin juga dapat melihat `/admin`.

## Publikasi di Vercel

1. Import `dtindro54-ctrl/exambppp` di https://vercel.com/new.
2. Vercel mendeteksi Next.js secara otomatis; gunakan perintah build `npm run build`.
3. Klik **Deploy**. Tidak ada environment variable yang diperlukan untuk demo ini.

Push baru ke branch `main` akan memicu deployment otomatis setelah repo terhubung ke Vercel. Saya tidak dapat membuat deployment live atau menghubungkan akun Vercel dari GitHub saja; hal itu memerlukan otorisasi akun hosting.

## Batasan keamanan dan data — penting

Versi ini merupakan **demo/pilot**, bukan sistem ujian produksi yang aman. Login demo hanya validasi di browser, tidak ada server-side authentication/authorization. Soal, jawaban benar, dan hasil disimpan di `localStorage` browser, sehingga tidak tersinkron antarperangkat dan tidak boleh dipakai untuk ujian berisiko tinggi atau menyimpan data pribadi/sensitif. Jangan gunakan akun demo sebagai kredensial sungguhan. Untuk produksi diperlukan backend/database, autentikasi server, kontrol akses, validasi server-side, kebijakan privasi, backup, serta pengujian keamanan.
