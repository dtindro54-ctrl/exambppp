import Link from 'next/link';

const summaryCards = [
  { label: 'Peserta aktif', value: '1,284' },
  { label: 'Total ujian', value: '42' },
  { label: 'Nilai rata-rata', value: '87%' },
  { label: 'Lulus', value: '96%' },
];

const examRows = [
  { name: 'Seleksi Masuk', date: '14 Nov 2026', status: 'Aktif', participants: 320 },
  { name: 'Tes Kompetensi', date: '15 Nov 2026', status: 'Draft', participants: 180 },
  { name: 'Evaluasi Akhir', date: '17 Nov 2026', status: 'Siap', participants: 402 },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Admin</p>
            <h1 className="mt-2 text-4xl font-black">Panel pengelola</h1>
          </div>
          <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Kembali ke dashboard
          </Link>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Daftar ujian</h2>
            <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              Tambah ujian
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-4 pr-4">Nama ujian</th>
                  <th className="pb-4 pr-4">Tanggal</th>
                  <th className="pb-4 pr-4">Status</th>
                  <th className="pb-4 pr-4">Peserta</th>
                </tr>
              </thead>
              <tbody>
                {examRows.map((exam) => (
                  <tr key={exam.name} className="border-t border-slate-800 text-slate-200">
                    <td className="py-4 pr-4 font-medium">{exam.name}</td>
                    <td className="py-4 pr-4">{exam.date}</td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">{exam.participants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
