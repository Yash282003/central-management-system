import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Student } from "@/models/studentInfo";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function GET(request) {
  try {
    // ✅ Get token from header
    const authHeader = request.headers.get("authorization");
     console.log("AUTH HEADER:", authHeader); // 🔍 ADD THIS
    const token = authHeader?.split(" ")[1];
     console.log("TOKEN:", token); // 🔍 ADD THIS

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const student = await Student.findById(decoded._id).select("-password");

    if (!student) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      token,
      data: student,
      
    });
  } catch (error) {
      console.log("JWT ERROR:", error.message); // 👈 ADD THIS
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}

