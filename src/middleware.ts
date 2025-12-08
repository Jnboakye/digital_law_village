import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware() {
  // Basic middleware - can be extended for auth, logging, etc.
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - static files
     */
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
  ],
};

