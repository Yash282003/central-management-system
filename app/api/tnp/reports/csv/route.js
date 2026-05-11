import { NextResponse } from "next/server";
import { Student } from "@/models/studentInfo";
import { Company } from "@/models/Company";
import { ConnectDb } from "@/helper/db";

ConnectDb();

function toCSV(headers, rows) {
  const escape = (v) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [headers.join(","), ...rows.map((r) => r.map(escape).join(","))];
  return lines.join("\r\n");
}

// GET /api/tnp/reports/csv?type=placed|all|companies|branch&branch=CSE
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "placed";
    const branch = searchParams.get("branch");

    let csv = "";
    let filename = "report.csv";

    if (type === "companies") {
      const filter = branch ? { eligibleBranches: branch } : {};
      const companies = await Company.find(filter).sort({ driveDate: 1 }).lean();
      const headers = ["Company", "Role", "Category", "Package", "Min CGPA", "Eligible Branches", "Drive Date", "Registered", "Eligible"];
      const rows = companies.map((c) => [
        c.company,
        c.role,
        c.category,
        c.package,
        c.eligibility?.cgpa ?? "",
        (c.eligibleBranches ?? []).join("; "),
        c.driveDate ? new Date(c.driveDate).toLocaleDateString("en-IN") : "",
        c.registered ?? 0,
        c.eligible ?? 0,
      ]);
      csv = toCSV(headers, rows);
      filename = "companies_report.csv";

    } else {
      const filter = {};
      if (type === "placed") filter.status = "PLACED";
      if (branch) filter.branch = branch;

      const students = await Student.find(filter)
        .sort({ branch: 1, "name.last": 1 })
        .select("name regdNo branch cgpa status companyName package email mobile")
        .lean();

      const headers = ["Name", "Reg No", "Branch", "CGPA", "Status", "Company", "Package (LPA)", "Email", "Mobile"];
      const rows = students.map((s) => [
        [s.name?.first, s.name?.last].filter(Boolean).join(" "),
        s.regdNo,
        s.branch,
        s.cgpa ?? "",
        s.status,
        s.companyName ?? "",
        s.package ?? "",
        s.email ?? "",
        s.mobile ?? "",
      ]);
      csv = toCSV(headers, rows);
      filename = type === "placed" ? "placed_students.csv" : `all_students${branch ? `_${branch}` : ""}.csv`;
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
