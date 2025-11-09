const express = require("express");
const utils = require("../utilities");
const router = express.Router();
const { renderServerError } = require("../controllers/errorController");

router.get("/server-error", utils.handleErrors(renderServerError));

module.exports = router;
