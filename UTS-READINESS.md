# Penggunaan ujian untuk UTS — status dan persiapan wajib

Perubahan terbaru menambahkan guardrail database Supabase untuk memulai ujian, menyimpan jawaban, menghitung nilai di server, dan mencatat pelanggaran fokus/tab. Migration ini harus diterapkan setelah `202611140001_initial_exam_schema.sql`.

## Status jujur

Repo saat ini **belum siap langsung dipakai untuk UTS**: halaman aplikasi masih memakai login demo/localStorage dan belum terhubung ke Supabase. Migration database adalah fondasi keamanan, bukan pengganti integrasi aplikasi, setup akun, pengujian, dan deployment. Jangan memasukkan data nyata siswa atau menjalankan ujian resmi lewat UI demo.

## Sebelum UTS

1. Buat project Supabase milik sekolah dan project terpisah untuk uji coba.
2. Terapkan migration pertama lalu migration `202611140002_exam_guardrails.sql` di Supabase SQL Editor.
3. Buat admin melalui Supabase Auth, tetapkan role admin pada profil menggunakan trusted SQL/admin process. Jangan pernah mengirim service-role key ke browser atau commit ke Git.
4. Hubungkan aplikasi dengan Supabase Auth dan database di server/client yang sesuai; implementasikan login admin/siswa, roster, kelas/mapel, bank soal, jadwal ujian, penyimpanan jawaban berkala, submit, hasil/sertifikat, dan audit log. Rute yang menggunakan data browser demo harus diganti, bukan sekadar ditambahkan berdampingan.
5. Uji dengan akun dan data fiktif: akses antar kelas, izin admin/siswa, batas jadwal/durasi, reconnect, submit ganda, browser refresh, cetak hasil, backup/restore.
6. Tinjau keamanan, privasi dan persetujuan orang tua/sekolah, aksesibilitas, kapasitas, serta prosedur gangguan internet. Baru setelah semua lulus, deploy ke Vercel dan jalankan simulasi UTS.

## Pengawasan

Aplikasi web dapat mencatat visibility/focus change sebagai sinyal pengawasan; sinyal ini tidak anti-pemalsuan dan bukan bukti kecurangan. Situs web tidak dapat mengunci seluruh HP atau mencegah perpindahan ke WhatsApp/browser lain. Jika diwajibkan, gunakan perangkat sekolah terkelola dengan kiosk/lockdown browser resmi dan pengawas.

Kredensial demo `admin/admin123` dan `peserta/peserta123` hanya untuk demonstrasi. Jangan berikan ke siswa untuk ujian resmi.
