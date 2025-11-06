const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP } = require('../controllers/authController');
const { registerValidationRules, loginValidationRules } = require('../middleware/validators/authValidator');

// Define the routes for user authentication
router.post('/register', registerValidationRules(), registerUser);
router.post('/login', loginValidationRules(), loginUser);
router.post('/verify-otp', verifyOTP);

module.exports = router;