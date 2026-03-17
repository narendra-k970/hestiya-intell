// models/pendingPricingSchema.js
const mongoose = require("mongoose");

const PendingPricingSchema = new mongoose.Schema(
  {
    Country: { type: String, required: true },
    Month: { type: String, required: true },
    Rate: { type: Number, required: true },
    Technology: { type: String, default: "I-REC" },
    Source: { type: String }, // Website jahan se uthaya
    isRE100: { type: String, enum: ["Yes", "No"], default: "No" },
    Status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PendingPricing", PendingPricingSchema);
