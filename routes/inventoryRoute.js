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
  updateInv,
  renderEditInv,
  renderDeleteInv,
  deleteInv,
} = require("../controllers/invController");
const invValidation = require("../utilities/inventory-validation");

router.get(
  "/",
  utils.checkLoginStatus,
  utils.checkLoginAuthZ,
  utils.handleErrors(renderInvMgmt),
);

router.get("/type/:classificationId", utils.handleErrors(renderByClassId));

router.get("/detail/:invId", utils.handleErrors(renderInvById));

router.get("/add-classification", utils.handleErrors(renderClassificationForm));

router.post(
  "/add-classification",
  invValidation.addClassificationRules(),
  invValidation.checkClassificationData,
  utils.handleErrors(addNewClassification),
);

router.get("/add-inventory", utils.handleErrors(renderAddInvForm));

router.post(
  "/add-inventory",
  invValidation.addInventoryRules(),
  invValidation.checkInventoryData,
  utils.handleErrors(addNewInv),
);

router.get(
  "/getInventory/:classificationId",
  utils.handleErrors(getInventoryJSON),
);

router.get("/edit/:invId", utils.handleErrors(renderEditInv));

router.post(
  "/update-inventory",
  invValidation.addInventoryRules(),
  invValidation.checkInventoryUpdateData,
  utils.handleErrors(updateInv),
);

router.get("/delete/:invId", utils.handleErrors(renderDeleteInv));
router.post("/delete-inventory", utils.handleErrors(deleteInv));

module.exports = router;
