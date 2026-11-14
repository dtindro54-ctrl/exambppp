# EXAMBPPP

Aplikasi web ujian Next.js untuk demo/pilot: bank soal, ujian bertimer, penilaian otomatis, rekap nilai yang dapat dicetak, dan sertifikat demo.

## Jalankan
```bash
npm install
npm run dev
```
Buka http://localhost:3000.

## Akun demo
- Admin: `admin` / `admin123`
- Peserta: `peserta` / `peserta123`

## Fitur revisi
- Admin dapat membuka **Dashboard → Cetak nilai** (`/admin/hasil`) dan memakai tombol cetak browser.
- Peserta dapat membuka **Dashboard → Sertifikat** (`/sertifikat`); sertifikat demo bisa dicetak jika nilai terbaru minimal 70.
- Saat ujian, browser web tidak bisa mengunci perangkat atau mencegah peserta pindah ke aplikasi lain. Untuk mengurangi kecurangan, gunakan perangkat terkelola dengan kiosk/lockdown browser resmi, pengawasan, serta aturan ujian yang jelas. Versi web dapat menambahkan peringatan saat tab ditinggalkan, tetapi itu bukan penguncian dan bisa dilewati.

## Batasan data dan keamanan
Versi ini masih demo berbasis localStorage. Rekap nilai dan sertifikat hanya membaca hasil di browser yang sedang digunakan; data tidak terkirim/sinkron ke perangkat admin lain. Login demo dan pemeriksaan role sisi browser bukan autentikasi aman. Jangan gunakan untuk ujian resmi atau data sensitif sebelum ditambahkan backend/database, autentikasi server-side, pengelolaan ID peserta yang aman, dan pengujian.

Deployment: import repo `dtindro54-ctrl/exambppp` ke Vercel. Build terbaru pada `main` akan dideploy jika integrasi repo sudah aktif.
