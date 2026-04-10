const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const userController = require("../controller/userController");
// const loginLimiter = require("../middleware/rateLimiter");

router.post("/send-otp", userController.sendOtp);

router.post("/verify-otp", userController.verifyOtp);

router.post("/complete-signup", userController.completeKycAndSignup);

router.post("/login", userController.login);
router.get("/profile", protect, userController.getUserProfile);
router.get("/all", protect, userController.getAllUsers);

module.exports = router;
