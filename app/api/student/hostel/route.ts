import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ConnectDb } from "@/helper/db";
import { Hostel } from "@/models/Hostel";
import { Student } from "@/models/studentInfo";

export async function GET(request: Request) {
  await ConnectDb();

  const token = (request as any).cookies?.get?.("studentToken")?.value
    ?? (request.headers.get("cookie") || "")
        .split(";")
        .map((s) => s.trim())
        .find((c) => c.startsWith("studentToken="))
        ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ name: "Student" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { _id: string };
    const student: any = await Student.findById(decoded._id).select("name regdNo email hostel").lean();
    if (!student) return NextResponse.json({ name: "Student" }, { status: 404 });

    const fullName = `${student.name?.first ?? ""} ${student.name?.last ?? ""}`.trim() || "Student";

    // Try the Hostel residency record matched by regdNo
    const hostelRecord = await Hostel.findOne({ regd: student.regdNo }).lean() as any;

    return NextResponse.json({
      name: hostelRecord?.name || fullName,
      regd: student.regdNo,
      email: student.email,
      hostel: hostelRecord?.hostel || student.hostel?.hostelName || null,
      room: hostelRecord?.room || student.hostel?.roomNumber || null,
      course: hostelRecord?.course || null,
    });
  } catch {
    return NextResponse.json({ name: "Student" }, { status: 401 });
  }
}
