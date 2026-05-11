import { NextResponse } from "next/server";
import { TnpNotice } from "@/models/TnpNotice";
import { Company } from "@/models/Company";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// GET /api/tnp/notices — list all TnP notices (officer view)
export async function GET() {
  try {
    const notices = await TnpNotice.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/tnp/notices — create a notice (officer)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      priority,
      companyId,
      targetBranches,
      targetStatus,
      authorName,
      expiresAt,
    } = body;

    if (!title || !content || !authorName) {
      return NextResponse.json(
        { success: false, message: "title, content and authorName are required" },
        { status: 400 }
      );
    }

    let companyName = null;
    if (companyId) {
      const company = await Company.findById(companyId).select("company").lean();
      if (company) companyName = company.company;
    }

    const notice = await TnpNotice.create({
      title,
      content,
      priority: priority || "medium",
      companyId: companyId || null,
      companyName,
      targetBranches:
        Array.isArray(targetBranches) && targetBranches.length
          ? targetBranches
          : ["ALL"],
      targetStatus:
        Array.isArray(targetStatus) && targetStatus.length
          ? targetStatus
          : ["ALL"],
      authorName,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return NextResponse.json(
      { success: true, data: notice },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
