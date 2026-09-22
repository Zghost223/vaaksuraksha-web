import { NextResponse } from 'next/server';
import { getHealthCheck } from '@/lib/db';

export async function GET() {
  const health = await getHealthCheck();
  return NextResponse.json(health);
}