const express = require("express");
const router = express.Router();
const { 
  getJoinedData, 
  getGenreByGender, 
  getActivityByLocation 
} = require("../controllers/joinController");

// Rotte esistenti e nuove
router.get("/", getJoinedData);
router.get("/genre-by-gender", getGenreByGender);
router.get("/activity-by-location", getActivityByLocation);

module.exports = router;