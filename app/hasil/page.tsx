'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const questions = [
  {
    id: 1,
    text: 'Perangkat lunak yang digunakan untuk mengelola dan menjalankan ujian secara digital disebut?',
    options: ['Learning Management System', 'Database Engine', 'Text Editor', 'Browser Cache'],
    answer: 'Learning Management System',
  },
  {
    id: 2,
    text: 'Tujuan utama dari sistem ujian online adalah?',
    options: ['Mengurangi transparansi', 'Mempermudah evaluasi dan pelacakan hasil', 'Menghilangkan semua interaksi', 'Membatasi akses peserta'],
    answer: 'Mempermudah evaluasi dan pelacakan hasil',
  },
  {
    id: 3,
    text: 'Manakah yang paling tepat tentang timer ujian?',
    options: ['Tidak perlu diatur', 'Digunakan untuk membatasi waktu pengerjaan', 'Hanya digunakan di ujian tertulis', 'Hanya berlaku untuk admin'],
    answer: 'Digunakan untuk membatasi waktu pengerjaan',
  },
  {
    id: 4,
    text: 'Apa fungsi utama dari laporan hasil ujian?',
    options: ['Menjaga keamanan perangkat', 'Menganalisis performa peserta', 'Mengganti semua soal', 'Menghindari revisi data'],
    answer: 'Menganalisis performa peserta',
  },
  {
    id: 5,
    text: 'Kebijakan penggunaan data peserta dalam aplikasi ujian harus?',
    options: ['Dihindari sepenuhnya', 'Diatur dengan kontrol akses dan privasi', 'Dibagikan ke semua pengguna', 'Tidak diperlukan'],
    answer: 'Diatur dengan kontrol akses dan privasi',
  },
];

export default function UjianPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(60 * 8);

  useEffect(() => {
    const stored = localStorage.getItem('exambppp-session');
    if (!stored) {
      router.push('/login');
      return;
    }

    setSession(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = questions[currentIndex];

  const progress = useMemo(() => {
    const answered = Object.keys(answers).length;
    return (answered / questions.length) * 100;
  }, [answers]);

  const submitExam = () => {
    const score = questions.reduce((total, question) => {
      const chosen = answers[question.id];
      if (chosen === question.answer) {
        return total + 20;
      }
      return total;
    }, 0);

    const payload = {
      name: session?.name ?? 'Peserta',
      score,
      total: 100,
      date: new Date().toLocaleString('id-ID'),
    };

    const existing = JSON.parse(localStorage.getItem('exambppp-results') ?? '[]');
    localStorage.setItem('exambppp-results', JSON.stringify([payload, ...existing].slice(0, 10)));

    router.push('/hasil');
  };

  const selectAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  if (!session) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Memuat ujian...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Ujian digital</p>
            <h1 className="text-2xl font-bold">Tes Kompetensi Dasar</h1>
          </div>

          <div className="rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-200">
            {minutes}:{String(seconds).padStart(2, '0')}
          </div>
        </header>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-200">
            Soal {currentIndex + 1} / {questions.length}
          </p>
          <h2 className="mb-6 text-2xl font-bold leading-relaxed text-white">{currentQuestion.text}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectAnswer(option)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 text-white'
                      : 'border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <span>{option}</span>
                  <span className="text-xs uppercase tracking-widest text-slate-400">A</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200"
            >
              Sebelumnya
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                type="button"
                onClick={submitExam}
                className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Selesai
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-200">
            Kembali ke dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
