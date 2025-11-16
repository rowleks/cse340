const express = require("express");
const utils = require("../utilities");
const {
  renderLogin,
  renderSignUp,
} = require("../controllers/accountController");
const router = express.Router();

router.get("/login", utils.handleErrors(renderLogin));
router.get("/register", utils.handleErrors(renderSignUp));

module.exports = router;
