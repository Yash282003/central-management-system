import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        required: [true, "First name is required"],
      },
      middle: {
        type: String,
      },
      last: {
        type: String,
        required: [true, "Last name is required"],
      },
    },

    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    dob: {
      type: Date,
    },

    profileUrl: {
      type: String,
    },

    address: {
      type: String,
    },

    designation: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Teacher =
  mongoose.models.teacher || mongoose.model("teacher", teacherSchema);
