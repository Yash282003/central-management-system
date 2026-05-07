import { ConnectDb } from "@/helper/db";
import { Student } from "@/models/studentInfo";
import { HostelRoom } from "@/models/HostelRoom";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const students = await Student.find().select("-password").sort({ createdAt: -1 });
    const rooms = await HostelRoom.find();

    const enriched = students.map(s => {
      const room = rooms.find(r => r.occupants.some(o => o.toString() === s._id.toString()));
      return { ...s.toObject(), room: room ? { roomNo: room.roomNo, block: room.block } : null };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
