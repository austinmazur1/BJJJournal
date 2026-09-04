import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow NextAuth routes and public assets without auth
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/api/onboarding") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const signInUrl = new URL("/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(signInUrl)
  }

  // Note: Onboarding check will be handled in the app layout/page components
  // since middleware runs in Edge Runtime and can't access database

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|signin|signup|api/register|api/onboarding|onboarding|images|public|assets).*)",
  ],
}


