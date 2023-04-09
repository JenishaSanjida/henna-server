const mongoose = require("mongoose");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const Portfolio = require("../models/portfolio");
const Rating = require("../models/rating");
const Review = require("../models/review");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
);

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
