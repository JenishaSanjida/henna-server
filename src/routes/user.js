const express = require("express");
const User = require("../models/user");
const Portfolio = require("../models/portfolio");
const router = express.Router();


router.get("/list", (req, res) => {
  // API logic for getting users
});

router.post("/save", async (req, res) => {
  // API logic for creating a user
  try {
    // create a new portfolio for the user
    const portfolio = new Portfolio({
      designer: 'req.body._id',
      designs: [],
    });
    const savedPortfolio = await portfolio.save();

    // create a new user with reference to their portfolio
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      address: req.body.address,
      territory: req.body.territory,
      portfolio: savedPortfolio._id,
    });

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

router.delete("/user/:id", (req, res) => {
  // API logic for deleting a user
});

module.exports = router;
