import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define UserRole enum to match Prisma schema
enum UserRole {
  STREAMER = 'STREAMER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN'
}

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/pricing',
  '/contact',
  '/content',
  '/content/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify-request',
  '/auth/reset-password',
  '/api/auth/[...nextauth]',
  '/api/webhooks/stripe',
];

// Routes that require authentication but no specific role
const authRoutes = [
  '/dashboard',
  '/settings',
  '/notifications',
];

// Role-based route prefixes
const roleBasedRoutes = {
  [UserRole.STREAMER]: [
    '/streamer',
    '/rewards',
    '/withdraw',
  ],
  [UserRole.CREATOR]: [
    '/creator',
    '/upload',
    '/analytics',
    '/earnings',
  ],
  [UserRole.ADMIN]: [
    '/admin',
    '/moderation',
    '/users',
    '/reports',
  ],
};

// Check if the current path starts with any of the given prefixes
const pathStartsWith = (pathname: string, prefixes: string[]) => {
  return prefixes.some(prefix => pathname.startsWith(prefix));
};

export default withAuth(
  async function middleware(req) {
    const { pathname, origin, searchParams } = req.nextUrl;
    const token = req.nextauth?.token;
    const callbackUrl = searchParams.get('callbackUrl') || '';
    const isPublicRoute = publicRoutes.some(route => 
      route === pathname || pathname.startsWith(route + '/') || pathname === '/'
    );
    const isAuthPage = pathname.startsWith('/auth/');
    const isApiRoute = pathname.startsWith('/api/');

    // Allow all API routes and public routes
    if (isApiRoute || isPublicRoute) {
      return NextResponse.next();
    }

    // Handle unauthenticated users
    if (!token) {
      // Redirect to signin with callback URL
      const signinUrl = new URL('/auth/signin', origin);
      signinUrl.searchParams.set('callbackUrl', pathname + (searchParams.toString() ? `?${searchParams}` : ''));
      return NextResponse.redirect(signinUrl);
    }

    // Handle authenticated users trying to access auth pages
    if (isAuthPage) {
      return NextResponse.redirect(new URL(callbackUrl || '/dashboard', origin));
    }

    // Check role-based access
    const userRole = token.role as UserRole;
    
    // Check if user is trying to access admin routes
    const isAdminRoute = pathname.startsWith('/admin');
    
    // If user is not an admin and trying to access admin routes, deny access
    if (isAdminRoute && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/', origin));
    }
    
    // Check other role-based routes
    const hasAccess = Object.entries(roleBasedRoutes).some(([role, routes]) => {
      if (role === userRole) return false; // Skip user's own role
      return pathStartsWith(pathname, routes);
    });

    // If user tries to access a route not for their role
    if (hasAccess) {
      // If they're an admin, allow access to all routes
      if (userRole === UserRole.ADMIN) {
        return NextResponse.next();
      }
      
      // Otherwise, redirect to their dashboard
      return NextResponse.redirect(new URL('/dashboard', origin));
    }

    // Check if the user has a role set
    if (!token.role && !pathname.startsWith('/onboarding/role-selection')) {
      // Only redirect to role selection if not already there
      if (pathname !== '/onboarding/role-selection') {
        const redirectUrl = new URL('/onboarding/role-selection', origin);
        redirectUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.next();
    }
    
    // If user is already on role selection page but has a role, redirect to dashboard
    if (pathname.startsWith('/onboarding/role-selection') && token.role) {
      return NextResponse.redirect(new URL('/dashboard', origin));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes are always authorized
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // For API routes, we'll handle auth in the API route itself
        if (pathname.startsWith('/api/')) {
          return true;
        }

        // If there's no token, the user is not authenticated
        if (!token) {
          return false;
        }

        return true;
      },
    },
  }
);

export const config = {
  // Match all paths except:
  // - static files (_next/static, _next/image, favicon.ico, etc.)
  // - public files (images, fonts, etc.)
  // - API routes (handled separately)
  // - Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot)$).*)',
  ],
};
