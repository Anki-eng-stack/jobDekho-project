const nodemailer = require("nodemailer");
//const nodemailer = require("nodemailer");

exports.sendResetPasswordEmail = async (to, resetUrl) => {
  try {
    console.log("Preparing to send reset password email to:", to);
    console.log("Reset link:", resetUrl);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"JobDekho" <${process.env.MAIL_USER}>`,
      to,
      subject: "Reset your JobDekho password",
      html: `
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully!");
  } catch (err) {
    console.error("❌ Error sending reset email:", err.message);
    throw err;
  }
};


exports.sendOTPEmail = async (to, otp) => {
  console.log("📩 Sending OTP email to:", to);
  console.log("🔢 OTP:", otp);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"JobDekho" <${process.env.MAIL_USER}>`,
      to,
      subject: "Your JobDekho OTP Code",
      html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>This OTP is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", to);
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err.message);
    throw err;
  }
};

