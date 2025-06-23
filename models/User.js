const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobseeker', 'employee', 'recruiter'], default: 'jobseeker' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePwd = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password);
};

module.exports = mongoose.model('User', userSchema);
