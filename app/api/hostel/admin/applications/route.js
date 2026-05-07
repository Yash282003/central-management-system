import { ConnectDb } from "@/helper/db";
import { HostelApplication } from "@/models/HostelApplication";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const applications = await HostelApplication.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const { status, adminNote } = body;

    const application = await HostelApplication.findByIdAndUpdate(id, { status, adminNote }, { new: true });
    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
