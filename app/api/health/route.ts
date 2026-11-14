import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'EXAMBPPP',
    mode: 'production-style-demo',
    features: ['admin dashboard', 'question bank', 'exam timer', 'score calculation'],
    timestamp: new Date().toISOString(),
  });
}
