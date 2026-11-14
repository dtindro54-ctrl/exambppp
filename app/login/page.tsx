'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Login server belum dikonfigurasi. Admin perlu mengisi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel.');
      return;
    }

    setBusy(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError || !data.user) {
      setError('Login gagal. Periksa email/ID akun dan kata sandi, atau hubungi administrator sekolah.');
      setBusy(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, role, student_id')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setError('Profil akun belum terdaftar. Minta administrator menyiapkan akun Anda.');
      setBusy(false);
      return;
    }

    // Compatibility for pages still being migrated away from demo localStorage.
    // Server authorization must use the Supabase session/profile and RLS, never this value.
    localStorage.setItem('exambppp-session', JSON.stringify({
      name: profile.full_name,
      role: profile.role === 'admin' ? 'admin' : 'participant',
      username: profile.student_id ?? data.user.email ?? '',
    }));

    const requested = searchParams.get('next') ?? '/dashboard';
    const safePath = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/dashboard';
    router.replace(safePath);
  };

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white"><div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-soft lg:grid-cols-2">
    <div className="bg-gradient-to-br from-brand-600 to-brand-900 p-10"><p className="text-sm uppercase tracking-[0.2em] text-brand-100">EXAMBPPP</p><h1 className="mt-5 text-4xl font-black">Portal ujian sekolah</h1><p className="mt-5 text-brand-50/80">Masuk menggunakan akun yang dibuat administrator sekolah.</p><div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">Akun demo lama sudah dinonaktifkan di halaman ini. Gunakan akun Supabase sekolah.</div></div>
    <div className="p-8 md:p-10"><p className="text-sm text-slate-400">Autentikasi sekolah</p><h2 className="mt-2 text-3xl font-bold">Masuk</h2><form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm text-slate-300">Email akun<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-brand-500" placeholder="akun dari administrator" /></label><label className="block text-sm text-slate-300">Kata sandi<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-brand-500" placeholder="Kata sandi" /></label>{error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}<button disabled={busy} className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold disabled:opacity-60">{busy ? 'Memeriksa akun…' : 'Masuk'}</button></form><div className="mt-6 text-center text-sm text-slate-400"><Link href="/" className="text-brand-300">Kembali ke beranda</Link></div></div>
  </div></main>;
}

export default function LoginPage() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Memuat halaman login…</div>}><LoginForm /></Suspense>;
}
