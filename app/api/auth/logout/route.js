import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  for (const name of ["studentToken", "teacherToken", "adminToken"]) {
    res.cookies.set(name, "", { path: "/", maxAge: 0, httpOnly: true });
  }
  return res;
}
