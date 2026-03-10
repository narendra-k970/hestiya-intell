const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const userController = require("../controller/userController");

router.post("/send-otp", userController.sendOtp);

router.post("/verify-otp", userController.verifyOtp);

router.post("/complete-signup", userController.completeKycAndSignup);

router.post("/login", userController.login);
router.get("/profile", protect, userController.getUserProfile);

module.exports = router;
