import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/pricing",
  "/api/auth/login",
  "/api/auth/register",
  "/apps",
  "/info",
];

// App dashboard routes are public (demo mode)
const PUBLIC_PREFIXES = [
  "/_next",
  "/favicon",
  "/api/auth",
  "/apps/",
  "/info/",
  "/pricing",
  "/register",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all public prefixes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow exact public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Check for session cookie — only gate admin/dashboard routes
  const session = request.cookies.get("realsync-session");

  if (!session && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
