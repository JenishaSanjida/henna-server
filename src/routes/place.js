const express = require("express");
const router = express.Router();

const places = require("../constants/places.json");

router.get("/divisions", async (req, res) => {
  const placeNames = Object.keys(places);
  res
    .status(200)
    .json({
      data: placeNames,
      message: "API successful",
      status: "success",
      endpoint: "all-places",
    });
});

router.get("/:division", (req, res) => {
  const division = req.params.division;
  const placeData = places[division];
  if (!placeData) {
    res.status(404).send("Division not found");
    return;
  }
  const subPlaceNames = Object.keys(placeData);
  res.status(200).json({
    data: subPlaceNames,
    message: "API successful",
    status: "success",
    endpoint: "by-division",
  });
});

router.get("/:division/:district", (req, res) => {
  const division = req.params.division;
  const district = req.params.district;
  const placeData = places[division];
  if (!placeData) {
    res.status(404).send("Division not found");
    return;
  }
  const subPlaceData = placeData[district];
  if (!subPlaceData) {
    res.status(404).send("District not found");
    return;
  }
  res.status(200).json({
    data: subPlaceData,
    message: "API successful",
    status: "success",
    endpoint: "by-district",
  });
});

module.exports = router;
