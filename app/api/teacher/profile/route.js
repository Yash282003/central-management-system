import { ConnectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import { Teacher } from "@/models/teacherInfo";

ConnectDb();

// ✅ GET - Fetch teacher profile by email or id
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
    const teacher = await Teacher.findOne(query).select("-password");

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Profile fetched successfully", data: teacher },
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

// ✅ PUT - Update teacher profile
export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, name, mobile, address, profileUrl, designation } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required to identify teacher" },
        { status: 400 }
      );
    }

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { email },
      { name, mobile, address, profileUrl, designation },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedTeacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: updatedTeacher,
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

// ✅ DELETE - Delete a teacher
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
