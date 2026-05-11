import { Student } from "@/models/studentInfo";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// GET /api/tnp/students
// Query params:
//   search   — matches name.first, name.last, regdNo (case-insensitive)
//   branch   — exact branch filter (e.g. "CSE"), omit or "ALL" for all
//   status   — "PLACED" | "UNPLACED" | "INELIGIBLE", omit or "ALL" for all
//   page     — page number (default 1)
//   limit    — page size   (default 10)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() ?? "";
    const branch = searchParams.get("branch") ?? "ALL";
    const status = searchParams.get("status") ?? "ALL";
    const page   = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit  = Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10));

    // ── Build filter ──────────────────────────────────────────────────────────
    const filter = {};

    if (branch && branch !== "ALL") {
      filter.branch = branch;
    }

    if (status && status !== "ALL") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { "name.first": { $regex: search, $options: "i" } },
        { "name.last":  { $regex: search, $options: "i" } },
        { regdNo:       { $regex: search, $options: "i" } },
      ];
    }

    // ── Query ─────────────────────────────────────────────────────────────────
    const total   = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "name regdNo branch cgpa status companyName package hostel email mobile"
      )
      .lean();

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/tnp/students — create a student (TnP officer)
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
      cgpa,
      status,
      companyName,
      package: pkg,
      address,
      profileUrl,
    } = body;

    if (
      !name?.first ||
      !name?.last ||
      !regdNo ||
      !branch ||
      !mobile ||
      !email ||
      !password ||
      !dob ||
      cgpa === undefined ||
      cgpa === null ||
      !address
    ) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const existing = await Student.findOne({
      $or: [{ email: String(email).toLowerCase() }, { regdNo }],
    }).lean();
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "A student with this email or registration number already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT || "10")
    );

    const created = await Student.create({
      name,
      regdNo,
      branch,
      mobile,
      email,
      password: hashedPassword,
      dob,
      cgpa,
      status: status || "UNPLACED",
      companyName: companyName || null,
      package: pkg ?? 0,
      address,
      profileUrl,
    });

    const obj = created.toObject();
    delete obj.password;

    return NextResponse.json(
      { success: true, data: obj },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
