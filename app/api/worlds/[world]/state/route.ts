import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '../../../../lib/db';
import { worldSnapshots } from '../../../../../db/schema';
import { seededWorlds } from '../../../../lib/task-registry';

const local = globalThis as typeof globalThis & { __gauntletWorldState?: Map<string, Record<string, unknown>> };
local.__gauntletWorldState ||= new Map();

async function validWorld(world: string) { return seededWorlds.includes(world as typeof seededWorlds[number]); }

export async function GET(_: Request, { params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  if (!(await validWorld(world))) return NextResponse.json({ error: 'Unknown world' }, { status: 404 });
  const db = getDb();
  if (db) { const rows = await db.select().from(worldSnapshots).where(eq(worldSnapshots.worldId, world)).limit(1); if (rows[0]) return NextResponse.json({ world, state: rows[0].state, seed: rows[0].seed, persisted: true }); }
  return NextResponse.json({ world, state: local.__gauntletWorldState!.get(world) || {}, seed: 2048, persisted: false });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  if (!(await validWorld(world))) return NextResponse.json({ error: 'Unknown world' }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const state = body.state && typeof body.state === 'object' ? body.state as Record<string, unknown> : null;
  if (!state) return NextResponse.json({ error: 'state object is required' }, { status: 400 });
  local.__gauntletWorldState!.set(world, state);
  let persisted = false;
  const db = getDb();
  try { if (db) { await db.insert(worldSnapshots).values({ worldId: world, seed: 2048, state, updatedAt: new Date() }).onConflictDoUpdate({ target: worldSnapshots.worldId, set: { state, updatedAt: new Date() } }); persisted = true; } } catch { persisted = false; }
  return NextResponse.json({ world, state, seed: 2048, persisted, updatedAt: new Date().toISOString() });
}
