import { ConnectDb } from "@/helper/db";
import { EmergencyContact } from "@/models/EmergencyContact";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const contacts = await EmergencyContact.find().sort({ available24x7: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
