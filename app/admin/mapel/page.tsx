'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { loadStoredJson, saveStoredJson, type Session, type Subject } from '@/lib/demo-data';

export default function SubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const session = loadStoredJson<Session | null>('exambppp-session', null);
    if (!session || session.role !== 'admin') { router.replace('/login'); return; }
    setSubjects(loadStoredJson<Subject[]>('exambppp-subjects', []));
  }, [router]);

  const persist = (next: Subject[]) => { setSubjects(next); saveStoredJson('exambppp-subjects', next); };
  const addSubject = (event: FormEvent) => {
    event.preventDefault(); setError('');
    const cleanName = name.trim(); const cleanCode = code.trim().toUpperCase(); const cleanClass = className.trim();
    if (!cleanName || !cleanCode || !cleanClass) { setError('Mata pelajaran, kode, dan tingkat/kelas wajib diisi.'); return; }
    if (subjects.some((subject) => subject.code.toLowerCase() === cleanCode.toLowerCase() && subject.className.toLowerCase() === cleanClass.toLowerCase())) { setError('Kode mata pelajaran sudah terdaftar untuk kelas tersebut.'); return; }
    persist([...subjects, { id: `MP-${Date.now()}`, name: cleanName, code: cleanCode, className: cleanClass }]);
    setName(''); setCode(''); setClassName('');
  };

  const removeSubject = (id: string) => { if (window.confirm('Hapus mata pelajaran ini?')) persist(subjects.filter((subject) => subject.id !== id)); };

  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-5xl">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-200">Administrator</p><h1 className="mt-2 text-4xl font-black">Mata pelajaran</h1></div><Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2">Dashboard</Link></header>
    <form onSubmit={addSubject} className="mb-8 grid gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-4 md:items-end"><label className="text-sm text-slate-300">Nama mata pelajaran<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" placeholder="Contoh: Matematika" /></label><label className="text-sm text-slate-300">Kode<input value={code} onChange={(event) => setCode(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" placeholder="MTK" /></label><label className="text-sm text-slate-300">Tingkat / kelas<input value={className} onChange={(event) => setClassName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" placeholder="Contoh: Kelas 7A" /></label><button className="rounded-xl bg-brand-500 px-4 py-3 font-semibold">Tambah mapel</button>{error && <p role="alert" className="text-sm text-red-300 md:col-span-4">{error}</p>}</form>
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><h2 className="mb-4 text-2xl font-bold">Daftar mata pelajaran</h2>{subjects.length === 0 ? <p className="text-slate-400">Belum ada mata pelajaran. Tambahkan melalui formulir di atas.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="p-3">Nama</th><th className="p-3">Kode</th><th className="p-3">Tingkat/kelas</th><th className="p-3">Aksi</th></tr></thead><tbody>{subjects.map((subject) => <tr key={subject.id} className="border-t border-slate-800"><td className="p-3">{subject.name}</td><td className="p-3">{subject.code}</td><td className="p-3">{subject.className}</td><td className="p-3"><button onClick={() => removeSubject(subject.id)} className="text-red-300">Hapus</button></td></tr>)}</tbody></table></div>}</section>
    <p className="mt-5 text-xs text-amber-200">Mode demo: data mata pelajaran tersimpan di browser ini dan belum tersinkron dengan perangkat lain.</p>
  </div></main>;
}
