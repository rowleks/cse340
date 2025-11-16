const express = require("express");
const utils = require("../utilities");
const { renderLogin } = require("../controllers/accountController");
const router = express.Router();

router.get("/login", utils.handleErrors(renderLogin));

module.exports = router;
