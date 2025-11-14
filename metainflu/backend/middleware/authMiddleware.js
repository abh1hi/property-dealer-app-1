/*
  File: metainflu/backend/middleware/authMiddleware.js
  Purpose: Express middleware for authentication and authorization.
  'protect' verifies JWT, 'admin' checks admin role, others check specific roles.
*/

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware to protect routes by verifying a JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the user (excluding password) to the request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Token verification failed' 
      });
    }
  } else if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No authentication token provided' 
    });
  }
});

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
};

// Middleware to check if the user is a buyer
const buyer = (req, res, next) => {
  if (req.user && req.user.role === 'buyer') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Buyer access required' 
    });
  }
};

// Middleware to check if the user is a seller
const seller = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Seller access required' 
    });
  }
};

// Middleware to check if the user is either a buyer or seller
const buyerOrSeller = (req, res, next) => {
  if (req.user && (req.user.role === 'buyer' || req.user.role === 'seller')) {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Buyer or Seller access required' 
    });
  }
};

module.exports = { protect, admin, buyer, seller, buyerOrSeller };