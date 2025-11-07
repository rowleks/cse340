const utils = require("../utilities/");
const invModel = require("../models/inventory-model");

//Render the home view
async function renderHome(_, res) {
  const data = await invModel.getClassifications();
  const nav = utils.buildNav(data);

  res.render("index", { title: "Home", nav });
}

async function renderError(err, req, res, _) {
  const data = await invModel.getClassifications();
  const nav = utils.buildNav(data);
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  res.render("errors/error", {
    title: err.status || "Server Error",
    nav,
    message: err.message,
  });
}

module.exports = { renderHome, renderError };
