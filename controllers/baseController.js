const utils = require("../utilities/");
const invModel = require("../models/inventory-model");

//Render the home view
async function renderHome(req, res) {
  const data = await invModel.getClassifications();
  const path = req.originalUrl;
  const nav = utils.buildNav(data, path);

  // req.flash("info", "This is a flash message.");

  res.render("index", { title: "Home", nav });
}

async function renderError(err, req, res, _) {
  const data = await invModel.getClassifications();
  const nav = utils.buildNav(data);
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  if (err.status == 404) {
    message = "Page Not found";
  } else {
    message = "Something went wrong. Try a different route.";
  }

  res.render("errors/error", {
    title: err.status ? "404 Error" : "Server Error",
    nav,
    message,
  });
}

module.exports = { renderHome, renderError };
