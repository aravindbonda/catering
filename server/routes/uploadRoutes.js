const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadMenu, estimateCost } = require('../controllers/uploadController');
const { protect, requireVerified } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-z0-9._-]/gi, '-'))
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Only PDF, JPG, and PNG files are supported'), allowed.includes(file.mimetype));
  }
});

const router = express.Router();

router.post('/menu', protect, requireVerified, upload.array('files', 5), uploadMenu);
router.post('/estimate', protect, requireVerified, estimateCost);

module.exports = router;
