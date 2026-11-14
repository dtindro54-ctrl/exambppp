'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStoredJson, type Result, type Session } from '@/lib/demo-data';

export default function CertificatePage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadStoredJson<Session | null>('exambppp-session', null);
    if (!session) { router.replace('/login'); return; }
    const latest = loadStoredJson<Result[]>('exambppp-results', [])[0];
    if (latest) setResult(latest);
    setReady(true);
  }, [router]);

  const passed = result ? result.score / result.total * 100 >= 70 : false;
  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-4xl">
    <header className="mb-6 flex justify-between gap-3 print:hidden"><Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2">Dashboard</Link>{result && passed && <button onClick={() => window.print()} className="rounded-full bg-brand-500 px-5 py-2 font-semibold">Cetak sertifikat</button>}</header>
    {!ready ? <p>Memuat sertifikat…</p> : !result ? <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h1 className="text-2xl font-bold">Sertifikat belum tersedia</h1><p className="mt-2 text-slate-400">Selesaikan ujian terlebih dahulu untuk melihat kelayakan sertifikat.</p></section> : !passed ? <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h1 className="text-2xl font-bold">Belum memenuhi syarat</h1><p className="mt-2 text-slate-400">Sertifikat demo tersedia untuk nilai minimal 70. Nilai terakhir: {result.score}/{result.total}.</p></section> : <article className="certificate rounded-lg border-[10px] border-double border-amber-500 bg-white p-8 text-center text-slate-900 shadow-soft md:p-16"><p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-700">EXAMBPPP · Sertifikat</p><h1 className="mt-8 text-4xl font-black md:text-5xl">SERTIFIKAT KELULUSAN</h1><p className="mt-8 text-lg">Diberikan kepada</p><p className="mt-3 border-b-2 border-slate-300 pb-3 text-3xl font-bold">{result.name}</p><p className="mx-auto mt-8 max-w-2xl leading-relaxed">Atas keberhasilannya menyelesaikan ujian <strong>Tes Kompetensi Dasar</strong> dengan nilai <strong>{result.score}/{result.total}</strong>.</p><p className="mt-6 text-slate-600">Diterbitkan pada {result.date}</p><div className="mt-14 flex justify-center"><div className="border-t border-slate-500 px-12 pt-2"><p className="font-semibold">Administrator</p><p className="text-sm text-slate-500">EXAMBPPP</p></div></div><p className="mt-10 text-xs text-slate-500 print:hidden">Sertifikat demo berdasarkan hasil terbaru yang tersimpan di browser ini.</p></article>}
    <p className="mt-4 text-xs text-amber-200 print:hidden">Sertifikat ini masih versi demo dan bukan dokumen resmi terverifikasi; data hasil tersimpan lokal.</p>
  </div></main>;
}
