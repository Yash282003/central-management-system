import { Teacher } from "@/models/teacherInfo";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, middleName, lastName, employeeId, department, mobile, email, password, designation } = body;

    if (!firstName || !lastName || !employeeId || !department || !mobile || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const salt = parseInt(process.env.BCRYPT_SALT || "10");
    const hashedPassword = await bcrypt.hash(password, salt);

    const teacher = await Teacher.create({
      name: { first: firstName, middle: middleName || "", last: lastName },
      employeeId,
      department,
      mobile,
      email,
      password: hashedPassword,
      designation: designation || "",
    });

    const { password: _, ...teacherData } = teacher.toObject();

    return NextResponse.json({ success: true, data: teacherData }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, message: `${field === "email" ? "Email" : "Employee ID"} already exists` },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
