import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Teacher } from "@/models/teacherInfo";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("teacherToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const teacher = await Teacher.findById(decoded._id).select("-password");

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: teacher });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
