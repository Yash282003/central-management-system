import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ConnectDb } from "@/helper/db";
import { HostelPoll } from "@/models/HostelPoll";
import { Student } from "@/models/studentInfo";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.findById(decoded._id).select("regdNo").lean();
    if (!student) return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });

    const polls = await HostelPoll.find({}).sort({ createdAt: -1 }).lean();

    const enriched = polls.map((p) => {
      let votedIndex = -1;
      const options = (p.options ?? []).map((o, idx) => {
        const voters = o.votes ?? [];
        if (voters.includes(student.regdNo)) votedIndex = idx;
        return { text: o.text, count: voters.length };
      });
      const total = options.reduce((s, o) => s + o.count, 0);
      return {
        _id: p._id,
        question: p.question,
        active: p.active,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
        closedAt: p.closedAt,
        options,
        total,
        votedIndex,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
