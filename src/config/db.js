const mongoose = require("mongoose");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const Portfolio = require("../models/portfolio");
const Rating = require("../models/rating");
const Review = require("../models/review");

mongoose.connect("mongodb://localhost:27017/henna_db");

User.ensureIndexes();
Appointment.ensureIndexes();
Portfolio.ensureIndexes();
Rating.ensureIndexes();
Review.ensureIndexes();

module.exports = {
  User,
  Appointment,
  Portfolio,
  Rating,
  Review,
};
