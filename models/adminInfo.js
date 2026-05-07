import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    name: {
      first: { type: String, required: [true, "First name is required"] },
      middle: { type: String },
      last: { type: String, required: [true, "Last name is required"] },
    },
    employeeId: { type: String, required: [true, "Employee ID is required"], unique: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Enter a valid email"],
    },
    password: { type: String, required: [true, "Password is required"] },
    department: {
      type: String,
      enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    },
    profileUrl: { type: String },
  },
  { timestamps: true }
);

export const Admin =
  mongoose.models.admin || mongoose.model("admin", adminSchema);
