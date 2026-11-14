import Link from 'next/link';

const features = [
  'Admin dashboard',
  'Exam management',
  'Timer-based assessments',
  'Auto-scoring',
  'Public-ready deployment',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-12 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">EXAMBPPP</div>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/login" className="rounded-full border border-slate-700 px-5 py-2 transition hover:border-slate-500 hover:text-white">
              Login
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-brand-100">
              Public exam platform
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Manage exams with speed, clarity, and confidence.
            </h1>

            <p className="mt-6 max-w-lg text-lg text-slate-300">
              EXAMBPPP helps institutions run exam sessions, track participant progress, and publish results in a clean admin experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600">
                Try Demo
              </Link>
              <Link href="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Platform overview</p>
                <h2 className="mt-2 text-3xl font-bold">3.4k</h2>
              </div>
              <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300">
                +18.2%
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3 text-slate-200">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
