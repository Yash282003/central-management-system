import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Dream", "Core", "Mass", "Super Dream"],
    },

    package: {
      type: String,
      required: [true, "Package is required"],
    },

    eligibility: {
      cgpa: {
        type: Number,
        required: [true, "Minimum CGPA is required"],
        min: [0, "CGPA cannot be negative"],
        max: [10, "CGPA cannot exceed 10"],
      },
    },

    eligibleBranches: {
      type: [String],
      required: [true, "Eligible branches are required"],
      enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    },

    driveDate: {
      type: Date,
      required: [true, "Drive date is required"],
    },

    registered: {
      type: Number,
      default: 0,
    },

    eligible: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Company =
  mongoose.models.companylist || mongoose.model("companylist", companySchema);
