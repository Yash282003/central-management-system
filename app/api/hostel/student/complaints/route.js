import { ConnectDb } from "@/helper/db";
import { HostelComplaint } from "@/models/HostelComplaint";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Student } from "@/models/studentInfo";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const complaints = await HostelComplaint.find({ studentId: decoded._id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: complaints });
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
    const { category, description } = body;

    if (!category || !description) {
      return NextResponse.json({ success: false, message: "Category and description required" }, { status: 400 });
    }

    const complaint = await HostelComplaint.create({
      studentId: decoded._id,
      studentName: `${student.name.first} ${student.name.last}`,
      studentRegdNo: student.regdNo,
      category,
      description,
    });

    return NextResponse.json({ success: true, data: complaint }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
