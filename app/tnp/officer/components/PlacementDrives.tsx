import { ConnectDb } from "@/helper/db";
import { Company } from "@/models/Company";
import PlacementDrivesView from "./PlacementDrivesView";

// Server Component — queries DB directly (no HTTP round-trip)
export default async function PlacementDrives() {
  await ConnectDb();

  const companies = await Company.find({})
    .sort({ driveDate: 1 })
    .lean();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming: any[] = [];
  const current: any[] = [];
  const completed: any[] = [];

  for (const company of companies) {
    // Serialize each document
    const serialized = {
      ...company,
      _id: company._id.toString(),
      driveDate: company.driveDate instanceof Date ? company.driveDate.toISOString() : company.driveDate,
      createdAt: company.createdAt instanceof Date ? company.createdAt.toISOString() : company.createdAt,
      updatedAt: company.updatedAt instanceof Date ? company.updatedAt.toISOString() : company.updatedAt,
    };

    const driveDate = new Date(company.driveDate);
    driveDate.setHours(0, 0, 0, 0);

    if (driveDate.getTime() === today.getTime()) {
      current.push(serialized);
    } else if (driveDate > today) {
      upcoming.push(serialized);
    } else {
      completed.push(serialized);
    }
  }

  // Already sorted by driveDate asc from DB; reverse completed for most-recent-first
  completed.reverse();

  return (
    <PlacementDrivesView
      upcoming={upcoming}
      current={current}
      completed={completed}
    />
  );
}
