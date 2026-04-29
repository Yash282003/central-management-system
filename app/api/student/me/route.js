import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Student } from "@/models/studentInfo";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function GET() {
  try {
    // ✅ Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // ✅ Fetch user from DB
    const student = await Student.findById(decoded._id).select("-password");

    if (!student) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}