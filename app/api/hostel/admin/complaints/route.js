import { ConnectDb } from "@/helper/db";
import { HostelComplaint } from "@/models/HostelComplaint";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const complaints = await HostelComplaint.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: complaints });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    const complaint = await HostelComplaint.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: complaint });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
