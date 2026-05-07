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
