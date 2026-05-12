import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ConnectDb } from "@/helper/db";
import { HostelFine } from "@/models/HostelFine";
import { Student } from "@/models/studentInfo";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.findById(decoded._id).select("regdNo").lean();
    if (!student) return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });

    const fines = await HostelFine.find({ studentRegdNo: student.regdNo }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: fines });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
