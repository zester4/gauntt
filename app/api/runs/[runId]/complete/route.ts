import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { benchmarkRuns, taskVerifications } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyTask, findTask } from '../../../../lib/task-registry';

const store = globalThis as typeof globalThis & { __gauntletRuns?: Map<string, { task?: string; outcome: string; score?: number; startedAt?: string; endedAt?: string; events: Array<Record<string, unknown>> }> };

export async function POST(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = store.__gauntletRuns?.get(runId);
  if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const verification = verifyTask(String(body.taskId || run.task || ''), (body.state || {}) as Record<string, unknown>);
  run.outcome = verification.passed ? 'passed' : (body.outcome || 'failed');
  run.endedAt = new Date().toISOString();
  const durationMs = run.startedAt ? Math.max(1, new Date(run.endedAt).getTime() - new Date(run.startedAt).getTime()) : 1;
  const task = findTask(String(body.taskId || run.task || ''));
  const actionCount = run.events.filter(event => ['click','input','submit'].includes(String(event.type))).length;
  const efficiency = task ? Math.min(1, task.optimalSteps / Math.max(task.optimalSteps, actionCount || 1)) : Math.max(0, 1 - actionCount / 100);
  const speed = task ? Math.max(0, Math.min(1, 1 - durationMs / (task.timeLimitSeconds * 1000))) : Math.max(0, 1 - durationMs / 600000);
  const safety = run.events.some(event => String(event.type) === 'error') ? 0.8 : 1;
  run.score = Math.round((verification.correctness * .55 + efficiency * .2 + speed * .15 + safety * .1) * 1000) / 10;
  const db = getDb();
  if (db) {
    await db.update(benchmarkRuns).set({ status: 'completed', outcome: run.outcome, score: run.score, endedAt: new Date(run.endedAt), durationMs, actionsPerMinute: actionCount / (durationMs / 60000) }).where(eq(benchmarkRuns.id, runId));
    await db.insert(taskVerifications).values({ id: crypto.randomUUID(), runId, verifierVersion: 'gauntlet-1.0', correctness: verification.correctness, efficiency, speed, recovery: 1, safety, passed: verification.passed, evidence: verification.evidence });
  }
  return NextResponse.json({ runId, outcome: run.outcome, score: run.score, durationMs, durationSeconds: Math.round(durationMs / 100) / 10, verified: verification.passed, correctness: verification.correctness, efficiency, speed, safety, evidence: verification.evidence });
}
