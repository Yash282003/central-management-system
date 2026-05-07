import { ConnectDb } from "@/helper/db";
import { HostelRoom } from "@/models/HostelRoom";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const room = await HostelRoom.findOne({ occupants: decoded._id }).populate("occupants", "name regdNo email");

    return NextResponse.json({ success: true, data: room || null });
  } catch {
    return NextResponse.json({ success: false, message: "Error fetching room" }, { status: 500 });
  }
}
