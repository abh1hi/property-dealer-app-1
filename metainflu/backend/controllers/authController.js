const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const admin = require('firebase-admin');

// Validate password strength
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain special character');
  }
  return { valid: errors.length === 0, errors };
};

// Generate access token (short-lived)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

// Generate refresh token (long-lived)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

// @desc    Register user with Firebase phone authentication
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, mobile, aadhaar, phoneAuthToken, password } = req.body;

  // Verify phone authentication token with Firebase
  if (!phoneAuthToken) {
    return res.status(400).json({
      success: false,
      message: 'Phone authentication required',
    });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this mobile number',
      });
    }

    const userData = {
      name,
      mobile,
      aadhaar,
      phoneAuthToken,
    };

    // Validate and hash password if provided
    if (password) {
      const { valid, errors: passwordErrors } = validatePassword(password);
      if (!valid) {
        return res.status(400).json({
          success: false,
          message: 'Password does not meet requirements',
          errors: passwordErrors,
        });
      }
      userData.password = password;
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: user._id,
      hasPassword: !!password,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
});

// @desc    Login with Firebase phone authentication
// @route   POST /api/auth/login/phone
// @access  Public
const loginWithPhone = asyncHandler(async (req, res) => {
  const { mobile, phoneAuthToken } = req.body;

  if (!phoneAuthToken) {
    return res.status(400).json({
      success: false,
      message: 'Phone authentication required',
    });
  }

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      _id: user.id,
      name: user.name,
      mobile: user.mobile,
      aadhaar: user.aadhaar,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    console.error('Phone Auth Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Phone authentication failed',
    });
  }
});

// @desc    Login with password
// @route   POST /api/auth/login/password
// @access  Public
const loginWithPassword = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      message: 'Mobile and password are required',
    });
  }

  const user = await User.findOne({ mobile }).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Check if user is locked due to too many failed attempts
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({
      success: false,
      message: 'Account locked due to multiple failed login attempts. Try again later.',
    });
  }

  if (!user.password) {
    return res.status(400).json({
      success: false,
      message: 'Password login not available. Please use phone authentication.',
    });
  }

  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    // Increment failed attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    // Lock account after 5 failed attempts
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
    }
    
    await user.save();
    
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      attemptsRemaining: Math.max(0, 5 - user.loginAttempts),
    });
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    _id: user.id,
    name: user.name,
    mobile: user.mobile,
    aadhaar: user.aadhaar,
    role: user.role,
    accessToken,
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not found',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
});

// @desc    Check available auth methods for a mobile
// @route   POST /api/auth/check-auth-method
// @access  Public
const checkAuthMethod = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number is required',
    });
  }

  const user = await User.findOne({ mobile }).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    mobile: user.mobile,
    hasPassword: !!user.password,
    availableMethods: user.password ? ['phone', 'password'] : ['phone'],
  });
});

module.exports = {
  registerUser,
  loginWithPhone,
  loginWithPassword,
  refreshAccessToken,
  checkAuthMethod,
};