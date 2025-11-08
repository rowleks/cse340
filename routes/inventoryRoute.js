const express = require("express");
const router = express.Router();
const {
  renderByClassId,
  renderInvById,
} = require("../controllers/invController");

router.get("/type/:classificationId", renderByClassId);

router.get("/detail/:invId", renderInvById);

module.exports = router;
