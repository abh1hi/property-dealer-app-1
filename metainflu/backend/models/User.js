const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    password: {
      type: String,
      // Not required to maintain backward compatibility with OTP-only users
      select: false, // Don't include password in queries by default
    },
    otp: String,
    otpExpires: Date,
    role: {
      type: String,
      required: true,
      default: 'buyer',
      enum: ['buyer', 'seller', 'admin'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
