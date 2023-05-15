const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
});

const Day = mongoose.model("Day", daySchema);

module.exports = Day;
