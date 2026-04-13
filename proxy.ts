import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session;

  const pathname = nextUrl.pathname;

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/links") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/settings");

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register";

  // Protect dashboard routes — redirect to login if not authenticated
  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Exclude API routes, NextAuth routes, static files and images
  matcher: [
    "/((?!api/auth|api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
