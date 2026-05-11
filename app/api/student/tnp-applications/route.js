import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { TnpApplication } from "@/models/TnpApplication";
import { Company } from "@/models/Company";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// GET /api/student/tnp-applications — student's own applications
export async function GET(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const applications = await TnpApplication.find({ studentId: decoded._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

// POST /api/student/tnp-applications — apply to a company
export async function POST(request) {
  try {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { companyId, resumeUrl, note } = await request.json();

    if (!companyId || !resumeUrl) {
      return NextResponse.json(
        { success: false, message: "Company and resume URL are required" },
        { status: 400 }
      );
    }

    const company = await Company.findById(companyId).select("company role package").lean();
    if (!company) return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });

    const application = await TnpApplication.create({
      studentId: decoded._id,
      companyId,
      companyName: company.company,
      role: company.role,
      package: company.package,
      resumeUrl: resumeUrl.trim(),
      note: note?.trim() ?? "",
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "You have already applied to this company" },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
