'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookOpen, CheckCircle2, Clock3, ShieldCheck, Users } from 'lucide-react';

import { defaultExams, loadStoredJson, type Session } from '@/lib/demo-data';

const stats = [
  { label: 'Peserta aktif', value: 'Demo', icon: Users },
  { label: 'Ujian', value: '1', icon: Clock3 },
  { label: 'Nilai rata-rata', value: 'Lokal', icon: BarChart3 },
  { label: 'Hasil', value: 'Perangkat ini', icon: CheckCircle2 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const stored = loadStoredJson<Session | null>('exambppp-session', null);
    if (!stored) { router.replace('/login'); return; }
    setSession(stored);
  }, [router]);
  const isAdmin = useMemo(() => session?.role === 'admin', [session]);
  if (!session) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Memuat dashboard...</div>;

  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-7xl"><header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-100">EXAMBPPP</p><h1 className="mt-2 text-3xl font-bold">{isAdmin ? 'Dashboard admin' : 'Portal peserta'}</h1></div><div className="flex items-center gap-3"><span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm">{session.name}</span><button onClick={() => { localStorage.removeItem('exambppp-session'); document.cookie = 'exambppp_session=; path=/; max-age=0; SameSite=Lax'; router.replace('/login'); }} className="rounded-full border border-slate-700 px-4 py-2 text-sm">Keluar</button></div></header>
    {isAdmin ? <><section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-2xl font-bold">{value}</p></div><div className="rounded-2xl bg-brand-500/15 p-3 text-brand-300"><Icon size={24}/></div></div></div>)}</section><section className="mt-8 grid gap-5 md:grid-cols-3"><Link href="/soal" className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-brand-500"><BookOpen className="mb-3 text-brand-300"/><h2 className="text-xl font-bold">Bank soal</h2><p className="mt-2 text-sm text-slate-400">Kelola dan upload soal ujian.</p></Link><Link href="/admin/hasil" className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-brand-500"><BarChart3 className="mb-3 text-brand-300"/><h2 className="text-xl font-bold">Cetak nilai</h2><p className="mt-2 text-sm text-slate-400">Lihat dan cetak rekap hasil ujian.</p></Link><Link href="/admin" className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-brand-500"><ShieldCheck className="mb-3 text-brand-300"/><h2 className="text-xl font-bold">Panel admin</h2><p className="mt-2 text-sm text-slate-400">Buka ringkasan admin.</p></Link></section><section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6"><h2 className="mb-5 text-2xl font-bold">Daftar ujian</h2><div className="space-y-4">{defaultExams.map((exam) => <div key={exam.name} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"><div><p className="font-semibold">{exam.name}</p><p className="text-sm text-slate-400">{exam.date}</p></div><span className="text-sm text-slate-300">{exam.participants} peserta · {exam.status}</span></div>)}</div></section><p className="mt-5 text-sm text-amber-200">Mode demo: hasil hanya terlihat pada browser/perangkat ini.</p></> : <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm text-slate-400">Siap mengikuti ujian?</p><h2 className="mt-2 text-2xl font-bold">Tes Kompetensi Dasar</h2><p className="mt-2 text-slate-300">Ujian bertimer dengan penilaian otomatis.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/ujian" className="rounded-full bg-brand-500 px-5 py-3 font-semibold">Mulai ujian</Link><Link href="/hasil" className="rounded-full border border-slate-700 px-5 py-3 font-semibold">Riwayat nilai</Link><Link href="/sertifikat" className="rounded-full border border-slate-700 px-5 py-3 font-semibold">Sertifikat</Link></div></section>}
  </div></main>;
}
