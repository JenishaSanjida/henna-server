// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { secretKey, expiresIn } = require("../config/config");
const { User } = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist or password doesn't match
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn });

    res.json({ token, expiresIn, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
