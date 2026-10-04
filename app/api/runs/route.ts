import { NextResponse } from 'next/server';
import { getDb } from '../../lib/db';
import { benchmarkRuns } from '../../../db/schema';
import { hashToken, optionalUserId } from '../../lib/server-context';

type Run = { runId: string; sessionToken: string; agent: string; task: string; world: string; startedAt: string; endedAt?: string; outcome: 'running' | 'passed' | 'failed' | 'stuck'; score?: number; events: Array<Record<string, unknown>> };
const store = globalThis as typeof globalThis & { __gauntletRuns?: Map<string, Run> };
store.__gauntletRuns ||= new Map();

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const id = `GA-${Math.floor(1000 + Math.random() * 9000)}`;
  const run: Run = { runId: id, sessionToken: crypto.randomUUID(), agent: body.agent || 'Unknown agent', task: body.task || 'Unassigned task', world: body.world || 'unknown', startedAt: new Date().toISOString(), outcome: 'running', events: [] };
  const db = getDb();
  if (db) {
    try {
      await db.insert(benchmarkRuns).values({ id, sessionTokenHash: hashToken(run.sessionToken), userId: await optionalUserId(), taskId: run.task, worldId: run.world, status: 'running', startedAt: new Date(run.startedAt), verifierVersion: 'demo-1' });
    } catch { /* keep the run usable when Neon is temporarily unavailable */ }
  }
  store.__gauntletRuns!.set(id, run);
  return NextResponse.json({ runId: id, sessionToken: run.sessionToken, startedAt: run.startedAt });
}

export async function GET() {
  const db = getDb();
  if (db) {
    try { return NextResponse.json({ runs: await db.select().from(benchmarkRuns).orderBy(benchmarkRuns.startedAt).limit(100) }); }
    catch { /* fall through to the in-memory session stream */ }
  }
  return NextResponse.json({ runs: Array.from(store.__gauntletRuns!.values()).sort((a,b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 100) });
}
