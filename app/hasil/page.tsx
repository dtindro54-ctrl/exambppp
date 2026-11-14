'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Result = { name: string; score: number; total: number; date: string };
export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  useEffect(() => {
    if (!localStorage.getItem('exambppp-session')) { router.replace('/login'); return; }
    try { setResults(JSON.parse(localStorage.getItem('exambppp-results') ?? '[]')); } catch { setResults([]); }
  }, [router]);
  const latest = results[0];
  const percent = latest ? Math.round(latest.score / latest.total * 100) : 0;
  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-soft"><p className="text-sm uppercase tracking-[0.2em] text-brand-200">Hasil ujian</p><h1 className="mt-4 text-4xl font-black">{latest ? `Hasil ${latest.name}` : 'Belum ada hasil ujian'}</h1>{latest && <><div className="mt-8 grid gap-5 md:grid-cols-3"><div className="rounded-2xl bg-slate-950 p-5"><p className="text-sm text-slate-400">Nilai</p><p className="mt-2 text-3xl font-bold">{latest.score}</p></div><div className="rounded-2xl bg-slate-950 p-5"><p className="text-sm text-slate-400">Maksimal</p><p className="mt-2 text-3xl font-bold">{latest.total}</p></div><div className="rounded-2xl bg-slate-950 p-5"><p className="text-sm text-slate-400">Persentase</p><p className="mt-2 text-3xl font-bold text-emerald-300">{percent}%</p></div></div><p className="mt-6 rounded-2xl border border-slate-700 p-4 text-slate-300">{latest.date} · {percent >= 70 ? 'Lulus' : 'Belum mencapai nilai kelulusan'}</p></>}
    <section className="mt-8"><h2 className="text-xl font-bold">Riwayat nilai pada perangkat ini</h2><div className="mt-4 space-y-3">{results.length === 0 ? <p className="text-slate-400">Selesaikan ujian untuk melihat hasil di sini.</p> : results.map((item, index) => <div key={`${item.date}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-slate-400">{item.date}</p></div><p className="font-bold text-brand-300">{item.score}/{item.total}</p></div>)}</div></section><div className="mt-8 flex flex-wrap gap-3"><Link href="/dashboard" className="rounded-full bg-brand-500 px-5 py-3 font-semibold">Ke dashboard</Link><Link href="/ujian" className="rounded-full border border-slate-700 px-5 py-3 font-semibold">Ulangi ujian</Link></div>
  </div></main>;
}
