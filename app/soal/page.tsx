import Link from 'next/link';

const upcoming = [
  { title: 'Tes Literasi', time: '08:00', status: 'Ready' },
  { title: 'Ujian Akhir', time: '10:30', status: 'Scheduled' },
  { title: 'Try Out', time: '13:15', status: 'Ready' },
];

export default function ParticipantPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Peserta</p>
            <h1 className="mt-2 text-4xl font-black">Portal ujian</h1>
          </div>
          <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Dashboard
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Jadwal ujian saya</h2>
            <div className="mt-6 space-y-4">
              {upcoming.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.time}</p>
                  </div>
                  <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-1 text-xs text-brand-200">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Info akun</h2>
            <div className="mt-6 space-y-4 text-slate-200">
              <div className="rounded-2xl bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Nama</p>
                <p className="mt-2 text-xl font-semibold">Peserta Ujian</p>
              </div>
              <div className="rounded-2xl bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <p className="mt-2 text-xl font-semibold text-emerald-300">Aktif</p>
              </div>
              <Link href="/ujian" className="mt-4 block rounded-full bg-brand-500 px-5 py-3 text-center font-semibold text-white">
                Mulai ujian
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
