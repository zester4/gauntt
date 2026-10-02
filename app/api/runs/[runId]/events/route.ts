import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { runEvents } from '../../../../../db/schema';
const store = globalThis as typeof globalThis & { __gauntletRuns?: Map<string, { events: Array<Record<string, unknown>> }> };
export async function POST(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params; const run = store.__gauntletRuns?.get(runId);
  const event = await request.json().catch(() => ({}));
  const db = getDb();
  if (db) { await db.insert(runEvents).values({ id: crypto.randomUUID(), runId, type: String(event.type || 'unknown'), target: event.target ? String(event.target) : null, path: event.path ? String(event.path) : null, valueRedacted: event.value ? String(event.value).slice(0, 120) : null, metadata: event.metadata || {}, occurredAt: new Date(event.timestamp || Date.now()) }); return NextResponse.json({ accepted: true }); }
  if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  run.events.push({ ...event, receivedAt: new Date().toISOString() });
  return NextResponse.json({ accepted: true, eventCount: run.events.length });
}
