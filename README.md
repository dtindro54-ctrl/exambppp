'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HasilPage() {
  const router = useRouter();
  const [results, setResults] = useState<{ name: string; score: number; total: number; date: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('exambppp-session');
    if (!stored) {
      router.push('/login');
      return;
    }

    const saved = JSON.parse(localStorage.getItem('exambppp-results') ?? '[]');
    setResults(saved);
  }, [router]);

  const latest = results[0];
  const passing = latest ? (latest.score / latest.total) * 100 : 0;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Hasil ujian</p>
          <h1 className="mt-4 text-4xl font-black">Selamat, {latest?.name ?? 'Peserta'}!</h1>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Nilai</p>
              <p className="mt-2 text-3xl font-bold text-white">{latest?.score ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Skor maksimal</p>
              <p className="mt-2 text-3xl font-bold text-white">{latest?.total ?? 100}</p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Persentase</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">{Math.round(passing)}%</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            {passing >= 70 ? 'Lulus. Hasil ujian Anda telah tersimpan.' : 'Belum mencapai passing grade. Silakan coba lagi di kesempatan berikutnya.'}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Riwayat hasil</h2>
            <div className="mt-4 space-y-3">
              {results.length === 0 ? (
                <p className="text-slate-400">Belum ada hasil ujian.</p>
              ) : (
                results.map((item, index) => (
                  <div key={`${item.date}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.date}</p>
                    </div>
                    <p className="text-lg font-bold text-brand-300">{item.score}/{item.total}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="rounded-full bg-brand-500 px-5 py-3 text-center font-semibold text-white">
              Kembali ke dashboard
            </Link>
            <Link href="/login" className="rounded-full border border-slate-700 px-5 py-3 text-center font-semibold text-slate-200">
              Login lagi
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
