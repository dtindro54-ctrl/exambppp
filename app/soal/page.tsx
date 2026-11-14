'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

import { defaultQuestions, loadStoredJson, saveStoredJson, type Question } from '@/lib/demo-data';
import { parseQuestionFile } from '@/lib/question-import';

export default function QuestionBankPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setQuestions(loadStoredJson<Question[]>('exambppp-questions', defaultQuestions));
    try {
      const session = JSON.parse(localStorage.getItem('exambppp-session') ?? 'null');
      if (!session || session.role !== 'admin') router.replace('/login');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  const persist = (next: Question[]) => {
    setQuestions(next);
    saveStoredJson('exambppp-questions', next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const addQuestion = () => {
    const nextId = Math.max(0, ...questions.map((question) => question.id)) + 1;
    persist([...questions, { id: nextId, text: 'Tulis pertanyaan baru', options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'], answer: 0 }]);
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setError('');
    setMessage('');
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2 MB.');
      return;
    }

    setBusy(true);
    try {
      const parsed = parseQuestionFile(file.name, await file.text());
      const base = importMode === 'append' ? questions : [];
      let id = Math.max(0, ...base.map((question) => question.id));
      const imported = parsed.map((question) => ({ ...question, id: ++id }));
      persist([...base, ...imported]);
      setMessage(`Berhasil mengimpor ${imported.length} soal dari ${file.name}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'File tidak dapat diproses.');
    } finally {
      setBusy(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'question,optionA,optionB,optionC,optionD,answer\n"Contoh: 2 + 2 = ?","3","4","5","6","B"\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'template-soal-exambppp.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const updateQuestion = (id: number, patch: Partial<Question>) => persist(questions.map((question) => question.id === id ? { ...question, ...patch } : question));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm uppercase tracking-[0.2em] text-brand-200">Administrator</p><h1 className="mt-2 text-4xl font-black">Bank soal</h1></div>
          <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">Dashboard</Link>
        </header>

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h2 className="text-xl font-bold">Upload soal otomatis</h2><p className="mt-2 max-w-2xl text-sm text-slate-400">Unggah file CSV atau JSON. File dibaca otomatis dan soal masuk ke bank soal.</p></div>
            <button type="button" onClick={downloadTemplate} className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-slate-500">Unduh template CSV</button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block text-sm text-slate-300">Jika soal sudah ada
              <select value={importMode} onChange={(event) => setImportMode(event.target.value as 'replace' | 'append')} className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                <option value="replace">Ganti semua soal lama</option><option value="append">Tambahkan ke soal lama</option>
              </select>
            </label>
            <label className={`cursor-pointer rounded-xl bg-brand-500 px-5 py-3 text-center font-semibold hover:bg-brand-600 ${busy ? 'pointer-events-none opacity-50' : ''}`}>
              {busy ? 'Memproses file…' : 'Pilih file soal'}
              <input type="file" accept=".csv,.json,text/csv,application/json" onChange={importFile} disabled={busy} className="sr-only" />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500">Kolom CSV: question, optionA, optionB, optionC, optionD, answer. Jawaban benar isi A/B/C/D atau 1/2/3/4. Maksimal file 2 MB.</p>
          {message && <p role="status" className="mt-4 text-sm text-emerald-300">{message}</p>}
          {error && <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        </section>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-slate-400">Jumlah soal: {questions.length}. Data tersimpan di browser ini.</p>
          <div className="flex gap-3"><button onClick={() => persist(defaultQuestions)} className="rounded-full border border-slate-700 px-4 py-2 text-sm">Reset demo</button><button onClick={addQuestion} className="rounded-full bg-brand-500 px-5 py-3 font-semibold">Tambah soal</button></div>
        </div>
        {saved && <p role="status" className="mb-4 text-sm text-emerald-300">Perubahan tersimpan.</p>}

        <div className="space-y-5">
          {questions.map((question, index) => <article key={question.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Soal {index + 1}</h2><button onClick={() => persist(questions.filter((item) => item.id !== question.id))} className="text-sm text-red-300">Hapus</button></div>
            <label className="mb-2 block text-sm text-slate-400">Pertanyaan</label>
            <textarea value={question.text} onChange={(event) => updateQuestion(question.id, { text: event.target.value })} className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 p-3" rows={2} />
            <div className="grid gap-3 md:grid-cols-2">{question.options.map((option, optionIndex) => <label key={optionIndex} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3"><input type="radio" name={`answer-${question.id}`} checked={question.answer === optionIndex} onChange={() => updateQuestion(question.id, { answer: optionIndex })} /><input aria-label={`Pilihan ${optionIndex + 1}`} value={option} onChange={(event) => { const options = [...question.options]; options[optionIndex] = event.target.value; updateQuestion(question.id, { options }); }} className="min-w-0 flex-1 bg-transparent outline-none" /></label>)}</div>
            <p className="mt-3 text-xs text-slate-500">Pilih radio untuk menetapkan jawaban benar.</p>
          </article>)}
        </div>

        <div className="mt-8 flex gap-3"><Link href="/ujian" className="inline-block rounded-full bg-emerald-600 px-5 py-3 font-semibold">Pratinjau ujian</Link><Link href="/admin" className="inline-block rounded-full border border-slate-700 px-5 py-3 font-semibold">Panel admin</Link></div>
      </div>
    </main>
  );
}
