const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const loginController = require("../controller/login.controller");

// Login route
router.post(
  "/login",
  [
    body("identifier")
      .notEmpty()
      .withMessage("Identifier (email or username) is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await loginController.login(req, res);
  }
);

// router.post("/login", loginController.login);

module.exports = router;
// This code defines a login route using Express.js and validates the request body using express-validator.
// It checks for the presence of an identifier (email or username) and a password, ensuring the password is at least 6 characters long.
