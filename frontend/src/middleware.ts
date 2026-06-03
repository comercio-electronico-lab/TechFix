import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  requestHeaders.set('x-forwarded-for', ip);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: '/api/:path*',
};
