import { ConnectDb } from "@/helper/db";
import { MessMenu } from "@/models/MessMenu";
import { NextResponse } from "next/server";

ConnectDb();

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export async function GET() {
  try {
    const menu = await MessMenu.find({ week: "current" });
    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { menuItems } = body;

    const ops = menuItems.map((item) => ({
      updateOne: {
        filter: { day: item.day, week: "current" },
        update: { $set: { ...item, week: "current" } },
        upsert: true,
      },
    }));

    await MessMenu.bulkWrite(ops);
    const updated = await MessMenu.find({ week: "current" });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
