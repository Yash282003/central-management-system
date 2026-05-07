import { ConnectDb } from "@/helper/db";
import { EmergencyContact } from "@/models/EmergencyContact";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const contacts = await EmergencyContact.find().sort({ available24x7: -1, name: 1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, mobile, available24x7 } = body;
    if (!name || !role || !mobile) return NextResponse.json({ success: false, message: "Name, role, mobile required" }, { status: 400 });
    const contact = await EmergencyContact.create({ name, role, mobile, available24x7: !!available24x7 });
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await EmergencyContact.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
