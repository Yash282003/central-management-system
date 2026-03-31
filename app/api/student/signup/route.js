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
      address
    } = body;

    // ✅ Basic validation
    if (!name?.first || !name?.last || !email || !password || !regdNo) {
      console.log(body);
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT)
    );

    // ✅ Create user
    const newUser = new Student({
      name,
      regdNo,
      branch,
      mobile,
      email,
      password: hashedPassword,
      dob,
      profileUrl,
      address
    });

    const createdUser = await newUser.save();

    // ✅ Remove password before sending response
    const userResponse = createdUser.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.log(error);

    // ✅ Duplicate key error handling
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Email or Registration Number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}