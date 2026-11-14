'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, CheckCircle2, Clock3, ShieldCheck, Users } from 'lucide-react';

const statCards = [
  { label: 'Peserta aktif', value: '1,284', icon: Users },
  { label: 'Ujian hari ini', value: '42', icon: Clock3 },
  { label: 'Nilai rata-rata', value: '87%', icon: BarChart3 },
  { label: 'Selesai', value: '96%', icon: CheckCircle2 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; role: string; username: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('exambppp-session');
    if (!stored) {
      router.push('/login');
      return;
    }

    setSession(JSON.parse(stored));
  }, [router]);

  if (!session) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Memuat dashboard...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-100">EXAMBPPP</p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
              {session.name}
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('exambppp-session');
                router.push('/login');
              }}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
            >
              Keluar
            </button>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-white">{value}</p>
                </div>
                <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-300">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Daftar ujian</h2>
              <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white">Buat ujian</button>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Ujian Seleksi Masuk', date: 'Senin, 14 Nov 2026', status: 'Aktif', color: 'text-emerald-300' },
                { title: 'Tes Kompetensi Umum', date: 'Selasa, 15 Nov 2026', status: 'Draft', color: 'text-amber-300' },
                { title: 'Evaluasi Akhir Semester', date: 'Kamis, 17 Nov 2026', status: 'Siap', color: 'text-sky-300' },
              ].map((exam) => (
                <div key={exam.title} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-brand-500/10 p-3 text-brand-300">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{exam.title}</p>
                      <p className="text-sm text-slate-400">{exam.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${exam.color}`}>{exam.status}</span>
                    <Link href="/ujian" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500">
                      Mulai
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="text-brand-300" />
              <h2 className="text-xl font-bold">Ringkasan</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Kehadiran</p>
                <p className="mt-2 text-2xl font-bold text-white">92%</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Jumlah soal</p>
                <p className="mt-2 text-2xl font-bold text-white">40</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Durasi</p>
                <p className="mt-2 text-2xl font-bold text-white">60 menit</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
