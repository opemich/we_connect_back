// const express = require("express");
// const router = express.Router();
// const registerController = require("../controller/register.controller");

// // Register route
// router.post("/submit-form", async (req, res) => {
//   try {
//     // Call the register controller function
//     await registerController.register(req, res);
//   } catch (error) {
//     // Handle any errors that occur during registration
//     console.error("Registration error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Export the router
// module.exports = router;

const express = require("express");
const { body } = require('express-validator');
const router = express.Router();
const registerController = require("../controller/register.controller");

// Register route with validation
router.post("/submit-form", 
  [
    body('fullname').notEmpty().withMessage('Full name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('mobile').notEmpty().withMessage('Mobile number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Must be 8+ chars')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must include upper, lower, and number'),
    body('confirmPassword')
      .custom((val, { req }) => {
        if (val !== req.body.password) {
          throw new Error('Passwords must match');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      // Call the register controller function
      await registerController.register(req, res);
    } catch (error) {
      // Handle any errors that occur during registration
      console.error("Registration error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

// Export the router
module.exports = router;