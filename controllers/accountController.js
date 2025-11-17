//Render the home view
const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
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

  res.render("account/register", { title: "Registration", nav, errors: null });
}

//Register an account
async function registerAccount(req, res) {
  const data = await invModel.getClassifications();
  const nav = utils.buildNav(data);

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.storeNewAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "success",
      `Congratulations you're registered ${account_firstname}. Please Login`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("error", "Sorry, the registration failed.");

    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

module.exports = { renderLogin, renderSignUp, registerAccount };
