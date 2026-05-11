import mongoose, { Schema } from "mongoose";

const tnpApplicationSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "companylist",
      required: true,
    },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    package: { type: String, default: "" },
    resumeUrl: { type: String, required: true },
    note: { type: String, default: "", maxlength: 200 },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "selected", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// One application per student per company
tnpApplicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

export const TnpApplication =
  mongoose.models.tnpapplication ||
  mongoose.model("tnpapplication", tnpApplicationSchema);
