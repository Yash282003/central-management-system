import { ConnectDb } from "@/helper/db";
import { Publication } from "@/models/Publication";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    const query = branch ? { $or: [{ branch }, { branch: "ALL" }] } : {};
    const publications = await Publication.find(query).sort({ year: -1 });

    return NextResponse.json({ success: true, data: publications });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, authors, journal, year, link, abstract, branch } = body;

    if (!title || !authors || !year) {
      return NextResponse.json({ success: false, message: "Title, authors, year required" }, { status: 400 });
    }

    const pub = await Publication.create({ title, authors, journal, year, link, abstract, branch: branch || "ALL" });
    return NextResponse.json({ success: true, data: pub }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    await Publication.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Publication deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
