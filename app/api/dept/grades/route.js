import { ConnectDb } from "@/helper/db";
import { Grade } from "@/models/Grade";
import { Student } from "@/models/studentInfo";
import { NextResponse } from "next/server";

ConnectDb();

// Recalculate the student's weighted CGPA from all their grades and persist
// it on the Student document. Returns the new CGPA, or null if no grades.
async function recomputeStudentCGPA(studentId) {
  const grades = await Grade.find({ studentId }).lean();
  if (!grades || grades.length === 0) {
    await Student.findByIdAndUpdate(studentId, { cgpa: null });
    return null;
  }
  let totalPoints = 0;
  let totalCredits = 0;
  for (const g of grades) {
    const credits = g.credits ?? 3;
    totalPoints += (g.gpa ?? 0) * credits;
    totalCredits += credits;
  }
  const cgpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : null;
  await Student.findByIdAndUpdate(studentId, { cgpa });
  return cgpa;
}

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

    const newCGPA = await recomputeStudentCGPA(studentId);

    return NextResponse.json({ success: true, data: result, cgpa: newCGPA }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });

    const grade = await Grade.findById(id);
    if (!grade) return NextResponse.json({ success: false, message: "Grade not found" }, { status: 404 });

    const studentId = grade.studentId;
    await Grade.findByIdAndDelete(id);

    const newCGPA = await recomputeStudentCGPA(studentId);
    return NextResponse.json({ success: true, cgpa: newCGPA });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
