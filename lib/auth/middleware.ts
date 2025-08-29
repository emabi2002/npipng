import { createServerSupabaseClient } from '../supabase/client'
import { NextRequest, NextResponse } from 'next/server'

export async function authMiddleware(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get the session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If no session and trying to access protected routes
    if (!session && isProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If has session but trying to access auth pages
    if (session && isAuthRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dash', request.url))
    }

    // For protected routes, check user role and permissions
    if (session && isProtectedRoute(request.nextUrl.pathname)) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', session.user.id)
        .single()

      if (userError || !user) {
        console.error('User fetch error:', userError)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Check if user is active
      if (user.status !== 'active') {
        return NextResponse.redirect(new URL('/auth/suspended', request.url))
      }

      // Check role-based access
      if (!hasRouteAccess(request.nextUrl.pathname, user.role)) {
        return NextResponse.redirect(new URL('/dash/unauthorized', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/dash',
    '/api/protected'
  ]

  return protectedPaths.some(path => pathname.startsWith(path))
}

function isAuthRoute(pathname: string): boolean {
  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password']
  return authPaths.includes(pathname)
}

function hasRouteAccess(pathname: string, userRole: string): boolean {
  // Define route access rules
  const routeAccess: Record<string, string[]> = {
    '/dash/admin': ['admin'],
    '/dash/hr': ['admin', 'staff'],
    '/dash/finance': ['admin', 'staff'],
    '/dash/academic/academic-management': ['admin', 'faculty'],
    '/dash/library': ['admin', 'librarian', 'staff'],
    '/dash/system-setup': ['admin'],
    '/dash/academic/student-portals': ['admin', 'faculty', 'student', 'staff'],
    '/dash/academic/faculty-portals': ['admin', 'faculty'],
    '/dash/welfare': ['admin', 'staff'],
    '/dash/industry': ['admin', 'faculty', 'staff']
  }

  // Find matching route pattern
  for (const [route, allowedRoles] of Object.entries(routeAccess)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole)
    }
  }

  // Default: allow access to general dashboard areas
  return true
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
