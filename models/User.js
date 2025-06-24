const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employee', 'recruiter', 'admin'],
      default: 'jobseeker'
    },
    isVerified: {
      type: Boolean,
      default: false
    },

    // 🔐 Reset Password Fields
    resetPasswordToken: {
      type: String,
      default: undefined
    },
    resetPasswordExpire: {
      type: Date,
      default: undefined
    },

    // 🔑 OTP Login Fields
    otp: {
      type: String,
      select: false // Keep secure, select only when needed
    },
    otpExpire: {
      type: Date,
      select: false
    }
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔒 Compare input password with hashed one
userSchema.methods.comparePwd = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password);
};

// 📩 Send verification email after account creation
userSchema.post('save', async function (doc, next) {
  // Only send verification email on *new* user creation
  if (doc.isNew) {
    try {
      const token = jwt.sign({ id: doc._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
      await sendVerificationEmail(doc.email, token);
      console.log(`✅ Verification email sent to ${doc.email}`);
    } catch (err) {
      console.error("❌ Email error:", err.message);
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
