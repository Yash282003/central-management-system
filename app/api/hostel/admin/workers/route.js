import { ConnectDb } from "@/helper/db";
import { Worker } from "@/models/Worker";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const workers = await Worker.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: workers });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, mobile, shift } = body;
    if (!name || !role || !mobile) return NextResponse.json({ success: false, message: "Name, role, mobile required" }, { status: 400 });
    const worker = await Worker.create({ name, role, mobile, shift: shift || "morning" });
    return NextResponse.json({ success: true, data: worker }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Worker.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
