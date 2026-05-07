import mongoose, { Schema } from "mongoose";

const gradeSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "student", required: true },
    studentRegdNo: { type: String, required: true },
    courseName: { type: String, required: true },
    courseCode: { type: String },
    semester: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    grade: { type: String },
    gpa: { type: Number },
    credits: { type: Number, default: 3 },
  },
  { timestamps: true }
);

export const Grade =
  mongoose.models.grade || mongoose.model("grade", gradeSchema);
