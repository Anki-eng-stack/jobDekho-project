const nodemailer = require("nodemailer");
//const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (to, token) => {
  try {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"JobDekho" <${process.env.MAIL_USER}>`,
      to,
      subject: "Verify your JobDekho account",
      html: `
        <p>Welcome to JobDekho.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    });
  } catch (err) {
    console.error("Verification email send failed:", err.message);
    throw err;
  }
};

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

exports.sendInterviewUpdateEmail = async ({
  to,
  applicantName,
  jobTitle,
  oldDate,
  newDate,
  mode,
  location,
  notes,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const oldDateText = oldDate ? new Date(oldDate).toLocaleString() : "Not available";
    const newDateText = newDate ? new Date(newDate).toLocaleString() : "Not available";

    await transporter.sendMail({
      from: `"JobDekho" <${process.env.MAIL_USER}>`,
      to,
      subject: "Interview Schedule Updated",
      html: `
        <p>Hello ${applicantName || "Candidate"},</p>
        <p>Your interview schedule has been updated.</p>
        <p><strong>Job:</strong> ${jobTitle || "N/A"}</p>
        <p><strong>Previous time:</strong> ${oldDateText}</p>
        <p><strong>New time:</strong> ${newDateText}</p>
        <p><strong>Mode:</strong> ${mode || "N/A"}</p>
        <p><strong>Location / Link:</strong> ${location || "N/A"}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        <p>Please check your dashboard for the latest details.</p>
      `,
    });
  } catch (err) {
    console.error("Interview update email send failed:", err.message);
    throw err;
  }
};

