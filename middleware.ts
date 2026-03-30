import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for route protection
 * Role-agnostic authentication check using isLoggedIn cookie
 * 
 * Protected routes (require authentication):
 * - /admin/*
 * - /dashboard/*
 * - /profile
 * 
 * Public routes (no authentication required):
 * - /auth/login
 * - /auth/register
 * - /auth/password-reset
 * - /
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check isLoggedIn cookie (lightweight, role-agnostic)
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/password-reset',
    '/',
    '/favicon.ico',
  ];
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/auth/')
  );
  
  // Protected routes (require authentication)
  const protectedRoutes = ['/admin', '/dashboard', '/profile', '/me'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Redirect to /me if already logged in and accessing auth pages
  if (isLoggedIn && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/me', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
