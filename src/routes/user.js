// user.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const authenticateToken = require("../middleware");
// const User = require("../models/user");
// const Portfolio = require("../models/portfolio");
const { User, Portfolio } = require("../config/db");
const multer = require("multer");
const { getDayOfWeek } = require("../utils/helpers");
// Set up Multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (user.password != password) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Generate JWT token
    // const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    // Return the token
    // return res.send({ token });
    res.send({ data: {}, message: "", status: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/check", async (req, res) => {
  res
    .status(200)
    .json({ data: {}, message: "API successful", status: "success" });
});

router.get("/user/list", authenticateToken, async (req, res) => {
  const { page = 1, size = 10, division, district, thana, role } = req.query;

  // Create a filter object to store the search criteria
  const filter = {};

  // Add filters based on the query parameters
  if (division) {
    filter.division = division;
  }
  if (district) {
    filter.district = district;
  }
  if (thana) {
    filter.thana = thana;
  }
  if (role) {
    filter.role = role;
  }

  /**
   * Pagination Details
   */
  const count = await User.countDocuments(filter);
  const totalPages = Math.ceil(count / size);
  const currentPage = parseInt(page);

  // API logic for getting users with pagination
  const users = await User.find(filter)
    .skip((currentPage - 1) * size)
    .limit(size)
    .populate("portfolio");

  // const users = await User.find().populate("portfolio"); // getting all the users

  const metaData = {
    currentPage,
    totalPages,
    totalRecords: count,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };

  res.send({ data: users, meta: metaData, message: "", status: "success" });
});

/**
 * User create API
 */
router.post("/user/save", async (req, res) => {
  // API logic for creating a user
  try {
    // create a new user with reference to their portfolio
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      address: req.body.address,
      division: req.body.division,
      district: req.body.district,
      thana: req.body.thana,
      territory: req.body.territory,
    });

    // create a new portfolio for the user
    const portfolio = new Portfolio({
      designer: user._id,
      designs: [],
    });

    // save the portfolio
    const savedPortfolio = await portfolio.save();

    // set the user's portfolio reference to the new portfolio's _id
    user.portfolio = savedPortfolio._id;

    // save the user
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/user/:id", (req, res) => {
  // API logic for updating a user
});

/**
 * User's schedule save API
 */
router.post("/user/:id/schedule/save", async (req, res) => {
  const userId = req.params.id;
  const { dayOfWeek, timeSlot } = req.body;
  try {
    // Find the user by ID
    const user = await User.findById(userId).populate("portfolio");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the schedule for the given day of the week
    const daySchedule = user.schedule.find(
      (schedule) => schedule.dayOfWeek === dayOfWeek
    );

    if (!daySchedule) {
      // Create a new schedule for the day if it doesn't exist
      user.schedule.push({
        dayOfWeek,
        timeSlots: [
          {
            time: timeSlot,
            isBooked: false,
          },
        ],
      });
    } else {
      // Check if the time slot is already booked
      const existingTimeSlot = daySchedule.timeSlots.find(
        (slot) => slot.time === timeSlot
      );

      if (existingTimeSlot && existingTimeSlot.isBooked) {
        return res.status(400).json({ error: "Time slot already booked" });
      }

      // Check if the time slot exists in the schedule
      if (!existingTimeSlot) {
        daySchedule.timeSlots.push({
          time: timeSlot,
          isBooked: false,
        });
      }
    }

    // Save the updated user schedule
    await user.save();

    return res
      .status(200)
      .json({ message: "Schedule saved successfully", user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.delete("/user/:id", (req, res) => {
  // API logic for deleting a user
});

/**
 * Upload image to user's profile API
 * POST route for adding a new image to a user's portfolio
 */
router.post(
  "/users/:id/portfolio/images",
  upload.single("image"),
  async (req, res) => {
    const userId = req.params.id;
    // const file = req.file;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let portfolio = await Portfolio.findOne({ designer: user._id });

      if (!portfolio) {
        portfolio = new Portfolio({ designer: user._id });
        await portfolio.save();
        user.portfolio = portfolio._id;
        await user.save();
      }

      // const image = {
      //   filename: req.file.filename,
      //   path: req.file.path,
      //   contentType: req.file.mimetype,
      // };
      portfolio.designs.push(req.file.filename);
      await portfolio.save();

      res.status(200).json({ message: "Image added to portfolio", portfolio });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error adding image to portfolio" });
    }
  }
);

// Update user's avatar
router.put(
  "/user/:userId/avatar",
  upload.single("avatar"),
  async (req, res) => {
    const userId = req.params.userId;

    try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete the previous avatar file if it exists
      if (user.avatar) {
        const previousAvatarPath = path.join(
          __dirname,
          "../../uploads",
          user.avatar
        );
        if (fs.existsSync(previousAvatarPath)) {
          fs.unlinkSync(previousAvatarPath);
        }
      }

      // Update the user's avatar URL in the User model
      user.avatar = req.file.filename;
      await user.save();

      res.status(200).json({
        message: "Avatar updated successfully",
        avatar: req.file.filename,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get available schedule for a user on a specific date
router.get("/user/get/schedules", async (req, res) => {
  const userId = req.query.userId;
  const requestedDate = req.query.date;

  console.log("userId,requestedDate");
  console.log(userId, requestedDate);

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convert the requested date string to a JavaScript Date object
    const date = new Date(requestedDate);

    // Get the string representation of the day of the week
    const dayOfWeek = getDayOfWeek(date.getDay());

    // Find the schedule for the requested day
    const daySchedule = user.schedule.find(
      (schedule) => schedule.dayOfWeek === dayOfWeek
    );

    if (!daySchedule) {
      return res.status(400).json({ error: "Invalid day of the week" });
    }

    // Filter out the booked time slots for the requested date
    // const availableTimeSlots = daySchedule.timeSlots.filter(
    //   (slot) => !slot.isBooked
    // );

    return res.status(200).json({ schedule: daySchedule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
