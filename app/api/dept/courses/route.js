import { ConnectDb } from "@/helper/db";
import { Course } from "@/models/Course";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    const query = branch ? { branch } : {};
    const courses = await Course.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, code, credits, branch, semester, teacherName, description } = body;

    if (!name || !code || !branch || !semester) {
      return NextResponse.json({ success: false, message: "Name, code, branch, semester required" }, { status: 400 });
    }

    const course = await Course.create({ name, code, credits: credits || 3, branch, semester, teacherName, description });
    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ success: false, message: "Course code already exists" }, { status: 409 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    const course = await Course.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    await Course.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
