import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { TnpNotice } from "@/models/TnpNotice";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// POST /api/student/tnp-notices/seen — body { ids: [string] }
// Marks the given notices as seen by the logged-in student.
export async function POST(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: true, updated: 0 });
    }

    const result = await TnpNotice.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { seenBy: decoded._id } }
    );

    return NextResponse.json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
