import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Student } from "@/models/studentInfo";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.findById(decoded._id).select("skills").lean();
    if (!student) return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: student.skills ?? [] });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}

export async function PATCH(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { skills } = await request.json();

    if (!Array.isArray(skills)) {
      return NextResponse.json({ success: false, message: "skills must be an array" }, { status: 400 });
    }

    const cleaned = skills.map((s) => String(s).trim()).filter(Boolean).slice(0, 30);
    const student = await Student.findByIdAndUpdate(
      decoded._id,
      { skills: cleaned },
      { new: true, select: "skills" }
    ).lean();

    if (!student) return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: student.skills });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
