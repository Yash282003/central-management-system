import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ConnectDb } from "@/helper/db";
import { HostelPoll } from "@/models/HostelPoll";
import { Student } from "@/models/studentInfo";

ConnectDb();

export async function POST(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.findById(decoded._id).select("regdNo").lean();
    if (!student) return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });

    const { pollId, optionIndex } = await request.json();
    if (!pollId || optionIndex == null) {
      return NextResponse.json({ success: false, message: "pollId and optionIndex required" }, { status: 400 });
    }

    const poll = await HostelPoll.findById(pollId);
    if (!poll) return NextResponse.json({ success: false, message: "Poll not found" }, { status: 404 });
    if (!poll.active) return NextResponse.json({ success: false, message: "Poll is closed" }, { status: 400 });

    // Remove any prior vote by this student on any option (one vote per student)
    poll.options.forEach((opt) => {
      opt.votes = (opt.votes ?? []).filter((v) => v !== student.regdNo);
    });
    if (!poll.options[optionIndex]) {
      return NextResponse.json({ success: false, message: "Invalid option" }, { status: 400 });
    }
    poll.options[optionIndex].votes.push(student.regdNo);
    poll.markModified("options");
    await poll.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
