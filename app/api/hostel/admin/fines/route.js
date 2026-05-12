import { ConnectDb } from "@/helper/db";
import { HostelFine } from "@/models/HostelFine";
import { Student } from "@/models/studentInfo";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const fines = await HostelFine.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: fines });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentRegdNo, reason, amount } = body;

    if (!studentRegdNo || !reason || !amount) {
      return NextResponse.json({ success: false, message: "Student ID, reason, amount required" }, { status: 400 });
    }

    const student = await Student.findOne({ regdNo: studentRegdNo }).select("name _id");
    if (!student) return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });

    const fine = await HostelFine.create({
      studentId: student._id,
      studentName: `${student.name.first} ${student.name.last}`,
      studentRegdNo,
      reason,
      amount,
    });

    return NextResponse.json({ success: true, data: fine }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const fine = await HostelFine.findByIdAndUpdate(id, { status: "paid", paidAt: new Date() }, { new: true });
    return NextResponse.json({ success: true, data: fine });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });
    await HostelFine.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
