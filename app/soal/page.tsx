'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { defaultQuestions, loadStoredJson, saveStoredJson, type Question, type Result } from '@/lib/demo-data';

export default function QuestionBankPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = loadStoredJson<Question[]>('exambppp-questions', defaultQuestions);
    setQuestions(stored);
  }, []);

  const persist = (next: Question[]) => {
    setQuestions(next);
    saveStoredJson('exambppp-questions', next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const addQuestion = () => {
    const nextId = Math.max(0, ...questions.map((question) => question.id)) + 1;
    persist([
      ...questions,
      {
        id: nextId,
        text: 'Tulis pertanyaan baru',
        options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        answer: 0,
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    persist(questions.filter((question) => question.id !== id));
  };

  const updateQuestion = (id: number, patch: Partial<Question>) => {
    persist(questions.map((question) => (question.id === id ? { ...question, ...patch } : question)));
  };

  const resetQuestions = () => {
    persist(defaultQuestions);
  };

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('exambppp-session') ?? 'null');
      if (!session) router.replace('/login');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Administrator</p>
            <h1 className="mt-2 text-4xl font-black">Bank soal</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={resetQuestions} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">Reset demo</button>
            <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">Dashboard</Link>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-slate-400">Data soal tersimpan pada browser ini dan dipakai saat peserta memulai ujian.</p>
          <button onClick={addQuestion} className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-white">Tambah soal</button>
        </div>

        {saved && <p className="mb-4 text-sm text-emerald-300">Perubahan tersimpan.</p>}

        <div className="space-y-5">
          {questions.map((question, index) => (
            <article key={question.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold">Soal {index + 1}</h2>
                <button onClick={() => removeQuestion(question.id)} className="text-sm text-red-300">Hapus</button>
              </div>

              <label className="mb-2 block text-sm text-slate-400">Pertanyaan</label>
              <textarea value={question.text} onChange={(event) => updateQuestion(question.id, { text: event.target.value })} className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 p-3" rows={2} />

              <div className="grid gap-3 md:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <input type="radio" name={`answer-${question.id}`} checked={question.answer === optionIndex} onChange={() => updateQuestion(question.id, { answer: optionIndex })} />
                    <input aria-label={`Pilihan ${optionIndex + 1}`} value={option} onChange={(event) => {
                      const options = [...question.options];
                      options[optionIndex] = event.target.value;
                      updateQuestion(question.id, { options });
                    }} className="min-w-0 flex-1 bg-transparent outline-none" />
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Pilih radio untuk menetapkan jawaban benar.</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/ujian" className="inline-block rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">Pratinjau ujian</Link>
          <Link href="/admin" className="inline-block rounded-full border border-slate-700 px-5 py-3 font-semibold text-slate-200">Panel admin</Link>
        </div>
      </div>
    </main>
  );
}
