import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const studentToken = request.cookies.get("studentToken")?.value;
  const teacherToken = request.cookies.get("teacherToken")?.value;
  const adminToken = request.cookies.get("adminToken")?.value;

  if (pathname.startsWith("/dept/student") || pathname.startsWith("/hostel/student")) {
    if (!studentToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/dept/teacher")) {
    if (!teacherToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/dept/admin") || pathname.startsWith("/hostel/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dept/student/:path*",
    "/dept/teacher/:path*",
    "/dept/admin/:path*",
    "/hostel/student/:path*",
    "/hostel/admin/:path*",
  ],
};
