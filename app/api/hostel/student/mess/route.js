import { ConnectDb } from "@/helper/db";
import { MessMenu } from "@/models/MessMenu";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const menu = await MessMenu.find({ week: "current" });
    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
