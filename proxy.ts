import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

const protectedRoutes = createRouteMatcher(['/dashboard(.*)', '/api/runs(.*)', '/api/leaderboard(.*)', '/verify(.*)']);
const clerk = clerkMiddleware(async (auth, request) => {
  if (protectedRoutes(request)) await auth.protect();
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) return NextResponse.next();
  return clerk(request, event);
}

export const config = { matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'] };
