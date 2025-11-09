const utils = require("../utilities/");
const invModel = require("../models/inventory-model");
async function renderServerError(_, res) {
  const classificationData = await invModel.getClassifications();

  // Comment out nav to generate the error
  // const nav = utils.buildNav(classificationData, path);
  const grid = utils.buildClassGrid(data);

  res.render("errors/error", {
    title: err.status || "Server Error",
    nav,
    message,
  });
}

module.exports = { renderServerError };
