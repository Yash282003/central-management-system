import { ConnectDb } from "@/helper/db";
import { Notice } from "@/models/Notice";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    const query = branch ? { $or: [{ branch }, { branch: "ALL" }] } : {};
    const notices = await Notice.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, priority, authorName, authorRole, branch } = body;

    if (!title || !content || !authorName || !authorRole) {
      return NextResponse.json({ success: false, message: "Title, content, and author are required" }, { status: 400 });
    }

    const notice = await Notice.create({ title, content, priority, authorName, authorRole, branch: branch || "ALL" });
    return NextResponse.json({ success: true, data: notice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Notice deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
