import { ConnectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Teacher } from "@/models/teacherInfo";

ConnectDb();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ✅ Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find teacher — normalize the email (trim + lowercase) so accidental
    // trailing spaces or different casing from autofill still match.
    const normalizedEmail = email.trim().toLowerCase();
    const teacher = await Teacher.findOne({ email: normalizedEmail });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Compare password
    const passwordMatch = await bcrypt.compare(password, teacher.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // ✅ Sign JWT token
    const token = jwt.sign(
      { _id: teacher._id, role: "teacher" },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        employeeId: teacher.employeeId,
      },
    });

    response.cookies.set("teacherToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
