import { ConnectDb } from "@/helper/db";
import { Grade } from "@/models/Grade";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const regdNo = searchParams.get("regdNo");

    const query = studentId ? { studentId } : regdNo ? { studentRegdNo: regdNo } : {};
    const grades = await Grade.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: grades });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, studentRegdNo, courseName, courseCode, semester, marksObtained, maxMarks, credits } = body;

    if (!studentId || !studentRegdNo || !courseName || !semester || marksObtained == null || !maxMarks) {
      return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
    }

    const percentage = (marksObtained / maxMarks) * 100;
    let grade = "F";
    let gpa = 0;
    if (percentage >= 90) { grade = "O"; gpa = 10; }
    else if (percentage >= 80) { grade = "A+"; gpa = 9; }
    else if (percentage >= 70) { grade = "A"; gpa = 8; }
    else if (percentage >= 60) { grade = "B+"; gpa = 7; }
    else if (percentage >= 50) { grade = "B"; gpa = 6; }
    else if (percentage >= 40) { grade = "C"; gpa = 5; }

    const existing = await Grade.findOne({ studentId, courseName, semester });
    let result;
    if (existing) {
      result = await Grade.findByIdAndUpdate(existing._id, { marksObtained, maxMarks, grade, gpa, credits }, { new: true });
    } else {
      result = await Grade.create({ studentId, studentRegdNo, courseName, courseCode, semester, marksObtained, maxMarks, grade, gpa, credits: credits || 3 });
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
