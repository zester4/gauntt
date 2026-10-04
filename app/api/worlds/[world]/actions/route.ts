import { NextResponse } from 'next/server';
import { seededWorlds } from '../../../../lib/task-registry';

type Action = { id: string; type: string; payload: Record<string, unknown>; at: string };
const store = globalThis as typeof globalThis & { __gauntletWorldActions?: Map<string, Action[]> };
store.__gauntletWorldActions ||= new Map();

export async function GET(_: Request, { params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  if (!seededWorlds.includes(world as typeof seededWorlds[number])) return NextResponse.json({ error: 'Unknown world' }, { status: 404 });
  return NextResponse.json({ world, actions: store.__gauntletWorldActions!.get(world) || [] });
}

export async function POST(request: Request, { params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  if (!seededWorlds.includes(world as typeof seededWorlds[number])) return NextResponse.json({ error: 'Unknown world' }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.type !== 'string' || !body.type.trim()) return NextResponse.json({ error: 'action type is required' }, { status: 400 });
  const action: Action = { id: crypto.randomUUID(), type: body.type, payload: body.payload && typeof body.payload === 'object' ? body.payload : {}, at: new Date().toISOString() };
  const actions = store.__gauntletWorldActions!.get(world) || [];
  actions.push(action);
  store.__gauntletWorldActions!.set(world, actions.slice(-100));
  return NextResponse.json({ world, action, actionCount: actions.length }, { status: 201 });
}
