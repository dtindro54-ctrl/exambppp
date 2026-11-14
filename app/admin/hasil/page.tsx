'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStoredJson, type Result, type Session } from '@/lib/demo-data';

export default function AdminResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadStoredJson<Session | null>('exambppp-session', null);
    if (!session || session.role !== 'admin') { router.replace('/login'); return; }
    setResults(loadStoredJson<Result[]>('exambppp-results', []));
    setReady(true);
  }, [router]);

  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-6xl">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-200">Administrator</p><h1 className="mt-2 text-4xl font-black">Laporan nilai</h1></div><div className="flex gap-3"><Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2">Dashboard</Link><button onClick={() => window.print()} className="rounded-full bg-brand-500 px-5 py-2 font-semibold">Cetak nilai</button></div></header>
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 print:border-0 print:bg-white print:text-black"><div className="mb-5"><h2 className="text-2xl font-bold">Rekap hasil ujian</h2><p className="mt-1 text-sm text-slate-400 print:text-gray-600">Data lokal pada browser/perangkat ini · {results.length} hasil</p></div>
      {!ready ? <p>Memuat laporan…</p> : results.length === 0 ? <p className="text-slate-400 print:text-gray-600">Belum ada hasil ujian di browser ini.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-700 print:border-gray-400"><th className="p-3">No.</th><th className="p-3">Nama peserta</th><th className="p-3">Tanggal</th><th className="p-3">Nilai</th><th className="p-3">Status</th></tr></thead><tbody>{results.map((result, index) => <tr key={`${result.date}-${index}`} className="border-b border-slate-800 print:border-gray-300"><td className="p-3">{index + 1}</td><td className="p-3">{result.name}</td><td className="p-3">{result.date}</td><td className="p-3">{result.score}/{result.total}</td><td className="p-3">{result.score / result.total * 100 >= 70 ? 'Lulus' : 'Belum lulus'}</td></tr>)}</tbody></table></div>}
    </section><p className="mt-4 text-xs text-amber-200 print:hidden">Catatan: laporan demo ini hanya membaca hasil yang tersimpan di browser yang sedang digunakan. Untuk rekap seluruh peserta dibutuhkan database bersama.</p>
  </div></main>;
}
