//Render the home view
const invModel = require("../models/inventory-model");
const utils = require("../utilities");

// Render login view
async function renderLogin(_, res) {
  const data = await invModel.getClassifications();
  const nav = utils.buildNav(data);

  res.render("account/login", { title: "Login", nav });
}

// Render sign-up view
async function renderSignUp(_, res) {
  const data = await invModel.getClassifications();
  const nav = utils.buildNav(data);

  res.render("account/register", { title: "Login", nav, errors: null });
}

module.exports = { renderLogin, renderSignUp };
