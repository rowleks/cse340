const invModel = require("../models/inventory-model");
const utils = require("../utilities/");

// Render the inventory view (grouped by classification)
async function renderByClassId(req, res) {
  const classId = req.params.classificationId;
  const path = req.originalUrl;
  const data = await invModel.getInvByClassId(classId);
  const classificationData = await invModel.getClassifications();

  // Pass in the current path to style active
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

//Render single inventory view
async function renderInvById(req, res) {
  const path = req.originalUrl;
  const inv_id = req.params.invId;
  const classificationData = await invModel.getClassifications();
  const singleInvData = await invModel.getInvById(inv_id);

  // Pass in classification id to style active nav
  const classificationId = singleInvData[0]?.classification_id;
  const nav = utils.buildNav(classificationData, path, classificationId);

  const content = utils.buildSingleInv(singleInvData);

  let title = "";

  if (singleInvData.length > 0) {
    const { inv_make, inv_year, inv_model } = singleInvData[0];

    title = `${inv_year} ${inv_make} ${inv_model}`;
  } else {
    title = "Vehicle not found";
  }

  res.render("./inventory/detail", {
    title,
    nav,
    content,
  });
}

module.exports = { renderByClassId, renderInvById };
