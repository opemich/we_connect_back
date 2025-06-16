const express = require("express");
const router = express.Router();
const registerController = require("../controller/register.controller");

// Register route
router.post("/submit-form", async (req, res) => {
  try {
    // Call the register controller function
    await registerController.register(req, res);
  } catch (error) {
    // Handle any errors that occur during registration
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export the router
module.exports = router;