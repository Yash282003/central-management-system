import { ConnectDb } from "@/helper/db";
import { HostelPoll } from "@/models/HostelPoll";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

ConnectDb();

export async function GET() {
  try {
    const polls = await HostelPoll.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: polls });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { question, options } = body;
    if (!question || !options?.length) return NextResponse.json({ success: false, message: "Question and options required" }, { status: 400 });
    const poll = await HostelPoll.create({ question, options: options.map(text => ({ text, votes: [] })) });
    return NextResponse.json({ success: true, data: poll }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");
    const body = await request.json();

    if (action === "toggle") {
      const poll = await HostelPoll.findById(id);
      poll.active = !poll.active;
      if (!poll.active) poll.closedAt = new Date();
      await poll.save();
      return NextResponse.json({ success: true, data: poll });
    }

    if (action === "vote") {
      const { optionIndex, voterRegdNo } = body;
      const poll = await HostelPoll.findById(id);
      if (!poll.active) return NextResponse.json({ success: false, message: "Poll is closed" }, { status: 400 });
      // Remove any existing vote by this student
      poll.options.forEach(opt => { opt.votes = opt.votes.filter(v => v !== voterRegdNo); });
      poll.options[optionIndex].votes.push(voterRegdNo);
      await poll.save();
      return NextResponse.json({ success: true, data: poll });
    }

    const poll = await HostelPoll.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: poll });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await HostelPoll.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Poll deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
