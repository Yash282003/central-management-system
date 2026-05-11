import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
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

    regdNo: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
    },

    branch: {
      type: String,
      required: [true, "Branch is required"],
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
      required: [true, "Date of Birth is required"],
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      enum: ["PLACED", "UNPLACED", "INELIGIBLE"],
      default: "UNPLACED",
    },

    companyName: {
      type: String,
      default: null,
    },

    package: {
      type: Number, // in LPA
      default: 0,
    },

    hostel: {
      hostelName: {
        type: String,
      },
      roomNumber: {
        type: String,
      },
    },

    profileUrl: {
      type: String,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Student =
  mongoose.models.student || mongoose.model("student", studentSchema);