const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const normalizedEmail = email.toLowerCase().trim();

  // Domain Block Logic
  const domain = normalizedEmail.split("@")[1];
  const blocked = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
  ];
  if (blocked.includes(domain)) {
    return res.status(400).json({ message: "Only company emails allowed." });
  }

  try {
    // 1. DATABASE CHECK (Pehle dhoondo)
    const existingUser = await User.findOne({ email: normalizedEmail });

    // AGAR USER MIL GAYA -> Seedha yahan se bahar niklo message ke saath
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please sign in instead.",
      });
    }

    // 2. AGAR USER NAHI MILA -> Tabhi naya record banao
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      email: normalizedEmail,
      otp,
      otpExpires: expiry,
    });

    // Save logic
    await newUser.save({ validateBeforeSave: false });

    // 3. EMAIL SENDING
    await transporter.sendMail({
      from: '"Hestiya Intelligence" <connect@hestiya.com>',
      to: normalizedEmail,
      subject: "Verification Code - Hestiya Intelligence",
      html: `<h3>Hello, Thank you for choosing Hestiya Intelligence. To secure your account and proceed with your registration, please use the verification code provided below.
      <br/><br/>Your OTP is: <b>${otp}</b></h3>`,
    });

    return res.json({
      success: true,
      message: "OTP sent and saved successfully.",
    });
  } catch (err) {
    console.error("DATABASE ERROR:", err.message);
    // Agar koi aur error aaye toh crash na ho
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
// --- 2. VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      isKycPending: !user.isKycCompleted, // Check via flag
      message: "OTP Verified successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 3. COMPLETE KYC & SET PASSWORD ---
exports.completeKycAndSignup = async (req, res) => {
  const { email, password, ...kycData } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified or session expired." });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        ...kycData,
        password: hashedPassword,
        isKycCompleted: true,
      },
      { new: true },
    );

    res.json({
      success: true,
      message: "KYC completed and password set successfully!",
      user: {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        isKycCompleted: updatedUser.isKycCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 4. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin" && !user.isKycCompleted) {
      return res.status(400).json({
        message: "Please complete your KYC first.",
        isKycPending: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        role: user.role || "user",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
