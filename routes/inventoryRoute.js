const express = require("express");
const utils = require("../utilities");
const router = express.Router();
const {
  renderByClassId,
  renderInvById,
  renderInvMgmt,
  addNewClassification,
  renderClassificationForm,
  renderAddInvForm,
  addNewInv,
  getInventoryJSON,
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

router.get("/add-inventory", utils.handleErrors(renderAddInvForm));

router.post(
  "/add-inventory",
  invValidation.addInventoryRules(),
  invValidation.checkInventoryData,
  utils.handleErrors(addNewInv)
);

router.get(
  "/getInventory/:classificationId",
  utils.handleErrors(getInventoryJSON)
);

module.exports = router;
