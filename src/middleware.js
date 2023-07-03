// middleware.js
const jwt = require("jsonwebtoken");
const { secretKey } = require("./config/config");

// Middleware function to validate JWT token
const authenticateToken = (req, res, next) => {
  // Extract the token from the request header
  const token = req.headers["authorization"];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId; // Store the decoded user ID in the request
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticateToken;
