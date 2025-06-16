// // const nodemailer = require("nodemailer");

// // const sendEmail = async (to, subject, html) => {
// //   const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });

// //   const mailOptions = {
// //     from: process.env.EMAIL_USER,
// //     to,
// //     subject,
// //     html,
// //   };

// //   await transporter.sendMail(mailOptions);
// // };

// // module.exports = sendEmail;

// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const sendEmail = async (to, subject, html) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // ✔ use "gmail"
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Your App Name" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully");
//   } catch (error) {
//     console.error("❌ Email error:", error);
//     throw error;
//   }
// };

// module.exports = sendEmail;

// // const nodemailer = require("nodemailer");
// // require("dotenv").config();


// // const sendEmail = async (to, subject, text) => {
// //   const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });

// //   await transporter.sendMail({
// //     from: process.env.EMAIL_USER,
// //     to,
// //     subject,
// //     text,
// //   });
// // };

// // module.exports = sendEmail;
// // This function sends an email using Nodemailer with the provided recipient, subject, and text content.
// // It uses Gmail as the email service and requires environment variables for the email user and password.


// utils/sendEmail.js
// import { Resend } from 'resend';
// const { Resend } = require('resend');
// const { resetPasswordTemplate } = require('./emailTemplate');
// require('dotenv').config(); // Ensure you have dotenv to load environment variables

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendResetPasswordEmail = async ({ to, token }) => {
//   console.log("Sending reset password email to:", to);
//   const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
//   console.log("Reset link:", resetLink);

//   try {
//     const data = await resend.emails.send({
//       from: 'We Connect <onboarding@resend.dev>', // Can also be a verified domain email
//       // to: 'onaopemipomichael1999@gmail.com',
//       to: to, // Use the provided recipient email
//       subject: 'Reset your password',
//       html: resetPasswordTemplate(resetLink), // Use the template function to generate HTML
//       // html: `<p>Click the link below to reset your password:</p>
//       //        <a href="${resetLink}" style="font-weight: bold; font-size: 16px; text-decoration: italic; text-decoration: underline;">${resetLink}</a>
//       //        <p>If you did not request a password reset, please ignore this email.</p>`,
//     });

//     console.log("Resend API response:", data);
//     return { success: true, data };
//   } catch (error) {
//     console.error('Email sending failed:', error);
//     return { success: false, error };
//   }
// };

// module.exports = sendResetPasswordEmail;
// // This code uses the Resend API to send an email for resetting a user's password.
// // It constructs a reset link and sends an email with that link to the specified recipient.

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
  const resetLink = `http://localhost:3000/reset-password/${token}`;

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
