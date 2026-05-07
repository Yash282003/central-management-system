import { ConnectDb } from "@/helper/db";
import { Student } from "@/models/studentInfo";
import { Grade } from "@/models/Grade";
import { Attendance } from "@/models/Attendance";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    const query = branch ? { branch } : {};
    const students = await Student.find(query).select("-password").sort({ createdAt: -1 });

    const enriched = await Promise.all(
      students.map(async (s) => {
        const grades = await Grade.find({ studentId: s._id });
        const attendance = await Attendance.find({ studentId: s._id });

        const cgpa = grades.length
          ? (grades.reduce((sum, g) => sum + (g.gpa * g.credits), 0) / grades.reduce((sum, g) => sum + g.credits, 0)).toFixed(2)
          : null;

        const avgAttendance = attendance.length
          ? Math.round(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length)
          : null;

        return { ...s.toObject(), cgpa: cgpa ? parseFloat(cgpa) : null, avgAttendance };
      })
    );

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
