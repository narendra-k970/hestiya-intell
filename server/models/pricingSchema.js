const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema(
  {
    Country: { type: String, required: true },
    Month: { type: String, required: true },
    Vintage: { type: String, required: true },
    Technology: { type: String }, // 'Type' ko 'Technology' kar diya
    Rate: { type: Number, required: true },
    isRE100: { type: String, enum: ["Yes", "No"], default: "No" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Pricing", PricingSchema);
