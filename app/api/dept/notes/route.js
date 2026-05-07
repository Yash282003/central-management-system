import { ConnectDb } from "@/helper/db";
import { Note } from "@/models/Note";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    const query = branch ? { $or: [{ branch }, { branch: "ALL" }] } : {};
    const notes = await Note.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subject, courseCode, uploadedByName, fileUrl, branch } = body;

    if (!title || !subject || !uploadedByName || !fileUrl) {
      return NextResponse.json({ success: false, message: "Title, subject, uploader, fileUrl required" }, { status: 400 });
    }

    const note = await Note.create({ title, subject, courseCode, uploadedByName, fileUrl, branch: branch || "ALL" });
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Note deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
