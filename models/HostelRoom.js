import mongoose, { Schema } from "mongoose";

const hostelRoomSchema = new Schema(
  {
    roomNo: { type: String, required: true, unique: true },
    block: { type: String, required: true },
    capacity: { type: Number, required: true, default: 2 },
    type: { type: String, enum: ["single", "double", "triple"], default: "double" },
    occupants: [{ type: Schema.Types.ObjectId, ref: "student" }],
  },
  { timestamps: true }
);

export const HostelRoom =
  mongoose.models.hostelroom || mongoose.model("hostelroom", hostelRoomSchema);
