import { NextResponse } from 'next/server';
import { getAccuracyMetrics } from '@/lib/db';

export async function GET() {
  try {
    const metrics = await getAccuracyMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Accuracy API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accuracy metrics' },
      { status: 500 }
    );
  }
}