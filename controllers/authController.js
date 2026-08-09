const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const {
  classifyMailError,
  isMailConfigured,
  sendOTPEmail,
  sendResetPasswordEmail,
  verifyMailConnection
} = require("../utils/sendEmail");

// 🔐 Token generator
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME || "7d"
  });

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const user = new User({
      name,
      email,
      password,
      role: role || "jobseeker"
    });

    await user.save();

    const token = generateToken(user);

    // ❗Optional: disable email if causing issue
    // await sendVerificationEmail(user.email, token);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePwd(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ✅ SEND OTP
exports.sendOTP = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    const user = await User.findOne({ email }).select("_id email");
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await User.updateOne(
      { _id: user._id },
      { $set: { otp, otpExpire } }
    );

    try {
      await sendOTPEmail(user.email, otp);
    } catch (mailError) {
      await User.updateOne(
        { _id: user._id, otp },
        { $unset: { otp: "", otpExpire: "" } }
      ).catch((rollbackError) => {
        console.error("OTP rollback failed:", rollbackError.message);
      });

      const mailCode = classifyMailError(mailError);
      console.error("OTP delivery failed:", mailCode, mailError.message);
      const messages = {
        MAIL_NOT_CONFIGURED: "Email service is not configured",
        MAIL_AUTH_FAILED: "Email service authentication failed",
        MAIL_UNAVAILABLE: "Email service is temporarily unavailable",
        MAIL_SEND_FAILED: "Unable to send OTP email",
      };
      return res.status(503).json({
        error: messages[mailCode],
        code: mailCode,
      });
    }

    return res.json({ message: "OTP sent successfully to email" });
  } catch (err) {
    console.error("sendOTP error:", err);
    return res.status(500).json({ error: "Error preparing OTP" });
  }
};

exports.getMailHealth = async (req, res) => {
  if (!isMailConfigured) {
    return res.status(503).json({
      status: "unavailable",
      code: "MAIL_NOT_CONFIGURED",
    });
  }

  try {
    await verifyMailConnection();
    return res.json({ status: "ok" });
  } catch (error) {
    return res.status(503).json({
      status: "unavailable",
      code: classifyMailError(error),
    });
  }
};

// ✅ VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOneAndUpdate(
      {
        email,
        otp,
        otpExpire: { $gt: new Date() },
      },
      { $unset: { otp: "", otpExpire: "" } },
      { new: true }
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const token = generateToken(user);
    res.json({
      message: "OTP verified successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("verifyOTP error:", err);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};

// ✅ REQUEST PASSWORD RESET
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ error: "No user found with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min expiry

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendResetPasswordEmail(user.email, resetUrl);

    res.json({ message: "Reset password link sent to your email" });
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    res.status(500).json({ error: "Server error during reset request" });
  }
};

// ✅ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ error: "Token invalid or expired" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ error: "Server error during password reset" });
  }
};

// ✅ GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};

// ✅ ADMIN DASHBOARD
exports.getAdminDashboard = (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    user: req.user
  });
};

// ✅ GET EMAIL
exports.getEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Failed to get email" });
  }
};
