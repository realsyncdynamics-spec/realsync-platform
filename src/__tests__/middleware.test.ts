import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../middleware';

// Helper to build a minimal NextRequest-like object
function makeRequest(ip: string, url = 'http://localhost/api/test'): NextRequest {
  const req = new NextRequest(url, {
    headers: { 'x-forwarded-for': ip },
  });
  return req;
}

// ── Security headers ───────────────────────────────────────────────────────────

describe('middleware — security headers', () => {
  it('adds X-Content-Type-Options: nosniff', () => {
    const req = makeRequest('1.2.3.1');
    const res = middleware(req);
    if (res instanceof NextResponse) {
      expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    }
  });

  it('adds X-Frame-Options: DENY', () => {
    const req = makeRequest('1.2.3.2');
    const res = middleware(req);
    if (res instanceof NextResponse) {
      expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    }
  });

  it('adds X-XSS-Protection header', () => {
    const req = makeRequest('1.2.3.3');
    const res = middleware(req);
    if (res instanceof NextResponse) {
      expect(res.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    }
  });

  it('adds Referrer-Policy: origin-when-cross-origin', () => {
    const req = makeRequest('1.2.3.4');
    const res = middleware(req);
    if (res instanceof NextResponse) {
      expect(res.headers.get('Referrer-Policy')).toBe('origin-when-cross-origin');
    }
  });
});

// ── Rate limiting ──────────────────────────────────────────────────────────────

describe('middleware — rate limiting', () => {
  // Use a unique IP per test group to avoid cross-test state
  const RATE_IP = '10.0.0.1';

  it('allows requests under the limit (first request returns non-429)', () => {
    const req = makeRequest(RATE_IP + '00');
    const res = middleware(req);
    expect(res.status).not.toBe(429);
  });

  it('returns 429 after exceeding 100 requests within the window', () => {
    const ip = '10.99.99.1'; // unique IP for this test
    let lastRes: Response | NextResponse = middleware(makeRequest(ip));

    // Fire 100 additional requests (total 101 → should trigger rate limit)
    for (let i = 0; i < 100; i++) {
      lastRes = middleware(makeRequest(ip));
    }

    expect(lastRes.status).toBe(429);
  });

  it('rate-limit response has Content-Type application/json', async () => {
    const ip = '10.99.99.2';
    let lastRes: Response | NextResponse = middleware(makeRequest(ip));
    for (let i = 0; i < 100; i++) {
      lastRes = middleware(makeRequest(ip));
    }

    expect(lastRes.status).toBe(429);
    expect(lastRes.headers.get('Content-Type')).toContain('application/json');
  });

  it('rate-limit response body contains error and message fields', async () => {
    const ip = '10.99.99.3';
    let lastRes: Response | NextResponse = middleware(makeRequest(ip));
    for (let i = 0; i < 100; i++) {
      lastRes = middleware(makeRequest(ip));
    }

    expect(lastRes.status).toBe(429);
    const body = await lastRes.json();
    expect(body.error).toBe('Too Many Requests');
    expect(body.message).toBeTruthy();
  });

  it('rate-limit response includes Retry-After header', async () => {
    const ip = '10.99.99.4';
    let lastRes: Response | NextResponse = middleware(makeRequest(ip));
    for (let i = 0; i < 100; i++) {
      lastRes = middleware(makeRequest(ip));
    }

    expect(lastRes.status).toBe(429);
    expect(lastRes.headers.get('Retry-After')).toBe('60');
  });

  it('different IPs have independent rate-limit counters', () => {
    const ip1 = '192.168.1.1';
    const ip2 = '192.168.1.2';

    // Exhaust ip1
    for (let i = 0; i < 101; i++) {
      middleware(makeRequest(ip1));
    }

    // ip2 should still be under limit
    const res = middleware(makeRequest(ip2));
    expect(res.status).not.toBe(429);
  });
});
