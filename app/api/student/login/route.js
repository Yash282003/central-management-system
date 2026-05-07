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
      { _id: student._id, role: "student" },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      data: { _id: student._id, name: student.name, email: student.email, regdNo: student.regdNo },
    });

    response.cookies.set("studentToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}