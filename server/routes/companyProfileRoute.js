const express = require('express');
const router = express.Router();
const companyProfileController = require('../controller/companyProfile.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

router.post('/upload', companyProfileController.uploadCompanyProfiles);
router.get('/', companyProfileController.getCompanyProfiles);
router.put('/bulk-verify', companyProfileController.bulkVerifyProfiles);

// New claim profile route
router.post('/claim', upload.single('missingDataFile'), companyProfileController.claimProfile);

module.exports = router;
