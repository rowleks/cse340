//Render the home view
const accountModel = require("../models/account-model");
const utils = require("../utilities");

// Render login view
async function renderLogin(_, res) {
  const nav = await utils.buildNav();

  res.render("account/login", { title: "Login", nav, errors: null });
}

// Render sign-up view
async function renderSignUp(_, res) {
  const nav = await utils.buildNav();

  res.render("account/register", { title: "Registration", nav, errors: null });
}

//Register an account
async function registerAccount(req, res) {
  const nav = await utils.buildNav();

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
      `Congratulations! You're registered ${account_firstname}. Please Login`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("error", "Sorry, the registration failed.");

    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

module.exports = { renderLogin, renderSignUp, registerAccount };
