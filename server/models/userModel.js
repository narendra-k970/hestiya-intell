const mongoose = require("mongoose");

// Blocked public email providers list
const BLOCKED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "zoho.com",
  "protonmail.com",
  "ymail.com",
  "live.com",
];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v || !v.includes("@")) return false;
          const domain = v.split("@")[1].toLowerCase();
          return !BLOCKED_DOMAINS.includes(domain);
        },
        message: (props) =>
          `Access Denied: ${props.value} is a personal email. Please use your official corporate email address.`,
      },
    },
    password: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isKycCompleted: { type: Boolean, default: false },

    displayPicture: { type: String, default: "" },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Select Gender", "", null],
      default: null,
    },
    phoneNumber: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    companyName: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    companySize: {
      type: String,
      trim: true,
      default: "",
    },
    countryOfIncorporation: { type: String, trim: true, default: "" },
    reason: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
    // Ensure virtuals and getters are included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- CRITICAL FIX: Pre-save Middleware ---
// Yeh ensure karega ki save hone se pehle validation trigger ho
userSchema.pre("save", function (next) {
  const domain = this.email.split("@")[1].toLowerCase();
  if (BLOCKED_DOMAINS.includes(domain)) {
    const error = new Error("Personal email domains are strictly prohibited.");
    return next(error);
  }
  next();
});

// Indexing for faster search (Optional but recommended)
userSchema.index({ email: 1 });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
