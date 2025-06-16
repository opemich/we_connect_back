const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const sendResetPasswordEmail = require("../utils/sendEmail"); // Assuming you have a utility to send emails
const nodemailer = require("nodemailer");
const FormData = require("../model/formData.model");

// Email transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   // tls: {
//   //   // Optional: disable TLS certificate verification (not recommended for production)
//   //   rejectUnauthorized: false,
//   // },
// });

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log("Error verifying transporter:", error);
//   } else {
//     console.log("Server is ready to send emails");
//   }
// });


exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await FormData.findOne({ email });

    // ⛔ No user found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!.",
      });
    }

    // ✅ User found - proceed to generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // 📩 Send email
    const emailResponse = await sendResetPasswordEmail({
      to: user.email,
      token: resetToken,
    });

    if (!emailResponse.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: emailResponse.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "A password reset link has been sent to your email.",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.verifyResetToken = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await FormData.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    res.json({ success: true, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
   console.log("🔥 Reset Password Request Received");
  console.log("Token param:", req.params.token);
  console.log("Body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("❌ Validation Errors:", errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ success: false, errors: errors.array() });
  // }

  try {
    const { password } = req.body;
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await FormData.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: user.email,
    //   subject: "Password Reset Successful",
    //   html: `<p>Your password has been successfully reset.</p>`,
    // });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  forgotPassword: exports.forgotPassword,
  verifyResetToken: exports.verifyResetToken,
  resetPassword: exports.resetPassword,
};
