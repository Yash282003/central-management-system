import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true, default: "units" },
    threshold: { type: Number, default: 10 }, // alert if below this
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

export const Stock =
  mongoose.models.stock || mongoose.model("stock", stockSchema);
