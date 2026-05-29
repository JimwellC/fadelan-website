import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Pass pathname to layout via header
  response.headers.set('x-pathname', pathname)

  // Protect admin routes
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/admin')
  ) {
    const session = request.cookies.get('fadelan_admin_session')
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
