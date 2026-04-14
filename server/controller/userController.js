const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "connect@hestiya.com",
    pass: "tggvqfpgbaczveqn",
  },
});

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.trim().toLowerCase();
    const domain = normalizedEmail.split("@")[1];

    // 1. Manual Domain Check
    const blockedDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "icloud.com",
      "aol.com",
      "zoho.com",
      "ymail.com",
    ];
    if (blockedDomains.includes(domain)) {
      return res.status(400).json({
        success: false,
        message: "Registration failed: Only corporate emails are allowed.",
      });
    }

    // 2. SMART CHECK: Pehle user dhoondo
    const user = await User.findOne({ email: normalizedEmail });

    // Agar user mil gaya AUR KYC bhi completed hai, sirf tabhi block karein
    if (user && user.isKycCompleted) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please sign in.",
      });
    }

    // 3. OTP Generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // 4. UPSERT/UPDATE LOGIC
    // Agar user pehle se hai (par KYC pending hai), toh ye sirf OTP update karega
    // Agar naya hai, toh upsert karega
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          otp: otp,
          otpExpires: expiry,
          isEmailVerified: false, // Re-verify ki condition reset karein
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        context: "query",
      },
    );

    console.log(`OTP for ${normalizedEmail}: ${otp}`);

    // 5. Email Sending
    await transporter.sendMail({
      from: '"Hestiya Intelligence" <connect@hestiya.com>',
      to: normalizedEmail,
      subject: "Verification Code - Hestiya Intelligence",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #48BB78;">Hestiya Intelligence</h2>
          <p>Hello,</p>
          <p>Your verification code is: <b style="font-size: 24px; color: #333;">${otp}</b></p>
          <p>This code is valid for <b>10 minutes</b>. Please use this to complete your registration.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your corporate email.",
    });
  } catch (err) {
    console.error("ERROR in sendOtp:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};
// --- 2. VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found" });

    // OTP Match logic
    if (user.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpires = null;

    // SAVE CALL
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "OTP Verified successfully.",
    });
  } catch (err) {
    console.error("VERIFY-OTP ERROR:", err.message);

    // Agar model ne "Personal email" wala error throw kiya hai toh woh yahan pakda jayega
    return res.status(400).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};
// --- 3. COMPLETE KYC & SET PASSWORD ---
exports.completeKycAndSignup = async (req, res) => {
  const { email, password, ...kycData } = req.body;
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

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
      { email: normalizedEmail },
      {
        ...kycData,
        password: hashedPassword,
        isKycCompleted: true,
      },
      { new: true },
    );

    // --- WELCOME EMAIL LOGIC START ---
    try {
      await transporter.sendMail({
        from: '"Hestiya Intelligence" <connect@hestiya.com>',
        to: normalizedEmail,
        subject: "Welcome to Hestiya Intelligence - Account Activated",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #48BB78; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Hestiya Intelligence</h1>
            </div>
            <div style="padding: 30px; color: #2d3748; line-height: 1.6;">
              <p style="font-size: 18px;">Hello <b>${updatedUser.firstName || "Partner"}</b>,</p>
              <p>Congratulations! Your corporate account has been successfully verified and activated.</p>
              <p>You now have full access to <b>Hestiya Market Intelligence</b>, where you can track I-REC pricing, analyze global market trends, and manage your sustainability certificates seamlessly.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://hestiya.com/auth/sign-in" style="background-color: #48BB78; color: white; padding: 12px 25px; text-decoration: none; borderRadius: 8px; font-weight: bold; display: inline-block;">Explore Dashboard</a>
              </div>

              <p style="font-size: 14px; color: #718096; margin-top: 40px; border-top: 1px solid #edf2f7; pt: 20px;">
                If you have any questions, feel free to reply to this email or contact our support team at connect@hestiya.com.
              </p>
              <p style="font-size: 14px; color: #718096;">Best Regards,<br><b>The Hestiya Team</b></p>
            </div>
          </div>
        `,
      });
      console.log(`Welcome email sent to: ${normalizedEmail}`);
    } catch (mailErr) {
      // Email fail hone par response mat rokiye, sirf log karein
      console.error("Welcome Email Sending Failed:", mailErr);
    }
    // --- WELCOME EMAIL LOGIC END ---

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
    console.error("KYC ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- 4. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email normalization
    const normalizedEmail = email ? email.trim().toLowerCase() : "";
    const user = await User.findOne({ email: normalizedEmail });

    // 1. Generic Error (Security Tip: Don't use 404 here)
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. KYC Check (Pehle ki tarah sahi hai)
    if (user.role !== "admin" && !user.isKycCompleted) {
      return res.status(403).json({
        // 403 Forbidden is better here
        message: "Please complete your KYC first.",
        isKycPending: true,
      });
    }

    // 3. Password Match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Token generation
    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET, // Fallback hata dein prod ke liye
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
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- 5. GET USER PROFILE (For Profile Page) ---
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id 'protect' middleware से आएगा (जो हम नीचे बनाएंगे)
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpires",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --- 6. GET ALL USERS (Admin Only) ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users: users,
    });
  } catch (err) {
    console.error("Error fetching all users:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
