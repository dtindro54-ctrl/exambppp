'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { defaultQuestions, loadStoredJson, saveStoredJson, type Question } from '@/lib/demo-data';

export default function ExamPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(8 * 60);
  const submitted = useRef(false);

  const currentQuestion = questions[current];
  const answeredCount = Object.keys(answers).length;
  const progress = useMemo(() => (questions.length ? (answeredCount / questions.length) * 100 : 0), [answeredCount, questions.length]);

  useEffect(() => {
    const storedSession = loadStoredJson<{ name: string; role: string; username: string } | null>('exambppp-session', null);
    if (!storedSession) {
      router.replace('/login');
      return;
    }
    if (storedSession.role !== 'participant') {
      router.replace('/dashboard');
      return;
    }

    setSession(storedSession);

    const storedQuestions = loadStoredJson<Question[]>('exambppp-questions', defaultQuestions);
    setQuestions(storedQuestions);
  }, [router]);

  const submitExam = () => {
    if (submitted.current) return;
    submitted.current = true;

    const score = questions.reduce((total, question) => {
      const answerIndex = answers[question.id];
      return total + (answerIndex === question.answer ? 100 / questions.length : 0);
    }, 0);

    const payload = {
      name: session?.name ?? 'Peserta',
      score: Math.round(score),
      total: 100,
      date: new Date().toLocaleString('id-ID'),
    };

    const existing = loadStoredJson<Array<{ name: string; score: number; total: number; date: string }>>('exambppp-results', []);
    saveStoredJson('exambppp-results', [payload, ...existing].slice(0, 100));
    router.push('/hasil');
  };

  useEffect(() => {
    if (!session || submitted.current) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timer);
          submitExam();
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [session]);

  if (!session || !currentQuestion) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Memuat ujian...</div>;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div>
            <p className="text-sm text-slate-400">Ujian digital</p>
            <h1 className="text-2xl font-bold">Tes Kompetensi Dasar</h1>
          </div>
          <div className="rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-2 font-semibold text-brand-200" aria-label="Sisa waktu">
            {minutes}:{String(seconds).padStart(2, '0')}
          </div>
        </header>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Progress: {answeredCount}/{questions.length} terjawab</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-200">Soal {current + 1} / {questions.length}</p>
          <h2 className="mb-6 text-2xl font-bold leading-relaxed">{currentQuestion.text}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={`${currentQuestion.id}-${index}`}
                type="button"
                onClick={() => setAnswers((previous) => ({ ...previous, [currentQuestion.id]: index }))}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${answers[currentQuestion.id] === index ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500'}`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current text-sm">{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button type="button" onClick={() => setCurrent((value) => Math.max(value - 1, 0))} disabled={current === 0} className="rounded-full border border-slate-700 px-5 py-3 text-sm disabled:opacity-40">Sebelumnya</button>
            {current < questions.length - 1 ? (
              <button type="button" onClick={() => setCurrent((value) => Math.min(value + 1, questions.length - 1))} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Selanjutnya</button>
            ) : (
              <button type="button" onClick={submitExam} className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Kumpulkan jawaban</button>
            )}
          </div>
        </section>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-200">Kembali ke dashboard</Link>
        </div>
      </div>
    </main>
  );
}
