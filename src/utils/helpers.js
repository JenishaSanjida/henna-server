// helpers.js

// Helper function to get the string representation of the day of the week
function getDayOfWeek(day) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[day];
}

module.exports = {
  getDayOfWeek,
};
