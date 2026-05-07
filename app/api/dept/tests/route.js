import { ConnectDb } from "@/helper/db";
import { Test } from "@/models/Test";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    const query = branch ? { $or: [{ branch }, { branch: "ALL" }] } : {};
    const tests = await Test.find(query).sort({ date: 1 });

    return NextResponse.json({ success: true, data: tests });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subject, courseCode, date, duration, maxMarks, syllabus, branch, semester, createdBy } = body;

    if (!title || !subject || !date || !duration || !maxMarks) {
      return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
    }

    const test = await Test.create({ title, subject, courseCode, date, duration, maxMarks, syllabus, branch: branch || "ALL", semester, createdBy });
    return NextResponse.json({ success: true, data: test }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    const test = await Test.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    await Test.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Test deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
