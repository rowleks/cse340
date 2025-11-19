const express = require("express");
const utils = require("../utilities");
const router = express.Router();
const {
  renderByClassId,
  renderInvById,
  renderInvMgmt,
  addNewClassification,
  renderClassificationForm,
} = require("../controllers/invController");
const invValidation = require("../utilities/inventory-validation");

router.get("/", utils.handleErrors(renderInvMgmt));

router.get("/type/:classificationId", utils.handleErrors(renderByClassId));

router.get("/detail/:invId", utils.handleErrors(renderInvById));

router.get("/add-classification", utils.handleErrors(renderClassificationForm));

router.post(
  "/add-classification",
  invValidation.addClassificationRules(),
  invValidation.checkClassificationData,
  utils.handleErrors(addNewClassification)
);

module.exports = router;
