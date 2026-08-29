import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Server-side gate for the admin area.
 *
 * Several admin screens are client components ('use client') and therefore cannot
 * guard themselves with getServerSession. Without this middleware their UI is
 * served to anonymous visitors (API calls fail with 401, but the panel is visible).
 * The middleware blocks the whole /admin surface before any rendering happens.
 */
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Force the first-login password change before anything else in the panel.
  if (token.mustChangePass && pathname !== '/admin/change-password') {
    return NextResponse.redirect(new URL('/admin/change-password', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
