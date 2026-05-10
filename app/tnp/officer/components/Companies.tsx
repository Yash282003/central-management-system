import { ConnectDb } from "@/helper/db";
import { Company } from "@/models/Company";
import CompaniesView from "@/app/tnp/officer/components/CompaniesView";

// Server Component — queries DB directly (no HTTP round-trip)
export default async function OfficerCompanies() {
  await ConnectDb();

  const companies = await Company.find({})
    .sort({ driveDate: 1 })
    .lean();

  // Convert MongoDB ObjectIds / Dates to plain serializable objects
  const serialized = companies.map((c) => ({
    ...c,
    _id: c._id.toString(),
    driveDate: c.driveDate instanceof Date ? c.driveDate.toISOString() : c.driveDate,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
  }));

  return <CompaniesView companies={serialized} />;
}