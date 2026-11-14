export type Role = 'admin' | 'participant';

export type Session = {
  name: string;
  role: Role;
  username: string;
};

export type Question = {
  id: number;
  text: string;
  options: string[];
  answer: number;
};

export type Result = {
  name: string;
  score: number;
  total: number;
  date: string;
};

export type Student = {
  id: string;
  name: string;
  className: string;
  username: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  className: string;
};

export const demoUsers: Record<Role, { username: string; password: string; role: Role; name: string }> = {
  admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin Utama' },
  participant: { username: 'peserta', password: 'peserta123', role: 'participant', name: 'Peserta Ujian' },
};

export const defaultQuestions: Question[] = [
  { id: 1, text: 'Perangkat lunak yang digunakan untuk mengelola dan menjalankan ujian secara digital disebut?', options: ['Learning Management System', 'Database Engine', 'Text Editor', 'Browser Cache'], answer: 0 },
  { id: 2, text: 'Tujuan utama dari sistem ujian online adalah?', options: ['Mengurangi transparansi', 'Mempermudah evaluasi dan pelacakan hasil', 'Menghilangkan semua interaksi', 'Membatasi akses peserta'], answer: 1 },
  { id: 3, text: 'Timer ujian digunakan untuk apa?', options: ['Mengatur nilai', 'Membatasi waktu pengerjaan', 'Membuat soal', 'Mengelola akun'], answer: 1 },
  { id: 4, text: 'Apa fungsi utama laporan hasil ujian?', options: ['Menganalisis performa peserta', 'Mengganti soal', 'Menghapus jawaban', 'Menghindari evaluasi'], answer: 0 },
  { id: 5, text: 'Data peserta wajib dikelola dengan prinsip?', options: ['Akses terbuka', 'Kontrol akses dan perlindungan privasi', 'Dibagikan ke publik', 'Tanpa aturan'], answer: 1 },
];

export const defaultResults: Result[] = [
  { name: 'Peserta Ujian', score: 88, total: 100, date: '14 Nov 2026, 09:30' },
  { name: 'Peserta Ujian', score: 80, total: 100, date: '12 Nov 2026, 08:45' },
];

export const defaultExams = [
  { name: 'Seleksi Masuk', date: '14 Nov 2026', status: 'Aktif', participants: 320 },
  { name: 'Tes Kompetensi', date: '15 Nov 2026', status: 'Draft', participants: 180 },
  { name: 'Evaluasi Akhir', date: '17 Nov 2026', status: 'Siap', participants: 402 },
];

export const loadStoredJson = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const saveStoredJson = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};
