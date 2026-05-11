import { ConnectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Student } from "@/models/studentInfo";

ConnectDb();

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      regdNo,
      branch,
      mobile,
      email,
      password,
      dob,
      profileUrl,
      address,
    } = body;

    if (!name?.first || !name?.last) {
      return NextResponse.json(
        { message: "First and last name are required" },
        { status: 400 }
      );
    }
    if (!regdNo?.trim()) {
      return NextResponse.json({ message: "Registration number is required" }, { status: 400 });
    }
    if (!branch) {
      return NextResponse.json({ message: "Branch is required" }, { status: 400 });
    }
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return NextResponse.json({ message: "Valid 10-digit mobile is required" }, { status: 400 });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!dob) {
      return NextResponse.json({ message: "Date of birth is required" }, { status: 400 });
    }
    if (!address?.trim()) {
      return NextResponse.json({ message: "Address is required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT || "10")
    );

    const newUser = new Student({
      name: {
        first: name.first.trim(),
        middle: name.middle?.trim() || undefined,
        last: name.last.trim(),
      },
      regdNo: regdNo.trim(),
      branch,
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      dob: new Date(dob),
      status: "UNPLACED",
      profileUrl: profileUrl || undefined,
      address: address.trim(),
    });

    const createdUser = await newUser.save();
    const userResponse = createdUser.toObject();
    delete userResponse.password;

    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error) {
    console.error("[student/signup] error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] ?? "field";
      return NextResponse.json(
        { message: `A student with that ${field} already exists` },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const first = Object.values(error.errors)[0];
      return NextResponse.json(
        { message: first?.message || "Validation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
