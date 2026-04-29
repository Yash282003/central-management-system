import { ConnectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import { Student } from "@/models/studentInfo";

ConnectDb();

// ✅ GET - Fetch student profile by email or id
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { success: false, message: "Email or ID is required" },
        { status: 400 }
      );
    }

    const query = email ? { email } : { _id: id };
    const student = await Student.findOne(query).select("-password");

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Profile fetched successfully", data: student },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// ✅ PUT - Update student profile
export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, name, mobile, address, profileUrl } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required to identify student" },
        { status: 400 }
      );
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { email },
      { name, mobile, address, profileUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: updatedStudent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete a student
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { success: false, message: "Email or ID is required" },
        { status: 400 }
      );
    }

    const query = email ? { email } : { _id: id };
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
