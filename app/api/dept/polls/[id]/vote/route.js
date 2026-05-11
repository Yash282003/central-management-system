import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DeptPoll } from "@/models/DeptPoll";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// POST /api/dept/polls/[id]/vote — body: { optionIndex }
export async function POST(request, { params }) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { id } = await params;
    const { optionIndex } = await request.json();

    const poll = await DeptPoll.findById(id);
    if (!poll) return NextResponse.json({ success: false, message: "Poll not found" }, { status: 404 });
    if (poll.status === "closed") return NextResponse.json({ success: false, message: "Poll is closed" }, { status: 400 });
    if (poll.voters.some((v) => String(v) === String(decoded._id))) {
      return NextResponse.json({ success: false, message: "Already voted" }, { status: 409 });
    }
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json({ success: false, message: "Invalid option" }, { status: 400 });
    }

    poll.votes[optionIndex] = (poll.votes[optionIndex] ?? 0) + 1;
    poll.voters.push(decoded._id);
    poll.markModified("votes");
    await poll.save();

    return NextResponse.json({
      success: true,
      data: {
        votes: poll.votes,
        totalVotes: poll.votes.reduce((a, b) => a + b, 0),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
