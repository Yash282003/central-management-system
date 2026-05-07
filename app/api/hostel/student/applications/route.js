import { ConnectDb } from "@/helper/db";
import { HostelApplication } from "@/models/HostelApplication";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Student } from "@/models/studentInfo";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const applications = await HostelApplication.find({ studentId: decoded._id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.findById(decoded._id).select("name regdNo");
    const body = await request.json();
    const { roomType, reason } = body;

    if (!roomType) return NextResponse.json({ success: false, message: "Room type required" }, { status: 400 });

    const application = await HostelApplication.create({
      studentId: decoded._id,
      studentName: `${student.name.first} ${student.name.last}`,
      studentRegdNo: student.regdNo,
      roomType,
      reason,
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
