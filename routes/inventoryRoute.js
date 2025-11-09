const express = require("express");
const utils = require("../utilities");
const router = express.Router();
const {
  renderByClassId,
  renderInvById,
} = require("../controllers/invController");

router.get("/type/:classificationId", utils.handleErrors(renderByClassId));

router.get("/detail/:invId", utils.handleErrors(renderInvById));

module.exports = router;
