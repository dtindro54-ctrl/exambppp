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

## Upload soal otomatis

Masuk sebagai admin, buka Dashboard → Bank soal. Pilih file CSV atau JSON; aplikasi akan memeriksa format dan mengimpor soal. Anda bisa memilih mengganti soal lama atau menambahkan soal ke bank yang ada. Tombol **Unduh template CSV** menyediakan contoh format. Jawaban benar boleh ditulis A/B/C/D atau 1/2/3/4.

Format CSV header: `question,optionA,optionB,optionC,optionD,answer`.

Format JSON dapat berupa array soal dengan properti `text`, `options` (empat pilihan), dan `answer` (indeks 0–3 atau A–D), atau objek dengan properti `questions` berisi array tersebut.

> Versi ini menyimpan bank soal di localStorage browser. Soal hanya tersedia di browser/perangkat yang mengunggahnya; sinkronisasi antar perangkat membutuhkan database backend.

## Deployment Vercel

Impor repo `dtindro54-ctrl/exambppp` ke Vercel. Build terbaru pada branch `main` akan memicu deployment otomatis bila integrasi repo sudah aktif.
