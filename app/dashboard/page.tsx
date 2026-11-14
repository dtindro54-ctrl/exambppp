'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, CheckCircle2, Clock3, ShieldCheck, Users } from 'lucide-react';

const adminStats = [
  { label: 'Peserta aktif', value: 'Demo', icon: Users },
  { label: 'Ujian', value: '1', icon: Clock3 },
  { label: 'Nilai rata-rata', value: 'Lokal', icon: BarChart3 },
  { label: 'Hasil tersimpan', value: 'Browser', icon: CheckCircle2 },
];
export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);
  useEffect(() => { try { const data = localStorage.getItem('exambppp-session'); if (!data) { router.replace('/login'); return; } setSession(JSON.parse(data)); } catch { router.replace('/login'); } }, [router]);
  if (!session) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Memuat dashboard...</div>;
  const isAdmin = session.role === 'admin';
  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-7xl"><header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-100">EXAMBPPP</p><h1 className="mt-2 text-3xl font-bold">{isAdmin ? 'Dashboard admin' : 'Portal peserta'}</h1></div><div className="flex items-center gap-3"><span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm">{session.name}</span><button onClick={() => { localStorage.removeItem('exambppp-session'); router.replace('/login'); }} className="rounded-full border border-slate-700 px-4 py-2 text-sm">Keluar</button></div></header>
    {isAdmin ? <><section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{adminStats.map(({ label, value, icon: Icon }) => <div key={label} className="card p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-2xl font-bold">{value}</p></div><div className="rounded-2xl bg-brand-500/15 p-3 text-brand-300"><Icon size={24}/></div></div></div>)}</section><section className="mt-8 grid gap-5 md:grid-cols-2"><Link href="/soal" className="card p-6 transition hover:border-brand-500"><BookOpen className="mb-3 text-brand-300"/><h2 className="text-xl font-bold">Kelola bank soal</h2><p className="mt-2 text-sm text-slate-400">Tambah, ubah, dan hapus soal serta atur jawaban benar.</p></Link><Link href="/admin" className="card p-6 transition hover:border-brand-500"><ShieldCheck className="mb-3 text-brand-300"/><h2 className="text-xl font-bold">Panel admin</h2><p className="mt-2 text-sm text-slate-400">Lihat ringkasan fitur pengelolaan.</p></Link></section><p className="mt-6 text-sm text-amber-200">Mode demo: data hanya tersimpan di browser ini.</p></> : <><section className="card p-6"><p className="text-sm text-slate-400">Siap mengikuti ujian?</p><h2 className="mt-2 text-2xl font-bold">Tes Kompetensi Dasar</h2><p className="mt-2 text-slate-300">Ujian bertimer dengan penilaian otomatis.</p><Link href="/ujian" className="mt-6 inline-block rounded-full bg-brand-500 px-5 py-3 font-semibold">Mulai ujian</Link><Link href="/hasil" className="ml-3 inline-block rounded-full border border-slate-700 px-5 py-3 font-semibold">Riwayat hasil</Link></section><p className="mt-6 text-sm text-amber-200">Mode demo: hasil tersimpan di browser yang digunakan.</p></>}
  </div></main>;
}
