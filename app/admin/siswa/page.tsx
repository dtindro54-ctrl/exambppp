'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { loadStoredJson, saveStoredJson, type Session, type Student } from '@/lib/demo-data';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const session = loadStoredJson<Session | null>('exambppp-session', null);
    if (!session || session.role !== 'admin') { router.replace('/login'); return; }
    setStudents(loadStoredJson<Student[]>('exambppp-students', []));
    setReady(true);
  }, [router]);

  const classes = useMemo(() => Array.from(new Set(students.map((student) => student.className))).sort((a, b) => a.localeCompare(b, 'id')), [students]);
  const visible = useMemo(() => students.filter((student) => `${student.name} ${student.id} ${student.username} ${student.className}`.toLowerCase().includes(search.toLowerCase())), [students, search]);

  const persist = (next: Student[]) => { setStudents(next); saveStoredJson('exambppp-students', next); };
  const addStudent = (event: FormEvent) => {
    event.preventDefault(); setError('');
    const cleanName = name.trim(); const cleanClass = className.trim(); const cleanUsername = username.trim();
    if (!cleanName || !cleanClass || !cleanUsername) { setError('Nama, kelas/tingkat, dan ID login wajib diisi.'); return; }
    if (students.some((student) => student.username.toLowerCase() === cleanUsername.toLowerCase())) { setError('ID login sudah dipakai. Gunakan ID yang berbeda.'); return; }
    const student: Student = { id: `S-${Date.now().toString().slice(-8)}`, name: cleanName, className: cleanClass, username: cleanUsername };
    persist([...students, student]); setName(''); setClassName(''); setUsername('');
  };

  const removeStudent = (id: string) => { if (window.confirm('Hapus data siswa ini?')) persist(students.filter((student) => student.id !== id)); };

  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-6xl">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-200">Administrator</p><h1 className="mt-2 text-4xl font-black">Data siswa</h1></div><Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2">Dashboard</Link></header>
    <form onSubmit={addStudent} className="mb-8 grid gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-4 md:items-end"><label className="text-sm text-slate-300">Nama siswa<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" placeholder="Nama lengkap" /></label><label className="text-sm text-slate-300">Tingkat / kelas<input value={className} onChange={(event) => setClassName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" placeholder="Contoh: Kelas 7A" /></label><label className="text-sm text-slate-300">ID login<input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" placeholder="Contoh: siswa001" /></label><button className="rounded-xl bg-brand-500 px-4 py-3 font-semibold">Tambah siswa</button>{error && <p role="alert" className="text-sm text-red-300 md:col-span-4">{error}</p>}</form>
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold">Daftar siswa per kelas</h2><p className="mt-1 text-sm text-slate-400">{ready ? `${students.length} siswa · ${classes.length} kelas` : 'Memuat data…'}</p></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari siswa, ID, kelas…" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2" /></div>
      {visible.length === 0 ? <p className="rounded-xl bg-slate-950 p-5 text-slate-400">Belum ada data yang cocok. Tambahkan siswa menggunakan formulir di atas.</p> : classes.map((group) => { const groupStudents = visible.filter((student) => student.className === group); if (!groupStudents.length) return null; return <div key={group} className="mb-6 last:mb-0"><h3 className="mb-3 flex items-center gap-2 text-lg font-bold"><GraduationCap size={20} className="text-brand-300" />{group} <span className="text-sm font-normal text-slate-400">({groupStudents.length})</span></h3><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="p-3">Nama</th><th className="p-3">ID peserta</th><th className="p-3">ID login</th><th className="p-3">Aksi</th></tr></thead><tbody>{groupStudents.map((student) => <tr key={student.id} className="border-t border-slate-800"><td className="p-3">{student.name}</td><td className="p-3">{student.id}</td><td className="p-3">{student.username}</td><td className="p-3"><button onClick={() => removeStudent(student.id)} className="text-red-300">Hapus</button></td></tr>)}</tbody></table></div></div>; })}
    </section><p className="mt-5 text-xs text-amber-200">Mode demo: data siswa tersimpan di browser ini. ID login di sini adalah pencatatan roster, belum menjadi akun autentikasi server.</p>
  </div></main>;
}
