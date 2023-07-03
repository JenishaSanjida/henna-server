const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
// Import API routes
// const authRoutes = require('./routes/auth');
const userRouter = require("./routes/user");
const placeRouter = require("./routes/place");
const appointmentRouter = require("./routes/appointment");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware");

// Set up the server
const app = express();
const port = process.env.PORT || 3000;

// Use middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/uploads", express.static("/app/uploads")); // uploaded files
// Use API routes
app.use("/api", userRouter);
app.use("/api/place", placeRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/auth", authRoutes);
// app.use('/api/customers', customerRoutes);

// Protected routes
app.get("/api/protected", authenticateToken, (req, res) => {
  console.log("Authenticated user ID:", req.userId);
  // Access the authenticated user ID from req.userId
  const userId = req.userId;
  res.json({ message: `Protected route accessed by user ${userId}` });
});

// app.get("/users", async (req, res) => {
//   const users = await db.User.find();
//   res.send(users);
// });

// app.get("/", async (req, res) => {
//   res.send({ message: "successful" });
// });

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
