const utils = require("../utilities/");
const invModel = require("../models/inventory-model");

//Render the home view
async function renderHome(_, res) {
  const data = await invModel.getClassifications();
  const nav = utils.buildNav(data);
  res.render("index", { title: "Home", nav });
}

module.exports = { renderHome };
