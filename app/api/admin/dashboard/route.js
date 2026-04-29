import { ConnectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import { Student } from "@/models/studentInfo";
import { Teacher } from "@/models/teacherInfo";

ConnectDb();

// ✅ GET - Admin dashboard stats
export async function GET() {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    // ✅ Branch-wise student breakdown
    const branchBreakdown = await Student.aggregate([
      { $group: { _id: "$branch", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // ✅ Department-wise teacher breakdown
    const departmentBreakdown = await Teacher.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
          totalStudents,
          totalTeachers,
          branchBreakdown,
          departmentBreakdown,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
