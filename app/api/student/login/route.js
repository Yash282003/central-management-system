import { Student } from "@/models/studentInfo";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function POST(request) {
  try {
    const body = await request.json();
    const { regdNo, password } = body;

    const student = await Student.findOne({ regdNo });

    if (!student) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: student._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
console.log(token)
    return NextResponse.json({
      success: true,
      token, // ✅ IMPORTANT
      data: student,
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}