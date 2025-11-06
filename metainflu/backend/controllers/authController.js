const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Generates a JWT token for a given user ID.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (dummy function for now)
const sendOTP = async (mobile, otp) => {
  console.log(`Sending OTP ${otp} to ${mobile}`);
  // TODO: Integrate with an actual SMS gateway like Twilio or MessageBird
};

// @desc    Register user with mobile + Aadhaar
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, mobile, aadhaar } = req.body;

  const userExists = await User.findOne({ mobile });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const otp = generateOTP();
  await sendOTP(mobile, otp);

  // Create user with default role 'buyer' (set by schema)
  const user = await User.create({
    name,
    mobile,
    aadhaar,
    otp,
    otpExpires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    // role is automatically set to 'buyer' by schema default
  });

  if (user) {
    res.status(201).json({
      message: 'OTP sent to mobile number',
      userId: user._id,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login with OTP verification
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  const user = await User.findOne({ mobile });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = generateOTP();
  await sendOTP(mobile, otp);

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save();

  res.status(200).json({ message: 'OTP sent to mobile number', userId: user._id });
});

// @desc    OTP verification
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({
    _id: user.id,
    name: user.name,
    mobile: user.mobile,
    aadhaar: user.aadhaar,
    role: user.role, // Include role in response
    token: generateToken(user._id),
  });
});

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
};