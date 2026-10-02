import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { benchmarkRuns, taskVerifications } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
const store = globalThis as typeof globalThis & { __gauntletRuns?: Map<string, { outcome: string; score?: number; startedAt?: string; endedAt?: string; events: Array<Record<string, unknown>> }> };
export async function POST(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params; const run = store.__gauntletRuns?.get(runId); if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  const body = await request.json().catch(() => ({})); run.outcome = body.outcome || 'failed'; run.score = typeof body.score === 'number' ? body.score : Math.max(0, 100 - run.events.length); run.endedAt = new Date().toISOString();
  const durationMs = run.startedAt ? Math.max(1, new Date(run.endedAt).getTime() - new Date(run.startedAt).getTime()) : 0;
  const actionEvents = run.events.filter(event => ['click','input','submit'].includes(String(event.type))).length;
  const actionsPerMinute = durationMs ? Math.round((actionEvents / durationMs) * 60000 * 10) / 10 : 0;
  const db = getDb();
  if (db) {
    await db.update(benchmarkRuns).set({ status: 'completed', outcome: run.outcome, score: run.score, endedAt: new Date(run.endedAt), durationMs, actionsPerMinute }).where(eq(benchmarkRuns.id, runId));
    await db.insert(taskVerifications).values({ id: crypto.randomUUID(), runId, verifierVersion: 'demo-1', correctness: run.outcome === 'passed' ? 1 : 0, efficiency: Math.max(0, 1 - run.events.length / 100), speed: Math.max(0, 1 - durationMs / 600000), recovery: 1, safety: 1, passed: run.outcome === 'passed', evidence: { reason: body.reason || null } });
  }
  return NextResponse.json({ runId, outcome: run.outcome, score: run.score, durationMs, durationSeconds: Math.round(durationMs / 100) / 10, actionsPerMinute, verified: true });
}
