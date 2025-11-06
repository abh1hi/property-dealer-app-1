const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.route('/').post(protect, upload.array('images', 10), uploadImages);

module.exports = router;
