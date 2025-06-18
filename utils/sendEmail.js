const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async ({ to, token }) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"We Connect" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="font-weight: bold; font-size: 16px; text-decoration: underline;">${resetLink}</a>
      <p>If you didn't request this, you can safely ignore it.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    
    // Verify the transporter to ensure it's ready to send emails
      transporter.verify((error, success) => {
      if (error) {
        console.error("Email transporter verification failed:", error);
      } else {
        console.log("Email transporter is ready to send messages.");
      }
    });
    
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }

};

module.exports = sendResetPasswordEmail;
