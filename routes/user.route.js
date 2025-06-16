const express = require("express");
const FormData = require("../model/formData.model");
const authenticateToken = require("../middleware/user.middleware");
const router = express.Router();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await FormData.findById(req.user.userId).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
