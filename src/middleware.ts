import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isHomePage = path === "/";
  
  // if (!isHomePage) {
  //   return NextResponse.redirect(new URL('/', request.nextUrl));
  // }
}

export const config = {
  matcher: ['/login-homepage'], // Matches all routes, enforcing redirection to homepage
};
