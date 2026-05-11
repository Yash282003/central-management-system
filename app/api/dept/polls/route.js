import { NextResponse } from "next/server";
import { DeptPoll } from "@/models/DeptPoll";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// GET /api/dept/polls?branch=CSE
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    const query = branch && branch !== "ALL"
      ? { $or: [{ branch }, { branch: "ALL" }] }
      : {};

    const polls = await DeptPoll.find(query)
      .sort({ createdAt: -1 })
      .select("-voters")
      .lean();

    const now = new Date();
    // Auto-close expired polls in response (don't mutate DB on read)
    const data = polls.map((p) => ({
      ...p,
      _id: p._id.toString(),
      status: p.endDate && new Date(p.endDate) < now ? "closed" : p.status,
      totalVotes: (p.votes ?? []).reduce((a, b) => a + b, 0),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/dept/polls — teacher creates a poll
export async function POST(request) {
  try {
    const { question, options, branch, endDate, createdBy } = await request.json();

    if (!question || !Array.isArray(options) || options.length < 2 || !branch) {
      return NextResponse.json(
        { success: false, message: "question, at least 2 options, and branch are required" },
        { status: 400 }
      );
    }

    const poll = await DeptPoll.create({
      question: question.trim(),
      options: options.map((o) => String(o).trim()).filter(Boolean),
      votes: new Array(options.length).fill(0),
      branch,
      endDate: endDate ? new Date(endDate) : null,
      createdBy: createdBy ?? "",
    });

    return NextResponse.json({ success: true, data: poll }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
