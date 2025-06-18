// const bcrypt = require("bcrypt");
// const FormData = require("../model/formData.model");

// const register = async (req, res) => {
//   // Check if the required fields are present
//   if (
//     !req.body.fullname ||
//     !req.body.username ||
//     !req.body.email ||
//     !req.body.mobile ||
//     !req.body.address ||
//     !req.body.city ||
//     !req.body.state ||
//     !req.body.country ||
//     !req.body.password ||
//     !req.body.confirmPassword
//   ) {
//     return res.status(400).json({ error: "All fields are required" });
//   }
//   // existing data
//   const emailData = req.body.email;
//   const existingData = await FormData.findOne({ email: emailData });
//   if (existingData) {
//     return res.status(400).json({ error: "This user already exists" });
//   }

//   // Check if the username already exists
//   const usernameData = req.body.username;
//   const existingUsername = await FormData.findOne({ username: usernameData });
//   if (existingUsername) {
//     return res.status(400).json({ error: "This username already exists" });
//   }

//   // Check if the mobile number already exists
//   const mobileData = req.body.mobile;
//   const existingMobile = await FormData.findOne({ mobile: mobileData });
//   if (existingMobile) {
//     return res.status(400).json({ error: "This mobile number already exists" });
//   }

//   // Create a new form data entry
//   try {
//     const {
//       fullname,
//       username,
//       email,
//       mobile,
//       address,
//       city,
//       state,
//       country,
//       password,
//     } = req.body;

//     // hash the password before saving
//     const saltRounds = 10;
//     const hashedPassword = bcrypt.hashSync(password, saltRounds);

//     const newFormData = new FormData({
//       fullname,
//       username,
//       email,
//       mobile,
//       address,
//       city,
//       state,
//       country,
//       password: hashedPassword,
//     });
//     await newFormData.save();

//     // Compare the provided password with the stored hashed password
//     const isPasswordValid = bcrypt.compare(password, newFormData.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Invalid password" });
//     }
//     res.status(200).json({ message: "Form data submitted successfully" });
//   } catch (error) {
//     console.error("Error saving form data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = register; // Export the register function for use in routes
// // This code defines a register function that handles user registration by checking for existing users, hashing the password, and saving the new user data to the database.

// const bcrypt = require("bcrypt");
// const FormData = require("../model/formData.model");

// const register = async (req, res) => {
//   try {
//     const {
//       fullname,
//       username,
//       email,
//       mobile,
//       address,
//       city,
//       state,
//       country,
//       password,
//       confirmPassword,
//     } = req.body;

//     // Validate required fields
//     if (
//       !fullname ||
//       !username ||
//       !email ||
//       !mobile ||
//       !address ||
//       !city ||
//       !state ||
//       !country ||
//       !password ||
//       !confirmPassword
//     ) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     // Check for existing user data
//     const existingEmail = await FormData.findOne({ email });
//     if (existingEmail) {
//       return res
//         .status(400)
//         .json({ error: "This email is already registered" });
//     }

//     const existingUsername = await FormData.findOne({ username });
//     if (existingUsername) {
//       return res.status(400).json({ error: "This username is already taken" });
//     }

//     const existingMobile = await FormData.findOne({ mobile });
//     if (existingMobile) {
//       return res
//         .status(400)
//         .json({ error: "This mobile number already exists" });
//     }

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Save new user
//     const newUser = new FormData({
//       fullname,
//       username,
//       email,
//       mobile,
//       address,
//       city,
//       state,
//       country,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     return res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = { register };

const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const FormData = require("../model/formData.model");

const register = async (req, res) => {
  console.log("🔥 Register Request Received");
  console.log("Body:", req.body);

  // Check for validation errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("❌ Validation Errors:", errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      fullname,
      username,
      email,
      mobile,
      address,
      city,
      state,
      country,
      password,
      confirmPassword,
    } = req.body;

    // Check for existing user data
    const existingEmail = await FormData.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already registered" });
    }

    const existingUsername = await FormData.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "This username is already taken" });
    }

    const existingMobile = await FormData.findOne({ mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json({ success: false, message: "This mobile number already exists" });
    }

    // Hash the password (using same salt rounds as reset password for consistency)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save new user
    const newUser = new FormData({
      fullname,
      username,
      email,
      mobile,
      address,
      city,
      state,
      country,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register };
