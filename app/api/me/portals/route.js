import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Student } from "@/models/studentInfo";
import { Teacher } from "@/models/teacherInfo";
import { Admin } from "@/models/adminInfo";
import { ConnectDb } from "@/helper/db";

ConnectDb();

const DEPT_STUDENT = {
  id: "dept",
  label: "Department",
  description: "Courses, attendance, grades, notices",
  href: "/dept/student/dashboard",
};
const DEPT_TEACHER = { ...DEPT_STUDENT, href: "/dept/teacher/dashboard" };
const DEPT_ADMIN = { ...DEPT_STUDENT, href: "/dept/admin/dashboard" };

const TNP_STUDENT = {
  id: "tnp",
  label: "Training & Placement",
  description: "Placements, companies, applications",
  href: "/tnp/student/dashboard",
};

const HOSTEL_STUDENT = {
  id: "hostel",
  label: "Hostel",
  description: "Room, complaints, mess, notifications",
  href: "/hostel/student/dashboard",
};
const HOSTEL_ADMIN = { ...HOSTEL_STUDENT, href: "/hostel/admin" };

function initials(first = "", last = "") {
  return `${(first[0] || "").toUpperCase()}${(last[0] || "").toUpperCase()}` || "??";
}

export async function GET(request) {
  const studentToken = request.cookies.get("studentToken")?.value;
  const teacherToken = request.cookies.get("teacherToken")?.value;
  const adminToken = request.cookies.get("adminToken")?.value;

  try {
    if (studentToken) {
      const decoded = jwt.verify(studentToken, process.env.JWT_KEY);
      const student = await Student.findById(decoded._id).select("name").lean();
      if (!student) throw new Error("Student not found");

      return NextResponse.json({
        success: true,
        user: {
          name: `${student.name?.first ?? ""} ${student.name?.last ?? ""}`.trim() || "Student",
          role: "student",
          initials: initials(student.name?.first, student.name?.last),
        },
        portals: [DEPT_STUDENT, TNP_STUDENT, HOSTEL_STUDENT],
      });
    }

    if (teacherToken) {
      const decoded = jwt.verify(teacherToken, process.env.JWT_KEY);
      const teacher = await Teacher.findById(decoded._id).select("name").lean();
      if (!teacher) throw new Error("Teacher not found");

      const first = teacher.name?.first ?? teacher.name ?? "";
      const last = teacher.name?.last ?? "";

      return NextResponse.json({
        success: true,
        user: {
          name: `${first} ${last}`.trim() || "Teacher",
          role: "teacher",
          initials: initials(first, last),
        },
        portals: [DEPT_TEACHER],
      });
    }

    if (adminToken) {
      const decoded = jwt.verify(adminToken, process.env.JWT_KEY);
      const admin = await Admin.findById(decoded._id).select("name").lean();
      if (!admin) throw new Error("Admin not found");

      const first = admin.name?.first ?? admin.name ?? "";
      const last = admin.name?.last ?? "";

      return NextResponse.json({
        success: true,
        user: {
          name: `${first} ${last}`.trim() || "Admin",
          role: "admin",
          initials: initials(first, last),
        },
        portals: [DEPT_ADMIN, HOSTEL_ADMIN],
      });
    }

    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired session" },
      { status: 401 }
    );
  }
}
