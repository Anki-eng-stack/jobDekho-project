const nodemailer = require("nodemailer");

const firstValue = (...values) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim() || "";

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const createMailer = (env = process.env, nodemailerClient = nodemailer) => {
  const smtpHost = firstValue(env.SMTP_HOST);
  const smtpUser = firstValue(env.SMTP_USER, env.MAIL_USER, env.EMAIL_USER);
  const rawPassword = firstValue(env.SMTP_PASS, env.MAIL_PASS, env.EMAIL_PASS);
  const configuredService = firstValue(env.MAIL_SERVICE, env.SMTP_SERVICE);
  const inferredService = !smtpHost && /@gmail\.com$/i.test(smtpUser) ? "gmail" : "";
  const service = configuredService || inferredService;
  const smtpPass = service.toLowerCase() === "gmail"
    ? rawPassword.replace(/\s+/g, "")
    : rawPassword;
  const smtpPort = Number(env.SMTP_PORT || 587);
  const smtpSecure = parseBoolean(env.SMTP_SECURE, smtpPort === 465);
  const mailFrom = firstValue(
    env.MAIL_FROM,
    smtpUser ? `"JobDekho" <${smtpUser}>` : ""
  );

  const missing = [];
  if (!service && !smtpHost) missing.push("MAIL_SERVICE or SMTP_HOST");
  if (!smtpUser) missing.push("MAIL_USER or SMTP_USER");
  if (!smtpPass) missing.push("MAIL_PASS or SMTP_PASS");
  if (!mailFrom) missing.push("MAIL_FROM");
  if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    missing.push("a valid SMTP_PORT");
  }

  const isMailConfigured = missing.length === 0;
  let transporter = null;

  if (isMailConfigured) {
    const transportOptions = service
      ? {
          service,
          auth: { user: smtpUser, pass: smtpPass },
        }
      : {
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: { user: smtpUser, pass: smtpPass },
        };

    transporter = nodemailerClient.createTransport({
      ...transportOptions,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }

  const requireTransporter = () => {
    if (transporter) return transporter;
    const error = new Error(`Mailer is not configured. Missing ${missing.join(", ")}.`);
    error.code = "MAIL_NOT_CONFIGURED";
    throw error;
  };

  const sendMail = async ({ to, subject, text, html }) => {
    if (!to) {
      const error = new Error("Email recipient is required.");
      error.code = "MAIL_RECIPIENT_REQUIRED";
      throw error;
    }

    return requireTransporter().sendMail({
      from: mailFrom,
      to,
      subject,
      text,
      html,
    });
  };

  return {
    sendMail,
    verifyMailConnection: () => requireTransporter().verify(),
    isMailConfigured,
  };
};

const mailer = createMailer();

const sendVerificationEmail = async (to, token) => {
  const clientUrl = firstValue(process.env.CLIENT_URL);
  if (!clientUrl) {
    const error = new Error("CLIENT_URL is required to create a verification link.");
    error.code = "CLIENT_URL_NOT_CONFIGURED";
    throw error;
  }

  const verifyUrl = new URL("/verify-email", clientUrl);
  verifyUrl.searchParams.set("token", token);

  return mailer.sendMail({
    to,
    subject: "Verify your JobDekho account",
    html: `
      <p>Welcome to JobDekho.</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl.toString()}">${verifyUrl.toString()}</a>
    `,
  });
};

const sendResetPasswordEmail = (to, resetUrl) =>
  mailer.sendMail({
    to,
    subject: "Reset your JobDekho password",
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${escapeHtml(resetUrl)}">${escapeHtml(resetUrl)}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });

const sendOTPEmail = (to, otp) =>
  mailer.sendMail({
    to,
    subject: "Your JobDekho OTP Code",
    html: `<h3>Your OTP is: <strong>${escapeHtml(otp)}</strong></h3><p>This OTP is valid for 10 minutes.</p>`,
  });

const sendInterviewUpdateEmail = ({
  to,
  applicantName,
  jobTitle,
  oldDate,
  newDate,
  mode,
  location,
  notes,
}) => {
  const oldDateText = oldDate ? new Date(oldDate).toLocaleString() : "Not available";
  const newDateText = newDate ? new Date(newDate).toLocaleString() : "Not available";

  return mailer.sendMail({
    to,
    subject: "Interview Schedule Updated",
    html: `
      <p>Hello ${escapeHtml(applicantName || "Candidate")},</p>
      <p>Your interview schedule has been updated.</p>
      <p><strong>Job:</strong> ${escapeHtml(jobTitle || "N/A")}</p>
      <p><strong>Previous time:</strong> ${escapeHtml(oldDateText)}</p>
      <p><strong>New time:</strong> ${escapeHtml(newDateText)}</p>
      <p><strong>Mode:</strong> ${escapeHtml(mode || "N/A")}</p>
      <p><strong>Location / Link:</strong> ${escapeHtml(location || "N/A")}</p>
      ${notes ? `<p><strong>Notes:</strong> ${escapeHtml(notes)}</p>` : ""}
      <p>Please check your dashboard for the latest details.</p>
    `,
  });
};

module.exports = {
  createMailer,
  isMailConfigured: mailer.isMailConfigured,
  verifyMailConnection: mailer.verifyMailConnection,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendOTPEmail,
  sendInterviewUpdateEmail,
};
