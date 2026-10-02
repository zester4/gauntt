import { NextResponse } from 'next/server';
import { taskRegistry } from '../../lib/task-registry';

export async function GET() { return NextResponse.json({ tasks: taskRegistry, seeded: true, verifierVersion: 'gauntlet-1.0' }); }
