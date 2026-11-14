import type { Question } from './demo-data';

const parseCsvRows = (input: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];

    if (character === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(value.trim());
      value = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(value.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  row.push(value.trim());
  if (row.some((cell) => cell.length > 0)) rows.push(row);
  return rows;
};

const answerIndex = (answer: unknown): number => {
  if (typeof answer === 'number' && Number.isInteger(answer)) return answer >= 1 && answer <= 4 ? answer - 1 : answer;
  const normalized = String(answer ?? '').trim().toUpperCase();
  if (/^[A-D]$/.test(normalized)) return normalized.charCodeAt(0) - 65;
  if (/^[1-4]$/.test(normalized)) return Number(normalized) - 1;
  return -1;
};

const validateQuestion = (value: unknown, rowNumber: number): Omit<Question, 'id'> => {
  if (!value || typeof value !== 'object') throw new Error(`Baris ${rowNumber}: format soal tidak valid.`);
  const item = value as Record<string, unknown>;
  const text = String(item.text ?? item.question ?? '').trim();
  const rawOptions = Array.isArray(item.options)
    ? item.options
    : [item.optionA ?? item.a, item.optionB ?? item.b, item.optionC ?? item.c, item.optionD ?? item.d];
  const options = rawOptions.map((option) => String(option ?? '').trim());
  const answer = answerIndex(item.answer ?? item.correctAnswer);

  if (!text) throw new Error(`Baris ${rowNumber}: teks pertanyaan wajib diisi.`);
  if (options.length !== 4 || options.some((option) => !option)) throw new Error(`Baris ${rowNumber}: isi empat pilihan jawaban.`);
  if (answer < 0 || answer > 3) throw new Error(`Baris ${rowNumber}: jawaban benar harus A-D atau 1-4.`);

  return { text, options, answer };
};

export const parseQuestionFile = (fileName: string, contents: string): Omit<Question, 'id'>[] => {
  const extension = fileName.toLowerCase().split('.').pop();
  if (extension === 'json') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(contents);
    } catch {
      throw new Error('File JSON tidak valid. Periksa format dan tanda kutipnya.');
    }
    const values = Array.isArray(parsed) ? parsed : (parsed as { questions?: unknown[] })?.questions;
    if (!Array.isArray(values) || values.length === 0) throw new Error('JSON harus berisi array soal atau properti "questions" yang berisi array.');
    return values.map((value, index) => validateQuestion(value, index + 1));
  }

  if (extension !== 'csv') throw new Error('Format file belum didukung. Gunakan CSV atau JSON.');
  const rows = parseCsvRows(contents.replace(/^\uFEFF/, ''));
  if (rows.length < 2) throw new Error('CSV harus memiliki baris header dan minimal satu soal.');

  const header = rows[0].map((cell) => cell.toLowerCase().replace(/\s+/g, '').replace(/_/g, ''));
  const aliases: Record<string, string[]> = {
    question: ['question', 'pertanyaan', 'soal', 'text'],
    optionA: ['optiona', 'pilihana', 'a'],
    optionB: ['optionb', 'pilihanb', 'b'],
    optionC: ['optionc', 'pilihanc', 'c'],
    optionD: ['optiond', 'pilihand', 'd'],
    answer: ['answer', 'jawaban', 'kuncijawaban', 'correctanswer'],
  };
  const column = (key: string) => header.findIndex((cell) => aliases[key].includes(cell));
  const indexes = Object.fromEntries(Object.keys(aliases).map((key) => [key, column(key)])) as Record<string, number>;
  const missing = Object.entries(indexes).filter(([, index]) => index < 0).map(([key]) => key);
  if (missing.length) throw new Error(`Kolom CSV tidak lengkap: ${missing.join(', ')}.`);

  return rows.slice(1).map((row, index) => validateQuestion({
    question: row[indexes.question],
    optionA: row[indexes.optionA],
    optionB: row[indexes.optionB],
    optionC: row[indexes.optionC],
    optionD: row[indexes.optionD],
    answer: row[indexes.answer],
  }, index + 2));
};
