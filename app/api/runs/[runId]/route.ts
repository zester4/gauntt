import { NextResponse } from 'next/server';
const store = globalThis as typeof globalThis & { __gauntletRuns?: Map<string, unknown> };
export async function GET(_: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params; const run = store.__gauntletRuns?.get(runId); if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 }); return NextResponse.json({ run });
}
