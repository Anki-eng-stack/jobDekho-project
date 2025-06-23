const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employee', 'recruiter', 'admin'],
    default: 'jobseeker'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePwd = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password);
};

userSchema.post('save', async function (doc) {
  try {
    const token = jwt.sign({ id: doc._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    await sendVerificationEmail(doc.email, token);
    console.log(`✅ Verification email sent to ${doc.email}`);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
});

module.exports = mongoose.model('User', userSchema);
