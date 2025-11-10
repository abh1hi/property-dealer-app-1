const asyncHandler = require('express-async-handler');
const { auth } = require('../config/firebase-config');
const User = require('../models/User');

// Middleware to protect routes by verifying a Firebase ID token.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      // Attach the user to the request object
      req.user = await User.findById(decodedToken.uid);
      if (!req.user) {
        res.status(401);
        throw new Error('User not found.');
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to check if the user is an admin.
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
