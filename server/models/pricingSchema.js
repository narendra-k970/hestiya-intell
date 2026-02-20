const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema(
  {
    Country: { type: String, required: true },
    Month: { type: String, required: true },
    Vintage: { type: String, required: true },
    "Type ": { type: String },
    Rate: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Pricing", PricingSchema);
