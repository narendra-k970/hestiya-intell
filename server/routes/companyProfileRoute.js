const express = require("express");
const router = express.Router();
const companyProfileController = require("../controller/companyProfile.controller");

router.post("/upload", companyProfileController.uploadCompanyProfiles);
router.get("/", companyProfileController.getCompanyProfiles);

module.exports = router;
