exports.sendVerificationEmail = async (to, token) => {
  console.log("📧 Sending email to:", to);
  console.log("🔑 Token:", token);
  
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    }
  });

  await transporter.sendMail({
    from: process.env.SMPT_MAIL,
    to,
    subject: "Verify your JobDekho account",
    html: `<p>Click <a href="${process.env.CLIENT_URL}/verify/${token}">here</a> to verify your email.</p>`
  });

  console.log("✅ Email sent.");
};
