import { Admin } from "@/models/adminInfo";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, employeeId, password, department } = body;

    if (!firstName || !lastName || !email || !employeeId || !password) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const salt = parseInt(process.env.BCRYPT_SALT || "10");
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name: { first: firstName, last: lastName },
      email,
      employeeId,
      password: hashedPassword,
      department: department || undefined,
    });

    const { password: _, ...adminData } = admin.toObject();

    return NextResponse.json({ success: true, data: adminData }, { status: 201 });
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
