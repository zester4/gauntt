import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { benchmarkRuns, runEvents } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
const store = globalThis as typeof globalThis & { __gauntletRuns?: Map<string, unknown> };
export async function GET(_: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params; const localRun = store.__gauntletRuns?.get(runId); if (localRun) return NextResponse.json({ run: localRun });
  const db = getDb();
  if (db) { const saved = await db.select().from(benchmarkRuns).where(eq(benchmarkRuns.id, runId)).limit(1); if (saved[0]) { const events = await db.select().from(runEvents).where(eq(runEvents.runId, runId)); return NextResponse.json({ run: { runId, agent: saved[0].agentId || 'Unknown agent', task: saved[0].taskId, world: saved[0].worldId, startedAt: saved[0].startedAt.toISOString(), endedAt: saved[0].endedAt?.toISOString(), outcome: saved[0].outcome || saved[0].status, score: saved[0].score, events } }); } }
  return NextResponse.json({ error: 'Run not found' }, { status: 404 });
}
