const { body, validationResult } = require('express-validator');

// Register validation rules
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('mobile')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian mobile number (10 digits starting with 6-9)'),
  body('aadhaar')
    .optional()
    .matches(/^\d{12}$/)
    .withMessage('Invalid Aadhaar number (12 digits)'),
  body('phoneAuthToken')
    .notEmpty()
    .withMessage('Phone auth token is required'),
  body('password')
    .if((value) => value !== undefined && value !== '')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain special character'),
];

// Phone login validation
const validatePhoneLogin = [
  body('mobile')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid mobile number'),
  body('phoneAuthToken')
    .notEmpty()
    .withMessage('Phone auth token is required'),
];

// Password login validation
const validatePasswordLogin = [
  body('mobile')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid mobile number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Check auth method validation
const validateCheckAuthMethod = [
  body('mobile')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid mobile number'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validatePhoneLogin,
  validatePasswordLogin,
  validateCheckAuthMethod,
  handleValidationErrors,
};