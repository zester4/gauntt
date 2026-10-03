import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

const protectedPrefixes = ['/dashboard', '/api/runs', '/api/leaderboard', '/verify'];
const clerk = clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (isProtected) await auth.protect();
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) return NextResponse.next();
  return clerk(request, event);
}

export const config = { matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'] };
