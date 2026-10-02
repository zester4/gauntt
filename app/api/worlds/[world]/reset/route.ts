import { NextResponse } from 'next/server';
import { seededWorlds } from '../../../../lib/task-registry';

export async function POST(_: Request, { params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  if (!seededWorlds.includes(world as typeof seededWorlds[number])) return NextResponse.json({ error: 'Unknown world' }, { status: 404 });
  return NextResponse.json({ world, reset: true, seed: 2048, resetAt: new Date().toISOString(), message: 'Seeded world state restored.' });
}
