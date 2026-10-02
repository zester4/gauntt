import { NextResponse } from 'next/server';
import { readiness } from '../../lib/readiness';
export async function GET() {
  const status = readiness();
  return NextResponse.json(status, { status: status.productionReady ? 200 : 503, headers: { 'cache-control': 'no-store' } });
}
