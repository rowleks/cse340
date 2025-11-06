const express = require("express");
const router = express.Router();
const { renderByClassId } = require("../controllers/invController");

router.get("/type/:classificationId", renderByClassId);

module.exports = router;
