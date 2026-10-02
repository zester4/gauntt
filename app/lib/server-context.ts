import { auth } from '@clerk/nextjs/server';
import { createHash } from 'node:crypto';

export async function optionalUserId() {
  if (!process.env.CLERK_SECRET_KEY) return null;
  const { userId } = await auth();
  return userId || null;
}

export function hashToken(value: string) {
  return createHash('sha256').update(value).digest('hex');
}
