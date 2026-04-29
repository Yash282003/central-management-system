import { ConnectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import { Teacher } from "@/models/teacherInfo";

ConnectDb();

// ✅ GET - Fetch all teachers (password excluded)
export async function GET() {
  try {
    const teachers = await Teacher.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Teachers fetched successfully",
        data: teachers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete a teacher by id or email
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: "Teacher ID or email is required" },
        { status: 400 }
      );
    }

    const query = id ? { _id: id } : { email };
    const deletedTeacher = await Teacher.findOneAndDelete(query);

    if (!deletedTeacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Teacher deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
