const FormData = require("../model/formData.model"); // Import the FormData model
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation

const login = async (req, res) => {
  const { identifier, password } = req.body; // "identifier" can be email or username

  try {
    // Find user by email OR username
    const user = await FormData.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    } // User found

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    } // Password matches
    // Password matches, proceed with login

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    ); // Create token with user details

    res.status(200).json({
      message: "Login successful",
      token,
      user: { username: user.username, email: user.email }, // Return user details
    }); // Respond with success message and token
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { login }; // Export the login function for use in routes
// This code defines a login function that authenticates a user based on either their email or username and password.