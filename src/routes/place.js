const express = require("express");
const router = express.Router();

const places = require("../constants/places.json");

router.get("/divisions", async (req, res) => {
  const placeNames = Object.keys(places);
  res
    .status(200)
    .json({ data: placeNames, message: "API successful", status: "success" });
});

module.exports = router;
