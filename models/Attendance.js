import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "student", required: true },
    studentRegdNo: { type: String, required: true },
    courseName: { type: String, required: true },
    courseCode: { type: String },
    totalClasses: { type: Number, required: true, default: 0 },
    attended: { type: Number, required: true, default: 0 },
    percentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Attendance =
  mongoose.models.attendance || mongoose.model("attendance", attendanceSchema);
