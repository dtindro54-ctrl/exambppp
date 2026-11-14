import Link from 'next/link';

const questionList = [
  { id: 1, category: 'Umum', question: 'Apa fungsi utama LMS?', status: 'Published' },
  { id: 2, category: 'Matematika', question: 'Sebuah ujian memiliki timer 60 menit. Apa tujuan utama timer?', status: 'Draft' },
  { id: 3, category: 'Bahasa', question: 'Bagaimana cara menyusun soal pilihan ganda yang baik?', status: 'Published' },
];

export default function SoalPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Soal</p>
            <h1 className="mt-2 text-4xl font-black">Bank soal</h1>
          </div>
          <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Dashboard
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Daftar pertanyaan</h2>
            <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              Tambah soal
            </button>
          </div>

          <div className="space-y-4">
            {questionList.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{item.category}</p>
                  <p className="mt-2 font-medium text-slate-100">{item.question}</p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
