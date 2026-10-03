import { NextResponse } from 'next/server';
import { seededWorlds } from '../../../../lib/task-registry';
import { getDb } from '../../../../lib/db';
import { worldSnapshots } from '../../../../../db/schema';
const local = globalThis as typeof globalThis & { __gauntletWorldState?: Map<string, Record<string, unknown>> };
local.__gauntletWorldState ||= new Map();

export async function POST(_: Request, { params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  if (!seededWorlds.includes(world as typeof seededWorlds[number])) return NextResponse.json({ error: 'Unknown world' }, { status: 404 });
  const resetAt = new Date();
  local.__gauntletWorldState!.set(world, {});
  const db = getDb();
  let persisted = false;
  try {
    if (db) { await db.insert(worldSnapshots).values({ worldId: world, seed: 2048, state: {}, updatedAt: resetAt }).onConflictDoUpdate({ target: worldSnapshots.worldId, set: { seed: 2048, state: {}, updatedAt: resetAt } }); persisted = true; }
  } catch { persisted = false; }
  return NextResponse.json({ world, reset: true, seed: 2048, resetAt: resetAt.toISOString(), persisted, message: persisted ? 'Seeded world state restored in Neon.' : 'Seeded world state restored in local fallback.' });
}
