import { Company } from "@/models/Company";
import { NextResponse } from "next/server";
import { ConnectDb } from "@/helper/db";

ConnectDb();

// GET /api/tnp/companies
// Returns all company drive listings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const branch = searchParams.get("branch");

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (branch) {
      filter.eligibleBranches = branch;
    }

    const companies = await Company.find(filter).sort({ driveDate: 1 }).lean();

    return NextResponse.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.log('Error inside companies of tnp', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/tnp/companies
// Create a new company drive listing (TNP officer only)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company,
      role,
      description,
      category,
      package: pkg,
      eligibility,
      eligibleBranches,
      driveDate,
      registered,
      eligible,
    } = body;

    if (
      !company ||
      !role ||
      !category ||
      !pkg ||
      !eligibility?.cgpa ||
      !eligibleBranches?.length ||
      !driveDate
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const newCompany = await Company.create({
      company,
      role,
      description: description ?? "",
      category,
      package: pkg,
      eligibility,
      eligibleBranches,
      driveDate,
      registered: registered ?? 0,
      eligible: eligible ?? 0,
    });

    return NextResponse.json(
      { success: true, data: newCompany },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
