import { ConnectDb } from "@/helper/db";
import { Student } from "@/models/studentInfo";
import { HostelApplication } from "@/models/HostelApplication";
import { HostelComplaint } from "@/models/HostelComplaint";
import { Stock } from "@/models/Stock";
import { NextResponse } from "next/server";

ConnectDb();

export async function GET() {
  try {
    const [totalStudents, pendingApps, openComplaints, lowStock] = await Promise.all([
      Student.countDocuments({ hostelRoom: { $exists: true, $ne: "" } }),
      HostelApplication.countDocuments({ status: "pending" }),
      HostelComplaint.countDocuments({ status: { $in: ["open", "in-progress"] } }),
      Stock.countDocuments({ $expr: { $lte: ["$quantity", "$threshold"] } }),
    ]);

    const recentApplications = await HostelApplication.find().sort({ createdAt: -1 }).limit(5);
    const recentComplaints = await HostelComplaint.find().sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      success: true,
      data: { totalStudents, pendingApps, openComplaints, lowStock, recentApplications, recentComplaints },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
