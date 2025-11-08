const invModel = require("../models/inventory-model");
const utils = require("../utilities/");

// Render the inventory view
async function renderByClassId(req, res, _) {
  const classification_id = req.params.classificationId;
  const path = req.originalUrl;
  const data = await invModel.getInvByClassId(classification_id);
  const classificationData = await invModel.getClassifications();
  const nav = utils.buildNav(classificationData, path);
  const grid = utils.buildClassGrid(data);
  const classificationName =
    data.length > 0 ? data[0].classification_name : "Not Found";
  res.render("./inventory/classification", {
    title: `${classificationName} Vehicles`,
    nav,
    grid,
  });
}

module.exports = { renderByClassId };
