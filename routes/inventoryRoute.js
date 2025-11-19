const express = require("express");
const utils = require("../utilities");
const router = express.Router();
const {
  renderByClassId,
  renderInvById,
  renderInvMgmt,
} = require("../controllers/invController");

router.get("/", utils.handleErrors(renderInvMgmt));

router.get("/type/:classificationId", utils.handleErrors(renderByClassId));

router.get("/detail/:invId", utils.handleErrors(renderInvById));

module.exports = router;
