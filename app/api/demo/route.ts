import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'EXAMBPPP',
    version: '1.1.0',
    mode: 'production-style-demo',
    features: ['role-based dashboard', 'question bank', 'timer exam', 'auto-scoring', 'result history'],
  });
}
