import { NextResponse } from 'next/server';
import { verifyTask } from '../../../../lib/task-registry';

export async function POST(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const body = await request.json().catch(() => ({}));
  const result = verifyTask(taskId, (body.state || {}) as Record<string, unknown>);
  return NextResponse.json({ ...result, verifierVersion: 'gauntlet-1.0', checkedAt: new Date().toISOString() }, { status: result.passed ? 200 : 422 });
}
