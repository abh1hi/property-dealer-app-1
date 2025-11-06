const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    mobile: {
      type: String,
      required: [true, 'Please add a mobile number'],
      unique: true,
    },
    aadhaar: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to not violate unique constraint
    },
    otp: String,
    otpExpires: Date,
    role: {
      type: String,
      required: true,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);