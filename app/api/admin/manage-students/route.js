import { ConnectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import { Student } from "@/models/studentInfo";

ConnectDb();

// ✅ GET - Fetch all students (password excluded)
export async function GET() {
  try {
    const students = await Student.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Students fetched successfully",
        data: students,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete a student by id or email
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: "Student ID or email is required" },
        { status: 400 }
      );
    }

    const query = id ? { _id: id } : { email };
    const deletedStudent = await Student.findOneAndDelete(query);

    if (!deletedStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete student" },
      { status: 500 }
    );
  }
}
