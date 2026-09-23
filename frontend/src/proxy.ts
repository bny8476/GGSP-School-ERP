import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Strictly block any /student portal routes - there is NO student portal
  if (pathname.startsWith("/student")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Allow static files, api routes, Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get("token")?.value;
  const roleCookie = request.cookies.get("user_role")?.value?.toUpperCase();

  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/parent");
  const isLoginPage = pathname === "/login";

  // If visiting login page while already authenticated with cookies, redirect to their portal
  if (isLoginPage && tokenCookie) {
    const targetUrl = request.nextUrl.clone();
    if (roleCookie === "PARENT") {
      targetUrl.pathname = "/parent";
    } else {
      targetUrl.pathname = "/dashboard";
    }
    return NextResponse.redirect(targetUrl);
  }

  // If visiting protected route
  if (isProtectedPath) {
    // If not authenticated (cookie check)
    // Note: If user logged in before cookies were introduced, client-side hydration in authStore will check localStorage
    if (!tokenCookie) {
      // In Next.js App Router, if client has localStorage token it can handle client hydration.
      // But if there's no cookie, we allow the page to load and client-side AuthGuard can verify localStorage.
      return NextResponse.next();
    }

    // Role-based boundary enforcement
    if (pathname.startsWith("/dashboard") && roleCookie === "PARENT") {
      const parentUrl = request.nextUrl.clone();
      parentUrl.pathname = "/parent";
      return NextResponse.redirect(parentUrl);
    }

    if (pathname.startsWith("/parent") && roleCookie && roleCookie !== "PARENT" && roleCookie !== "ADMIN") {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/parent/:path*",
    "/student/:path*",
    "/login",
  ],
};
