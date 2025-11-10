const asyncHandler = require('express-async-handler');
const admin = require('firebase-admin');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register or login user with phone number
// @route   POST /api/auth/phone
// @access  Public
const registerOrLoginWithPhone = asyncHandler(async (req, res) => {
  const { idToken, name } = req.body;

  try {
    // Verify the ID token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // User exists, log them in
      res.json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // User does not exist, create a new user
      const newUser = await User.create({
        firebaseUid: uid,
        mobile: phone_number,
        name: name || 'User', // Use provided name or default
        role: 'user', 
      });

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        mobile: newUser.mobile,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    console.error('Error in phone authentication:', error);
    res.status(401).send('Phone authentication failed. Invalid token.');
  }
});


module.exports = {
  registerOrLoginWithPhone,
};
