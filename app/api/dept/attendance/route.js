import { ConnectDb } from "@/helper/db";
import { Attendance } from "@/models/Attendance";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const regdNo = searchParams.get("regdNo");

    const query = studentId ? { studentId } : regdNo ? { studentRegdNo: regdNo } : {};
    const records = await Attendance.find(query);

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, studentRegdNo, courseName, courseCode, totalClasses, attended } = body;

    if (!studentId || !studentRegdNo || !courseName || totalClasses == null || attended == null) {
      return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
    }

    const percentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0;

    const existing = await Attendance.findOne({ studentId, courseName });
    let result;
    if (existing) {
      result = await Attendance.findByIdAndUpdate(existing._id, { totalClasses, attended, percentage }, { new: true });
    } else {
      result = await Attendance.create({ studentId, studentRegdNo, courseName, courseCode, totalClasses, attended, percentage });
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
