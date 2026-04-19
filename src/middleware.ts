import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

// In-memory store (use Redis/Upstash in production)
const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  // Rate limiting
  const userRecord = requestCounts.get(ip);
  
  if (userRecord) {
    if (now - userRecord.timestamp < RATE_LIMIT_WINDOW) {
      if (userRecord.count >= MAX_REQUESTS_PER_WINDOW) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60',
            },
          }
        );
      }
      userRecord.count++;
    } else {
      // Reset window
      requestCounts.set(ip, { count: 1, timestamp: now });
    }
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }
  
  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/agents/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
