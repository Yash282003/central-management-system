import { ConnectDb } from "@/helper/db";
import { Stock } from "@/models/Stock";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const stock = await Stock.find().sort({ item: 1 });
    return NextResponse.json({ success: true, data: stock });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { item, quantity, unit, threshold, category } = body;
    if (!item || quantity == null || !unit) return NextResponse.json({ success: false, message: "Item, quantity, unit required" }, { status: 400 });
    const stock = await Stock.create({ item, quantity, unit, threshold: threshold || 10, category });
    return NextResponse.json({ success: true, data: stock }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const stock = await Stock.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: stock });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Stock.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
