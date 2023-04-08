const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  designs: [
    {
        type: String,
        required: true,
    },
  ],
}, { timestamps: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
