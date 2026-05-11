import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const studentToken = request.cookies.get("studentToken")?.value;
  const teacherToken = request.cookies.get("teacherToken")?.value;
  const adminToken = request.cookies.get("adminToken")?.value;

  const redirectToLogin = () =>
    NextResponse.redirect(new URL("/login", request.url));

  // Portal selector — any logged-in role can access
  if (pathname === "/portal-select" || pathname.startsWith("/portal-select/")) {
    if (!studentToken && !teacherToken && !adminToken) {
      return redirectToLogin();
    }
    return NextResponse.next();
  }

  // Dept + Hostel student
  if (pathname.startsWith("/dept/student") || pathname.startsWith("/hostel/student")) {
    if (!studentToken) return redirectToLogin();
  }

  // Dept teacher
  if (pathname.startsWith("/dept/teacher")) {
    if (!teacherToken) return redirectToLogin();
  }

  // Dept + Hostel admin
  if (pathname.startsWith("/dept/admin") || pathname.startsWith("/hostel/admin")) {
    if (!adminToken) return redirectToLogin();
  }

  // TnP — was previously unguarded
  if (pathname.startsWith("/tnp/student")) {
    if (!studentToken) return redirectToLogin();
  }
  if (pathname.startsWith("/tnp/officer") || pathname.startsWith("/tnp/management")) {
    if (!teacherToken && !adminToken) return redirectToLogin();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/portal-select/:path*",
    "/dept/student/:path*",
    "/dept/teacher/:path*",
    "/dept/admin/:path*",
    "/hostel/student/:path*",
    "/hostel/admin/:path*",
    "/tnp/student/:path*",
    "/tnp/officer/:path*",
    "/tnp/management/:path*",
  ],
};
