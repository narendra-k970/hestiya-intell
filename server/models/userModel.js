const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          const domain = v.split("@")[1].toLowerCase();
          const blocked = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "outlook.com",
            "icloud.com",
          ];
          return !blocked.includes(domain);
        },
        message: (props) =>
          `${props.value} is not a corporate email. Please use your company email!`,
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
      default: "user", // Default user hi rahega
    },
    // Company Details
    companyName: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    companySize: {
      type: String,
      trim: true,
      default: "",
    },
    countryOfIncorporation: { type: String, trim: true, default: "" },
    reason: { type: String, trim: true, default: "" },

    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
