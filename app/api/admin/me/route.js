import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Admin } from "@/models/adminInfo";
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function GET(request) {
  try {
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const admin = await Admin.findById(decoded._id).select("-password");

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: admin });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
