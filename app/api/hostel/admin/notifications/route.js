import { ConnectDb } from "@/helper/db";
import { HostelNotification } from "@/models/HostelNotification";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const notifications = await HostelNotification.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, message, priority, sentBy } = body;

    if (!title || !message) return NextResponse.json({ success: false, message: "Title and message required" }, { status: 400 });

    const notification = await HostelNotification.create({ title, message, priority: priority || "normal", sentBy: sentBy || "Admin" });
    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await HostelNotification.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
