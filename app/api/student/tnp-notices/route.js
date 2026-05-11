import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { TnpNotice } from "@/models/TnpNotice";
import { Student } from "@/models/studentInfo";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// GET /api/student/tnp-notices — notices visible to the logged-in student
export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.findById(decoded._id)
      .select("_id branch status")
      .lean();

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const studentStatus = student.status || "UNPLACED";
    const now = new Date();
    const notices = await TnpNotice.find({
      $and: [
        {
          $or: [
            { targetBranches: "ALL" },
            { targetBranches: student.branch },
          ],
        },
        {
          $or: [
            { targetStatus: "ALL" },
            { targetStatus: studentStatus },
          ],
        },
        {
          $or: [
            { expiresAt: null },
            { expiresAt: { $gte: now } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const studentIdStr = String(student._id);
    const unseenIds = notices
      .filter(
        (n) => !(n.seenBy || []).some((id) => String(id) === studentIdStr)
      )
      .map((n) => String(n._id));

    return NextResponse.json({
      success: true,
      data: notices,
      unseenIds,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
