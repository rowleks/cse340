const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utils = require("../utilities/");

// Route to add a review
router.post(
  "/add",
  utils.checkLoginStatus,
  utils.handleErrors(reviewController.addReview),
);

module.exports = router;
