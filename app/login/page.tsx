'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { demoUsers, type Role } from '@/lib/demo-data';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const user = demoUsers[selectedRole];
    if (username === user.username && password === user.password) {
      const session = { name: user.name, role: user.role, username: user.username };
      localStorage.setItem('exambppp-session', JSON.stringify(session));
      document.cookie = `exambppp_session=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=86400; SameSite=Lax`;
      router.push('/dashboard');
      return;
    }

    setError('Username atau password salah. Gunakan akun demo yang tersedia.');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-soft lg:grid-cols-2">
        <div className="bg-gradient-to-br from-brand-600 to-brand-900 p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-100">EXAMBPPP</p>
          <h1 className="mt-5 text-4xl font-black">Akses portal ujian digital</h1>
          <p className="mt-5 max-w-md text-brand-50/80">
            Portal demo untuk admin dan peserta, siap dikembangkan menjadi sistem ujian produksi.
          </p>

          <div className="mt-10 space-y-4 text-sm text-brand-50">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Admin: admin / admin123</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Peserta: peserta / peserta123</div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <p className="text-sm text-slate-400">Masuk ke akun</p>
            <h2 className="mt-2 text-3xl font-bold">Login</h2>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-950 p-2">
            <button type="button" onClick={() => setSelectedRole('admin')} className={`rounded-xl px-4 py-2 font-medium transition ${selectedRole === 'admin' ? 'bg-brand-500 text-white' : 'text-slate-300'}`}>
              Admin
            </button>
            <button type="button" onClick={() => setSelectedRole('participant')} className={`rounded-xl px-4 py-2 font-medium transition ${selectedRole === 'participant' ? 'bg-brand-500 text-white' : 'text-slate-300'}`}>
              Peserta
            </button>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Username</label>
              <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-brand-500" placeholder="Masukkan username" />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-brand-500" placeholder="Masukkan password" />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link href="/" className="text-brand-300 hover:text-brand-200">Kembali ke beranda</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
